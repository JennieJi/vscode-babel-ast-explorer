const { packument, extract } = require('pacote');
const semver = require('semver');
const path = require('path');

const PACKAGE = '@babel/parser';

function parserPath(version = '') {
  return path.resolve(__dirname, '../resources', PACKAGE, version);
}

async function getParserVersions() {
  const data = await packument(PACKAGE);
  return semver.rsort(Object.values(data.versions).map((d) => d.version));
}

function resolveVersion(version = 'latest') {
  const spec = `${PACKAGE}@${version}`;
  const dist = parserPath(version);
  return extract(spec, dist).then((res) => {
    console.log(`fetched ${spec} -> ${dist}`);
    return res;
  });
}

getParserVersions().then((versions) =>
  Promise.all(versions.map(resolveVersion))
);
