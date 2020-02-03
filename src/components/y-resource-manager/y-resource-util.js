import YNetwork from 'ynetwork';

export async function transformResourceToTitle(apiBase, resourceName, resourceId) {

  const modelUrl = resourceName.toLowerCase() + 's';

  const result = await Promise.all([
    YNetwork.get(`${apiBase}/${modelUrl}/metas`),
    YNetwork.get(`${apiBase}/${modelUrl}/${resourceId}`)
  ]);

  if (result[0].status !== 200 || result[1].status !== 200) {
    return '---';
  }

  const metas = result[0].result;
  const resource = result[1].result;

  const titleableMetas = metas.filter(meta => meta.titleAble);

  const allTitles = await Promise.all(
    titleableMetas.map(meta => new Promise(resolve => {
      if (meta.ref) {
        transformResourceToTitle(apiBase, meta.ref, resource[meta.key]).then(resolve);
      }
      else {
        resolve(resource[meta.key]);
      }
    }))
  );

  return allTitles.join(' ');

}
