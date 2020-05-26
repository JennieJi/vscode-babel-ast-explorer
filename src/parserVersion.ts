import * as semver from 'semver';
import * as path from 'path';
import * as fs from 'fs';

const PACKAGE = '@babel/parser';

function parserPath(version = '') {
  return path.resolve(__ASSET_PATH__, PACKAGE, version);
}

export function getParserVersions() {
  return semver.rsort(fs.readdirSync(parserPath()));
}

export async function resolveVersion(version?: string) {
  if (!version) {
    version = getParserVersions()[0];
  }
  const pkg = await import(
    `${__ASSET_PATH__}/${PACKAGE}/${version}/package.json`
  );
  return await import(`${__ASSET_PATH__}/${PACKAGE}/${version}/${pkg.main}`);
}
