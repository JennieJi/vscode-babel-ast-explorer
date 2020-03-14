import simpleTemplate from './simpleTemplate';

export default async function renderRepeated(
  template: string,
  params: { [key: string]: any }[]
): Promise<string> {
  const ret = await Promise.all(
    params.map(async p => {
      return simpleTemplate(template, p);
    })
  );
  return ret.join('\n');
}
