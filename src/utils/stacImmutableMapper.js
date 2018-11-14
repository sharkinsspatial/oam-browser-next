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
  const startDatetime = item.getIn([
    properties,
    'dtr:start_datetime'
  ]);
  const instrument = item.getIn([
    properties,
    'eo:instrument'
  ]);
  return {
    provider,
    thumbnail,
    title,
    uploaderName,
    startDatetime,
    instrument
  };
};
