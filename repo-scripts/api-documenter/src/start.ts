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

import * as os from 'os';
import * as colors from 'colors';

import { PackageJsonLookup } from '@rushstack/node-core-library';

import { ApiDocumenterCommandLine } from './cli/ApiDocumenterCommandLine';

const myPackageVersion: string = PackageJsonLookup.loadOwnPackageJson(__dirname)
  .version;

console.log(
  os.EOL +
    colors.bold(
      `api-documenter ${myPackageVersion} ` +
        colors.cyan(' - https://api-extractor.com/') +
        os.EOL
    )
);

const parser: ApiDocumenterCommandLine = new ApiDocumenterCommandLine();

parser.execute().catch(console.error); // CommandLineParser.execute() should never reject the promise
