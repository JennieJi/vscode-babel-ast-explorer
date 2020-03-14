import * as assert from 'assert';
import simpleTemplate from '../../simpleTemplate';

suite('simpleTemplate()', () => {
  test('can work', () => {
    assert.equal(
      simpleTemplate('node.html', {
        key: 'key',
        type: 'Type',
        child: '{}'
      }),
      `<dl
  class="key-key type-Type child-type-childType line-line"
  data-col-start="colStart"
  data-col-end="colEnd"
>
  <dt><span class="key">key</span>:<span class="type">Type</span></dt>
  <dd class="child">{}</dd>
</dl>
`
    );
  });
});
