import YNetwork from 'ynetwork';
import { YCacher } from '../../plugins/y-cacher';

export async function loadMetasFor(apiBase, resourceName) {
  if (YCacher.has([resourceName, 'Meta'])) return YCacher.get([resourceName, 'Meta']);

  return YCacher.preempt([resourceName, 'Meta'], async () => {

    const { status, result } = await YNetwork.get(`${apiBase}/${resourceName.toLowerCase()}s/metas`);
    if (status !== 200) return [];
  
    return result;

  });

}

export async function loadRelationsFor(apiBase, resourceName) {
  if (YCacher.has([resourceName, 'Relation'])) return YCacher.get([resourceName, 'Relation']);

  return YCacher.preempt([resourceName, 'Relation'], async () => {
    
    const { status, result } = await YNetwork.get(`${apiBase}/${resourceName.toLowerCase()}s/relations`);
    if (status !== 200) return [];
  
    return result;

  });

}

export async function transformResourceToTitle(apiBase, resourceName, resourceId) {

  const modelUrl = resourceName.toLowerCase() + 's';

  const result = await Promise.all([
    new Promise(resolve =>
      loadMetasFor(apiBase, resourceName).then(rs => resolve({
        status: 200,
        result: rs
      }))
    ),
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

export async function transformRelationToTitle(apiBase, resourceModel, relationId, relationSourceModel, relationTargetModel) {

  const targetName = (resourceModel || relationTargetModel).toLowerCase();
  const sourceName = relationSourceModel.toLowerCase();

  const [{ result: item }, { result: relations }] = await Promise.all([
    YNetwork.get(`${apiBase}/${sourceName}s/${targetName}s/${relationId}`),
    new Promise(resolve =>
      loadRelationsFor(apiBase, relationSourceModel).then(rs => resolve({
        status: 200,
        result: rs
      }))
    )
  ]);

  const relationMeta = relations.find(relation => relation.targetModel === relationTargetModel);

  const [sourceTitle, targetTitle] = await Promise.all([
    transformResourceToTitle(apiBase, relationSourceModel, item[relationSourceModel.toLowerCase()]),
    transformResourceToTitle(apiBase, relationTargetModel, item[relationTargetModel.toLowerCase()])
  ]);

  const otherDataTitles = await Promise.all(
    relationMeta.properties.filter(p => p.titleAble).map(async meta => {

      const arrayedValues = Array.isArray(item[meta.key]) ? item[meta.key] : [item[meta.key]];

      if (!meta.ref) return arrayedValues.join(', ');

      return (await Promise.all(
        arrayedValues.map(value => transformResourceToTitle(apiBase, meta.ref, value))
      )).join(', ');

    })
  );

  return [sourceTitle, targetTitle, ...otherDataTitles].join(' ');

}

export function transformFilters(filters) {
  if (!filters) return '';

  return 'filters=' + filters.map(filter =>
    `${filter.key}:${filter.operator}:${filter.value}`
  ).join(',');

}

export function transformSorts(sorts) {

  const entries = Object.entries(sorts || {});
  if (entries.length === 0) return '';

  return 'sorts=' + entries.map(sort =>
    `${sort[0]}:${sort[1]}`
  ).join(',');

}
