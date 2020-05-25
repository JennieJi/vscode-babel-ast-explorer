import * as assert from 'assert';
import { getParserVersions, resolveVersion } from '../../parserVersion';
import readSnapshot from '../readSnapshot';
// import writeSnapshot from '../writeSnapshot';

suite('getParserVersions()', () => {
  test('can work', async () => {
    const raw = await getParserVersions();
    // writeSnapshot('getParserVersions', raw);
    assert.equal(JSON.stringify(raw), readSnapshot('getParserVersions'));
  });
});

suite('resolveVersion()', () => {
  test('can work', async () => {
    const raw = await resolveVersion('7.9.4');
    assert.ok(raw);
  });
});
