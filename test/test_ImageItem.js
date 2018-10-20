/* eslint react/destructuring-assignment: "off" */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import { shallow, configure } from 'enzyme';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import sinon from 'sinon';
import ImageItem from '../src/components/ImageItem';

configure({ adapter: new Adapter() });
const getProps = () => ({
  id: 0,
  thumbnail: '',
  title: '',
  provider: '',
  push: () => {},
  setActiveImageItem: () => {},
  activeImageItemId: 0,
  cols: 0,
});

test('ImageItem', (t) => {
  const props = getProps();
  const setActiveImageItemStub = sinon.spy();
  props.setActiveImageItem = setActiveImageItemStub;
  const wrapper = shallow((<ImageItem {...props} />));
  wrapper.dive().simulate('click');
  t.ok(setActiveImageItemStub.calledWith(props.id),
    'Calls setActiveImageItem prop with correctid');
  t.end();
});

test('ImageItem', (t) => {
  const props = getProps();
  const pushStub = sinon.spy();
  props.push = pushStub;
  const expectedUrl = `/imageitems/${props.id}`;
  const wrapper = shallow((<ImageItem {...props} />));
  wrapper
    .dive()
    .find(GridListTileBar)
    .shallow()
    .dive()
    .find(IconButton)
    .simulate('click');
  t.ok(pushStub.calledWith(expectedUrl), 'Calls push with correct url and id');
  t.end();
});

test('ImageItem', (t) => {
  const props = getProps();
  const selected = 'selected';
  props.classes = {
    selected
  };
  const wrapper = shallow((<ImageItem {...props} />));
  t.ok(wrapper.dive().hasClass(selected),
    'ImageItem is selected when id matches activeImageItemId prop');
  t.end();
});

test('ImageItem', (t) => {
  const props = getProps();
  const selected = 'selected';
  props.classes = {
    selected
  };
  props.id = 1;
  const wrapper = shallow((<ImageItem {...props} />));
  t.notOk(wrapper.dive().hasClass(selected),
    'ImageItem is not selected when id does not match activeImageItemId prop');
  t.end();
});
