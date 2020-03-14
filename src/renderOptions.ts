import simpleTemplate from './simpleTemplate';

export default async function renderOptions(
  options: {
    label: string;
    script: string;
  }[]
): Promise<string> {
  const ret = await Promise.all(
    options.map(async option => {
      return simpleTemplate('option.html', option);
    })
  );
  return ret.join('\n');
}
