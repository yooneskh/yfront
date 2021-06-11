import { Query } from 'mingo';

export function isConforming(object, rule) {
  const query = new Query(rule);
  return query.test(object);
}

export function areConforming(array, rule) {
  const query = new Query(rule);
  return array.filter(it => query.test(it));
}
