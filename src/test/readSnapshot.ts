import * as path from 'path';
import * as fs from 'fs';

export default function readSnapshot(filename: string, extension = '.snap') {
  return fs
    .readFileSync(
      path.resolve(
        'src/test/suite/__snapshots__/',
        path.basename(filename) + extension
      )
    )
    .toString();
}
