import * as assert from 'assert';
import simpleTemplate from '../../simpleTemplate';

suite('simpleTemplate()', () => {
  test('can work', () => {
    assert.ok(
      simpleTemplate('node.html', {
        key: 'key',
        type: 'Type',
        child: '{}',
      }).length > 0
    );
  });
});
