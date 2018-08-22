/* eslint prefer-destructuring: "off" */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import { shallow, configure } from 'enzyme';
import AppBar from '@material-ui/core/AppBar';

const proxyquire = require('proxyquire').noCallThru();

const Container = proxyquire(
  '../src/components/Container',
  { './Map': () => <div /> }
).Container;

configure({ adapter: new Adapter() });

const getProps = () => ({
  classes: {
    root: '',
    item: ''
  }
});

test('Container', (t) => {
  const props = getProps();
  const wrapper = shallow((<Container {...props} />));
  t.equal(
    wrapper.find(AppBar).length, 1,
    'Container has a Toolbar'
  );
  t.end();
});
