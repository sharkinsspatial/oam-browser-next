const stacTemplate = {
  type: 'Feature',
  bbox: [],
  geometry: {
    type: 'Polygon',
    coordinates: [[]]
  }
};

export default (updatedValues) => {
  const {
    id,
    self,
    imageUrl,
    type,
    title,
    instrument,
    provider,
    keywords,
    platform,
    startdatetime,
    enddatetime
  } = updatedValues;

  const stacItem = Object.assign({}, stacTemplate, {
    id,
    links: [{
      rel: 'self',
      href: self
    }],
    assets: {
      image: {
        type,
        href: imageUrl
      }
    },
    properties: {
      title,
      keywords,
      datetime: new Date(startdatetime).toISOString(),
      'eo:gsd': 0,
      'eo:platform': platform,
      'eo:instrument': instrument,
      'eo:bands': {},
      'item:provider': {
        name: provider
      },
      'item:license': 'CC-BY-4.0',
      'dtr:start_datetime': new Date(startdatetime).toISOString(),
      'dtr:end_datetime': new Date(enddatetime).toISOString()
    }
  });
  return stacItem;
};
