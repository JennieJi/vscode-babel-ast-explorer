import * as assert from 'assert';
import * as ast from './__fixtures__/ast.json';
import renderAst from '../../renderAst';
import readSnapshot from '../readSnapshot';
import writeSnapshot from '../writeSnapshot';

suite('renderAst()', () => {
  test('can work', async () => {
    const raw = await renderAst(ast as any);
    writeSnapshot(__filename, raw, '.html');
    assert.equal(raw, readSnapshot(__filename, '.html'));
  });
});
