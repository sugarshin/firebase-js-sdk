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

import { fatal } from '../core/util/util';
import { parseRepoInfo } from '../core/util/libs/parser';
import { newEmptyPath } from '../core/util/Path';
import { Reference } from './Reference';
import { Repo, repoInterrupt, repoResume, repoStart } from '../core/Repo';
import {
  repoManagerApplyEmulatorSettings,
  repoManagerDeleteRepo
} from '../core/RepoManager';
import { validateArgCount } from '@firebase/util';
import { validateUrl } from '../core/util/validation';
import { FirebaseApp } from '@firebase/app-types';
import { FirebaseService } from '@firebase/app-types/private';

/**
 * Class representing a firebase database.
 */
export class Database implements FirebaseService {
  /** Track if the instance has been used (root or repo accessed) */
  private instanceStarted_: boolean = false;

  /** Backing state for root_ */
  private rootInternal_?: Reference;

  static readonly ServerValue = {
    TIMESTAMP: {
      '.sv': 'timestamp'
    },
    increment: (delta: number) => {
      return {
        '.sv': {
          'increment': delta
        }
      };
    }
  };

  /**
   * The constructor should not be called by users of our public API.
   */
  constructor(private repoInternal_: Repo) {
    if (!(repoInternal_ instanceof Repo)) {
      fatal(
        "Don't call new Database() directly - please use firebase.database()."
      );
    }
  }

  INTERNAL = {
    delete: async () => {
      this.checkDeleted_('delete');
      repoManagerDeleteRepo(this.repo_);
      this.repoInternal_ = null;
      this.rootInternal_ = null;
    }
  };

  private get repo_(): Repo {
    if (!this.instanceStarted_) {
      repoStart(this.repoInternal_);
      this.instanceStarted_ = true;
    }
    return this.repoInternal_;
  }

  get root_(): Reference {
    if (!this.rootInternal_) {
      this.rootInternal_ = new Reference(this.repo_, newEmptyPath());
    }

    return this.rootInternal_;
  }

  get app(): FirebaseApp {
    return this.repo_.app as FirebaseApp;
  }

  /**
   * Modify this instance to communicate with the Realtime Database emulator.
   *
   * <p>Note: This method must be called before performing any other operation.
   *
   * @param host the emulator host (ex: localhost)
   * @param port the emulator port (ex: 8080)
   */
  useEmulator(host: string, port: number): void {
    this.checkDeleted_('useEmulator');
    if (this.instanceStarted_) {
      fatal(
        'Cannot call useEmulator() after instance has already been initialized.'
      );
      return;
    }

    // Modify the repo to apply emulator settings
    repoManagerApplyEmulatorSettings(this.repoInternal_, host, port);
  }

  /**
   * Returns a reference to the root or to the path specified in the provided
   * argument.
   *
   * @param path The relative string path or an existing Reference to a database
   * location.
   * @throws If a Reference is provided, throws if it does not belong to the
   * same project.
   * @return Firebase reference.
   */
  ref(path?: string): Reference;
  ref(path?: Reference): Reference;
  ref(path?: string | Reference): Reference {
    this.checkDeleted_('ref');
    validateArgCount('database.ref', 0, 1, arguments.length);

    if (path instanceof Reference) {
      return this.refFromURL(path.toString());
    }

    return path !== undefined ? this.root_.child(path) : this.root_;
  }

  /**
   * Returns a reference to the root or the path specified in url.
   * We throw a exception if the url is not in the same domain as the
   * current repo.
   * @return Firebase reference.
   */
  refFromURL(url: string): Reference {
    /** @const {string} */
    const apiName = 'database.refFromURL';
    this.checkDeleted_(apiName);
    validateArgCount(apiName, 1, 1, arguments.length);
    const parsedURL = parseRepoInfo(url, this.repo_.repoInfo_.nodeAdmin);
    validateUrl(apiName, 1, parsedURL);

    const repoInfo = parsedURL.repoInfo;
    if (
      !this.repo_.repoInfo_.isCustomHost() &&
      repoInfo.host !== this.repo_.repoInfo_.host
    ) {
      fatal(
        apiName +
          ': Host name does not match the current database: ' +
          '(found ' +
          repoInfo.host +
          ' but expected ' +
          this.repo_.repoInfo_.host +
          ')'
      );
    }

    return this.ref(parsedURL.path.toString());
  }

  private checkDeleted_(apiName: string) {
    if (this.repoInternal_ === null) {
      fatal('Cannot call ' + apiName + ' on a deleted database.');
    }
  }

  // Make individual repo go offline.
  goOffline(): void {
    validateArgCount('database.goOffline', 0, 0, arguments.length);
    this.checkDeleted_('goOffline');
    repoInterrupt(this.repo_);
  }

  goOnline(): void {
    validateArgCount('database.goOnline', 0, 0, arguments.length);
    this.checkDeleted_('goOnline');
    repoResume(this.repo_);
  }
}
