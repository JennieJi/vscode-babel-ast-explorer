import fetch from 'node-fetch';
import type { parse } from '@babel/parser';

export function resolveVersion(version = 'latest'): Promise<{ parse: typeof parse }> {
  const versionUrl = version === 'latest' ? '' : '@' + version;
  const url = `https://unpkg.com/@babel/parser${versionUrl}/lib/index.js`;
  // Somehow dynamic import cannot work well in the vscode extension
  return fetch(url).then(res => {
    const ret = res.text();
    if (res.ok) {
      return ret;
    }
    return ret.then((msg) => {
      throw new Error(msg)
    });
  }).then(code => {
    eval(code);
    return {
      parse: exports.parse,
    };
  });
}
