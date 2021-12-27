import { YNetwork } from 'ynetwork';
import { YCacher } from '../../plugins/y-cacher';
import { plural } from 'pluralize';
import { Config } from '../../global/config';


export function pluralizeModelName(model) {
  return plural(model).toLowerCase();
}


export async function loadMetasFor(apiBase, resourceName, pathSuffix) {
  if (YCacher.has([resourceName, 'Meta'])) return YCacher.get([resourceName, 'Meta']);

  return YCacher.preempt([resourceName, 'Meta'], async () => {

    const urlPathSuffix = pathSuffix || `/${pluralizeModelName(resourceName)}`;

    const { status, data } = await YNetwork.get(`${apiBase}${urlPathSuffix}/meta`);
    if (status !== 200) return [];

    return data;

  });

}

export async function loadRelationsFor(apiBase, resourceName) {
  if (YCacher.has([resourceName, 'Relation'])) return YCacher.get([resourceName, 'Relation']);

  return YCacher.preempt([resourceName, 'Relation'], async () => {

    const { status, data } = await YNetwork.get(`${apiBase}/${pluralizeModelName(resourceName)}/relations`);
    if (status !== 200) return [];

    return data;

  });

}


export async function transformResourceToTitle(apiBase, resourceName, resourceId, locale = Config.localization.default) {

  const result = await Promise.all([
    new Promise(resolve =>
      loadMetasFor(apiBase, resourceName).then(rs => resolve({
        status: 200,
        data: rs
      }))
    ),
    YNetwork.get(`${apiBase}/${pluralizeModelName(resourceName)}/${resourceId}`)
  ]);

  if (result[0].status !== 200 || result[1].status !== 200) {
    return '---';
  }

  const metas = result[0].data;
  const resource = result[1].data;

  const titleableMetas = metas.filter(meta => meta.titleable);

  const allTitles = await Promise.all(
    titleableMetas.map(meta => new Promise(resolve => {
      if (meta.ref) {
        transformResourceToTitle(apiBase, meta.ref, resource[meta.key]).then(resolve);
      }
      else if (meta.variants) {
        resolve(resource[meta.key][locale] ?? '---');
      }
      else {
        resolve(resource[meta.key]);
      }
    }))
  );

  return allTitles.join(' ');

}

export async function transformRelationToTitle(apiBase, resourceModel, relationId, relationSourceModel, relationTargetModel) {

  const targetName = (resourceModel || relationTargetModel);
  const sourceName = relationSourceModel;

  const [{ data: item }, { data: relations }] = await Promise.all([
    YNetwork.get(`${apiBase}/${pluralizeModelName(sourceName)}/${pluralizeModelName(targetName)}/${relationId}`),
    new Promise(resolve =>
      loadRelationsFor(apiBase, relationSourceModel).then(rs => resolve({
        status: 200,
        data: rs
      }))
    )
  ]);

  const relationMeta = relations.find(relation => relation.targetModel === relationTargetModel);

  const [sourceTitle, targetTitle] = await Promise.all([
    transformResourceToTitle(apiBase, relationSourceModel, item[relationSourceModel.toLowerCase()]),
    transformResourceToTitle(apiBase, relationTargetModel, item[relationTargetModel.toLowerCase()])
  ]);

  const otherDataTitles = await Promise.all(
    relationMeta.properties.filter(p => p.titleable).map(async meta => {

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
    `${filter.key}${filter.modifier ? `.${filter.modifier}` : ''}:${filter.operator}:${filter.value}`
  ).join(',');

}

export function transformSorts(sorts) {

  const entries = Object.entries(sorts || {});
  if (entries.length === 0) return '';

  return 'sorts=' + entries.map(sort =>
    `${sort[0]}:${sort[1]}`
  ).join(',');

}


export function mapMetaType(meta) {

  if (meta.handlerElement) return meta.handlerElement;
  if (meta.type === 'string' && meta.ref === 'Media') return meta.array ? 'file-array' : 'file';
  if (meta.type === 'series') return 'series';
  if (meta.ref) return 'resource';
  if (meta.array) return 'select';
  if (meta.labelFormat || meta.valueFormat) return 'date';
  if (meta.enum || meta.items) return 'select';
  if (meta.geo) return 'geo';

  switch (meta.type) {
    case 'string': return meta.richText ? 'editor' : (meta.longText ? 'textarea' : 'text');
    case 'number': return 'text';
    case 'boolean': return 'checkbox';
    case 'any': case 'object': return 'json';
    default: return 'text';
  }

}

export function doesMetaValueExist(meta, value) {

  if (meta.type === 'number') {
    return (value !== undefined && value !== null && !isNaN(value));
  }

  if (meta.array || meta.type === 'series') {
    return (!!value && value.length > 0);
  }

  if (meta.type === 'boolean') {
    return (value === true || value === false);
  }

  return (value !== undefined && value !== null && value !== '');

}

export function makeMetaRules(meta) {

  const rules = [];

  if (meta.required || meta.conditionalRequired) {
    rules.push(v => {

      // vIf is handled in the y-form

      if (meta.variants) {
        for (const variant in meta.variants) {
          if (! doesMetaValueExist({ ...meta, ...meta.variants[variant] }, v?.[variant]) ) {
            return `${meta.title || meta.key} in ${variant} is required!`;
          }
        }
      }
      else {
        return doesMetaValueExist(meta, v) || `${meta.title || meta.key} is required!`;
      }

    });
  }

  return rules;

}


export function convertObjectMetaToArray(meta) {
  return Object.keys(meta || {}).map(key => ({ ...meta[key], key }));
}

export function mapMetaToFormFields(metas, readonly = false) {
  if (!metas) return;

  return metas.map(meta => ({
    ...meta,
    title: (meta.title || meta.key) + (meta.required || meta.conditionalRequired ? ' *' : ''),
    type: mapMetaType(meta),
    resource: meta.ref,
    number: meta.type === 'number',
    itemFields: mapMetaToFormFields(convertObjectMetaToArray(meta.seriesSchema)), // for series
    base: meta.seriesBase, // for series
    multiple: meta.array, // for select
    addable: meta.array && !meta.items && !meta.enum, // for select
    searchable: meta.array, // for select
    readonly: readonly || meta.readonly,
    unepoch: !!meta.valueFormat,
    locale: Config.localization.default,
    items: meta.items || meta.enum,
    rules: makeMetaRules(meta),
    selectPointByCenter: 'auto'
  }));

}


export function resourceFilterNextConfig(meta) {

  const config = {
    operator: '~=',
    value: '',
    modifier: ''
  };

  if (meta.labelFormat || meta.valueFormat || meta.ref) {
    config.operator = '=';
  }

  if (meta.variants) {
    config.modifier = Object.keys(meta.variants)[0];
  }

  return config;

}

export async function loadAllResource(url, params, generalHandle) {


  const { status: countStatus, data: dataCount } = await YNetwork.get(`${url}count?${params}`);
  if (generalHandle(countStatus, dataCount)) return [];

  const result = [];
  let fetchCount = 0;

  while (result.length < dataCount && (fetchCount++) < 40) {

    const { status, data } = await YNetwork.get(`${url}?skip=${result.length}&${params}`);
    if (generalHandle(status, data)) return result;

    result.push(...data);

  }

  return result;

}
