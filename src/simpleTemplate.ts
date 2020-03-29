import * as path from 'path';
import * as fs from 'fs';

type Template = {
  partial: string;
  param: string | null;
  next: Template | null;
};

const templateCache = {} as { [path: string]: Template | null };
function getTemplate(templatename: string) {
  if (!templateCache[templatename]) {
    const raw = fs
      .readFileSync(
        path.resolve(__dirname, '../resources/templates', templatename),
        'utf-8'
      )
      .toString();
    let root = null as Template | null;
    let last = null as Template | null;
    let endOffset = 0;
    raw.replace(/\{\{(\w+)}}/g, (matched, param, offset) => {
      const partial = {
        partial: raw.substring(endOffset, offset),
        param,
        next: null
      };
      if (last) {
        last.next = partial;
      } else {
        root = partial;
      }
      last = partial;
      endOffset = offset + matched.length;
      return matched;
    });
    const lastPartial = {
      partial: raw.substring(endOffset),
      param: null,
      next: null
    };
    if (last) {
      last.next = lastPartial;
    } else {
      root = lastPartial;
    }
    templateCache[templatename] = root;
  }
  return templateCache[templatename];
}

export default function simpleTemplate(
  path: string,
  params: { [key: string]: any }
) {
  let cursor = getTemplate(path);
  let ret = '';
  while (cursor) {
    const { partial, param, next } = cursor;
    ret += partial;
    if (param) {
      ret += params.hasOwnProperty(param) ? params[param] : param;
    }
    cursor = next;
  }
  return ret;
}
