const { packument, extract } = require('pacote');
const semver = require('semver');
const path = require('path');
const fs = require('fs');

const PACKAGE = '@babel/parser';

const packagePath = path.resolve(__dirname, '../resources', PACKAGE);

async function getParserVersions() {
  const data = await packument(PACKAGE);
  return semver.rsort(Object.values(data.versions).map((d) => d.version));
}

function resolveVersion(version = 'latest') {
  const spec = `${PACKAGE}@${version}`;
  const dist = path.join(packagePath, version);
  return extract(spec, dist).then((res) => {
    console.log(`fetched ${spec} -> ${dist}`);
    return res;
  });
}

getParserVersions().then((versions) => {
  fs.writeFileSync(
    path.join(packagePath, 'versions.json'),
    JSON.stringify(versions)
  );
  return Promise.all(versions.map(resolveVersion));
});
