import * as path from 'path';
import * as fs from 'fs';

export function getParserVersions() {
  return require('resources/@babel/parser/versions.json') as string[];
}

export function resolveVersion(version = '') {
  if (!version) {
    const versions = getParserVersions();
    version = versions[0];
  }
  const packagePath = path.join(
    __dirname,
    '../resources/@babel/parser',
    version
  );
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packagePath, 'package.json')).toString()
  );
  // HACK external source dynamic require cannot work well with ts and webpack
  eval(fs.readFileSync(path.join(packagePath, pkg.main)).toString());
  return exports;
}
