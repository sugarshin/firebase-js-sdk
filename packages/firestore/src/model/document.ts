/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SnapshotVersion } from '../core/snapshot_version';
import { fail } from '../util/assert';

import { DocumentKey } from './document_key';
import { ObjectValue } from './object_value';
import { FieldPath } from './path';
import { valueCompare } from './values';

const enum DocumentType {
  /**
   * Represents the initial state of a MutableDocument when only the document
   * key is known. Invalid documents transition to other states as mutations are
   * applied. If a document remains invalid after applying mutations, it should
   * be discarded.
   */
  INVALID,
  /**
   * Represents a document in Firestore with a key, version, data and whether
   * the data has local mutations applied to it.
   */
  FOUND_DOCUMENT,
  /** Represents that no documents exists for the key at the given version. */
  NO_DOCUMENT,
  /**
   * Represents an existing document whose data is unknown (e.g. a document that
   * was updated without a known base document).
   */
  UNKNOWN_DOCUMENT
}

/** Describes the `hasPendingWrites` state of a document. */
const enum DocumentState {
  /** No mutations applied. Document was sent to us by Watch. */
  SYNCED,
  /**
   * Local mutations applied via the mutation queue. Document is potentially
   * inconsistent.
   */
  HAS_LOCAL_MUTATIONS,
  /**
   * Mutations applied based on a write acknowledgment. Document is potentially
   * inconsistent.
   */
  HAS_COMMITTED_MUTATIONS
}

/**
 * Represents a document in Firestore with a key, version, data and whether the
 * data has local mutations applied to it.
 */
export interface Document {
  /** The key for this document */
  readonly key: DocumentKey;

  /**
   * The version of this document if it exists or a version at which this
   * document was guaranteed to not exist.
   */
  readonly version: SnapshotVersion;

  /** The underlying data of this document or an empty value if no data exists. */
  readonly data: ObjectValue;

  /** Returns whether local mutations were applied via the mutation queue. */
  readonly hasLocalMutations: boolean;

  /** Returns whether mutations were applied based on a write acknowledgment. */
  readonly hasCommittedMutations: boolean;

  /**
   * Whether this document had a local mutation applied that has not yet been
   * acknowledged by Watch.
   */
  readonly hasPendingWrites: boolean;

  /**
   * Returns whether this document is valid (i.e. it is an entry in the
   * RemoteDocumentCache, was created by a mutation or read from the backend).
   */
  isValidDocument(): boolean;

  /**
   * Returns whether the document exists and its data is known at the current
   * version.
   */
  isFoundDocument(): boolean;

  /**
   * Returns whether the document is known to not exist at the current version.
   */
  isNoDocument(): boolean;

  /**
   * Returns whether the document exists and its data is unknown at the current
   * version.
   */
  isUnknownDocument(): boolean;

  isEqual(other: Document | null | undefined): boolean;

  toString(): string;
}

/**
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */
export class MutableDocument implements Document {
  private constructor(
    readonly key: DocumentKey,
    private documentType: DocumentType,
    public version: SnapshotVersion,
    public data: ObjectValue,
    private documentState: DocumentState
  ) {}

  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(documentKey: DocumentKey): MutableDocument {
    return new MutableDocument(
      documentKey,
      DocumentType.INVALID,
      SnapshotVersion.min(),
      ObjectValue.empty(),
      DocumentState.SYNCED
    );
  }

  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(
    documentKey: DocumentKey,
    version: SnapshotVersion,
    value: ObjectValue
  ): MutableDocument {
    return new MutableDocument(
      documentKey,
      DocumentType.FOUND_DOCUMENT,
      version,
      value,
      DocumentState.SYNCED
    );
  }

  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(
    documentKey: DocumentKey,
    version: SnapshotVersion
  ): MutableDocument {
    return new MutableDocument(
      documentKey,
      DocumentType.NO_DOCUMENT,
      version,
      ObjectValue.empty(),
      DocumentState.SYNCED
    );
  }

  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(
    documentKey: DocumentKey,
    version: SnapshotVersion
  ): MutableDocument {
    return new MutableDocument(
      documentKey,
      DocumentType.UNKNOWN_DOCUMENT,
      version,
      ObjectValue.empty(),
      DocumentState.HAS_COMMITTED_MUTATIONS
    );
  }

  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(
    version: SnapshotVersion,
    value: ObjectValue
  ): MutableDocument {
    this.version = version;
    this.documentType = DocumentType.FOUND_DOCUMENT;
    this.data = value;
    this.documentState = DocumentState.SYNCED;
    return this;
  }

  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(version: SnapshotVersion): MutableDocument {
    this.version = version;
    this.documentType = DocumentType.NO_DOCUMENT;
    this.data = ObjectValue.empty();
    this.documentState = DocumentState.SYNCED;
    return this;
  }

  /**
   * Changes the document type to indicate that it exists at a given version but
   * that is data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(version: SnapshotVersion): MutableDocument {
    this.version = version;
    this.documentType = DocumentType.UNKNOWN_DOCUMENT;
    this.data = ObjectValue.empty();
    this.documentState = DocumentState.HAS_COMMITTED_MUTATIONS;
    return this;
  }

  setHasCommittedMutations(): MutableDocument {
    this.documentState = DocumentState.HAS_COMMITTED_MUTATIONS;
    return this;
  }

  setHasLocalMutations(): MutableDocument {
    this.documentState = DocumentState.HAS_LOCAL_MUTATIONS;
    return this;
  }

  get hasLocalMutations(): boolean {
    return this.documentState === DocumentState.HAS_LOCAL_MUTATIONS;
  }

  get hasCommittedMutations(): boolean {
    return this.documentState === DocumentState.HAS_COMMITTED_MUTATIONS;
  }

  get hasPendingWrites(): boolean {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }

  isValidDocument(): boolean {
    return this.documentType !== DocumentType.INVALID;
  }

  isFoundDocument(): boolean {
    return this.documentType === DocumentType.FOUND_DOCUMENT;
  }

  isNoDocument(): boolean {
    return this.documentType === DocumentType.NO_DOCUMENT;
  }

  isUnknownDocument(): boolean {
    return this.documentType === DocumentType.UNKNOWN_DOCUMENT;
  }

  isEqual(other: Document | null | undefined): boolean {
    return (
      other instanceof MutableDocument &&
      this.key.isEqual(other.key) &&
      this.version.isEqual(other.version) &&
      this.documentType === other.documentType &&
      this.documentState === other.documentState &&
      this.data.isEqual(other.data)
    );
  }

  clone(): MutableDocument {
    return new MutableDocument(
      this.key,
      this.documentType,
      this.version,
      this.data.clone(),
      this.documentState
    );
  }

  toString(): string {
    return (
      `Document(${this.key}, ${this.version}, ${JSON.stringify(
        this.data.toProto()
      )}, ` +
      `{documentType: ${this.documentType}}), ` +
      `{documentState: ${this.documentState}})`
    );
  }
}

/**
 * Compares the value for field `field` in the provided documents. Throws if
 * the field does not exist in both documents.
 */
export function compareDocumentsByField(
  field: FieldPath,
  d1: Document,
  d2: Document
): number {
  const v1 = d1.data.field(field);
  const v2 = d2.data.field(field);
  if (v1 !== null && v2 !== null) {
    return valueCompare(v1, v2);
  } else {
    return fail("Trying to compare documents on fields that don't exist");
  }
}
