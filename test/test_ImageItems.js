import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import { shallow, configure } from 'enzyme';
import { List, fromJS } from 'immutable';
import { ImageItems } from '../src/components/ImageItems';
import ImageItem from '../src/components/ImageItem';

configure({ adapter: new Adapter() });

const getProps = () => ({
  imageItems: List(),
  push: () => {},
  setActiveImageItem: () => {},
  activeImageItemId: 'id'
});

test('ImageItems', (t) => {
  const props = getProps();
  const wrapper = shallow((<ImageItems {...props} />));
  t.equal(
    wrapper.find(ImageItem).length, 0,
    'No ImageItem is rendered with empty list'
  );
  t.end();
});

test('ImageItems', (t) => {
  const props = getProps();
  const imageItems = fromJS([{
    properties: {
      id: 'id',
      thumbUri: '',
      title: '',
      provider: ''
    }
  }]);
  props.imageItems = imageItems;
  const wrapper = shallow((<ImageItems {...props} />));
  t.equal(
    wrapper.find(ImageItem).length, 1,
    'ImageItem rendered when list contains image item'
  );
  t.end();
});
