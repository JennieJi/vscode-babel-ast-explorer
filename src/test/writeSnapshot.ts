import * as path from 'path';
import * as fs from 'fs';

export default function writeSnapshot(
  filename: string,
  raw: string,
  extension = '.snap'
) {
  fs.writeFileSync(
    path.resolve(
      'src/test/suite/__snapshots__/',
      path.basename(filename) + extension
    ),
    raw,
    {
      flag: 'w'
    }
  );
}
