import * as path from 'path';
import * as fs from 'fs';

export default function writeSnapshot(
  filename: string,
  raw: any,
  extension = '.snap'
) {
  let stdout = raw;
  try {
    stdout = JSON.stringify(raw);
  } catch (e) {
    stdout = String(raw);
  }
  fs.writeFileSync(
    path.resolve(
      'src/test/suite/__snapshots__/',
      path.basename(filename) + extension
    ),
    stdout,
    {
      flag: 'w',
    }
  );
}
