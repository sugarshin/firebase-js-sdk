/**
 * @license
 * Copyright 2020 Google LLC
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

import * as api from './firestore_proto_api';

/** Properties of a BundledQuery. */
export interface BundledQuery {
  /** BundledQuery parent */
  parent?: string | null;

  /** BundledQuery structuredQuery */
  structuredQuery?: api.StructuredQuery | null;

  /** BundledQuery limitType */
  limitType?: BundledQuery.LimitType | null;
}

export namespace BundledQuery {
  /** LimitType enum. */
  type LimitType = 'FIRST' | 'LAST';
}

/** Properties of a NamedQuery. */
export interface NamedQuery {
  /** NamedQuery name */
  name?: string | null;

  /** NamedQuery bundledQuery */
  bundledQuery?: BundledQuery | null;

  /** NamedQuery readTime */
  readTime?: api.Timestamp | null;
}

/** Properties of a BundledDocumentMetadata. */
export interface BundledDocumentMetadata {
  /** BundledDocumentMetadata name */
  name?: string | null;

  /** BundledDocumentMetadata readTime */
  readTime?: api.Timestamp | null;

  /** BundledDocumentMetadata exists */
  exists?: boolean | null;
}

/** Properties of a BundleMetadata. */
interface BundleMetadata {
  /** BundleMetadata id */
  id?: string | null;

  /** BundleMetadata createTime */
  createTime?: api.Timestamp | null;

  /** BundleMetadata version */
  version?: number | null;
}

/** Properties of a BundleElement. */
interface BundleElement {
  /** BundleElement metadata */
  metadata?: BundleMetadata | null;

  /** BundleElement namedQuery */
  namedQuery?: NamedQuery | null;

  /** BundleElement documentMetadata */
  documentMetadata?: BundledDocumentMetadata | null;

  /** BundleElement document */
  document?: api.Document | null;
}
