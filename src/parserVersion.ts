import { packument, extract } from 'pacote';
import * as semver from 'semver';
import * as path from 'path';

const PACKAGE = '@babel/parser';

export async function getParserVersions() {
  const data = await packument(PACKAGE);
  return semver.rsort(Object.values(data.versions).map((d) => d.version));
}

export function parserPath(version: string) {
  const spec = `${PACKAGE}@${version}`;
  return path.resolve(__dirname, '../resources/', spec);
}

export async function resolveVersion(version = 'latest') {
  const spec = `${PACKAGE}@${version}`;
  const dist = parserPath(version);
  await extract(spec, dist);
  const pkg = require(path.resolve(dist, 'package.json'));
  return require(path.resolve(dist, pkg.main));
}
