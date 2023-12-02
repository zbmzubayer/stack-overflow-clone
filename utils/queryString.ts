import qs from 'query-string';

type SetUrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};
export const setUrlParams = ({ params, key, value }: SetUrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};

type RemoveUrlQueryParams = {
  params: string;
  keys: string[];
};
export const removeKeysUrlParams = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);
  keys.forEach((key) => delete currentUrl[key]);
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};
