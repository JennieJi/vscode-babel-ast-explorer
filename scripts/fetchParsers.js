const { packument, extract } = require('pacote');
const semver = require('semver');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const PACKAGE = '@babel/parser';

const packagePath = path.resolve(__dirname, '../resources', PACKAGE);
if (!fs.existsSync(packagePath)) {
  fs.mkdirSync(packagePath, { recursive: true });
}

function resolveVersion(version = 'latest') {
  const spec = `${PACKAGE}@${version}`;
  const dist = path.join(packagePath, version);
  return promisify(fs.exists)(dist).then((exists) => {
    if (!exists) {
      return extract(spec, dist).then((res) => {
        console.log(`fetched ${spec} -> ${dist}`);
        return res;
      });
    }
  });
}

packument(PACKAGE).then(({ versions }) => {
  const versionsSorted = semver.rsort(
    Object.values(versions).map((d) => d.version)
  );
  return fs.promises
    .writeFile(
      path.join(packagePath, 'versions.json'),
      JSON.stringify(versionsSorted)
    )
    .finally(() => Promise.all(versionsSorted.map(resolveVersion)));
});
