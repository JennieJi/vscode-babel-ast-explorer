import fetch from 'node-fetch';
import type { parse } from '@babel/parser';


export function resolveVersion(version = 'latest'): Promise<{ parse: typeof parse }> {
  const versionUrl = version === 'latest' ? '' : '@' + version;
  const url = `https://unpkg.com/@babel/parser${versionUrl}/lib/index.js`;

  return fetch(url).then(res => {
    if (res.ok) {
      return res.text();
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }).then(code => {
    eval(code);
    return {
      parse: exports.parse,
    };
  });
}
