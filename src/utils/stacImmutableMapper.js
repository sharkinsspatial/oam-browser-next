export default (item) => {
  const properties = 'properties';
  const assets = 'assets';
  const provider = item.getIn([
    properties,
    'item:providers',
    0,
    'name'
  ]);
  const thumbnail = item.getIn([
    assets,
    'thumbnail',
    'href'
  ]);
  const title = item.getIn([
    properties,
    'title'
  ]);
  const uploaderName = item.getIn([
    properties,
    'oam:uploadername'
  ]);
  return {
    provider,
    thumbnail,
    title,
    uploaderName
  };
};
