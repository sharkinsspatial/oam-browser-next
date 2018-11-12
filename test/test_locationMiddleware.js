/* eslint no-underscore-dangle: "off" */
import test from 'tape';
import sinon from 'sinon';
import { LOCATION_CHANGED } from 'redux-little-router';
import locationMiddleware from '../src/store/locationMiddleware';

import {
  TURN_OFF_POINT_LAYERS,
  SET_ACTIVE_IMAGE_ITEM,
  TURN_ON_POINT_LAYERS,
  SET_STYLE_SUCCEEDED,
  FETCH_FILTERED_ITEMS,
  FILTER_ITEM,
  FETCH_FILTERED_ITEMS_SUCCEEDED
} from '../src/constants/action_types';

const setup = () => {
  const responseJSON = 'responseJSON';
  const fetchWrapperStub = sinon.stub().resolves(responseJSON);
  const getStyleStub = sinon.stub().returns({ size: 1 });
  const imageIdParam = '1';
  const store = {
    dispatch: () => false,
    getState: () => ({
      router: {
        route: '/imageitems/:imageId',
        params: {
          imageId: imageIdParam
        }
      }
    })
  };
  const dispatch = sinon.stub(store, 'dispatch');
  const nextSpy = sinon.spy();
  return {
    store,
    dispatch,
    nextSpy,
    responseJSON,
    fetchWrapperStub,
    getStyleStub,
    imageIdParam
  };
};

test('locationMiddleware', (t) => {
  const {
    store,
    dispatch,
    nextSpy,
    fetchWrapperStub,
    getStyleStub
  } = setup();
  locationMiddleware.__Rewire__('fetchWrapper', fetchWrapperStub);
  locationMiddleware.__Rewire__('getStyle', getStyleStub);
  const locationChangedAction = {
    type: LOCATION_CHANGED,
    payload: {
      route: '/imageitems/:imageId',
      params: {
        imageId: '1'
      }
    }
  };
  locationMiddleware(store)(nextSpy)(locationChangedAction);
  t.equal(dispatch.firstCall.args[0].type, TURN_OFF_POINT_LAYERS,
    'Turns off point layers when style is already loaded and'
    + ' image details page is loaded.');
  t.equal(dispatch.secondCall.args[0].type, SET_ACTIVE_IMAGE_ITEM,
    'Sets active image item when image details page is loaded.');
  t.equal(dispatch.secondCall.args[0].payload.imageId, 1,
    'Converts parameter string to integer for calling setActiveImageItem.');
  t.end();
});

test('locationMiddleware', (t) => {
  const {
    store,
    dispatch,
    nextSpy,
    fetchWrapperStub,
    getStyleStub
  } = setup();
  locationMiddleware.__Rewire__('fetchWrapper', fetchWrapperStub);
  locationMiddleware.__Rewire__('getStyle', getStyleStub);
  const locationChangedAction = {
    type: LOCATION_CHANGED,
    payload: { route: '/' }
  };
  locationMiddleware(store)(nextSpy)(locationChangedAction);
  t.equal(dispatch.firstCall.args[0].type, TURN_ON_POINT_LAYERS,
    'Turns on point layers when style is already loaded and'
    + ' application is returning to the root route');
  t.end();
});

test('locationMiddleware', async (t) => {
  const {
    store,
    dispatch,
    nextSpy,
    fetchWrapperStub,
    responseJSON,
    getStyleStub,
    imageIdParam
  } = setup();
  locationMiddleware.__Rewire__('fetchWrapper', fetchWrapperStub);
  locationMiddleware.__Rewire__('getStyle', getStyleStub);
  const setStyleSucceededAction = {
    type: SET_STYLE_SUCCEEDED
  };
  await locationMiddleware(store)(nextSpy)(setStyleSucceededAction);
  const imageId = parseInt(imageIdParam, 10);
  t.equal(dispatch.firstCall.args[0].type, FETCH_FILTERED_ITEMS,
    'Starts fetch filtered items process when image details is a fresh page load.');
  t.equal(fetchWrapperStub.firstCall.args[3][0], imageId,
    'Calls fetch filteredItems with the parameter converted to an int.');
  t.equal(dispatch.secondCall.args[0].type, FILTER_ITEM,
    'Filters item when fetch succeeds');
  t.equal(dispatch.secondCall.args[0].payload.featureIds[0], imageId,
    'Filters item when fetch succeeds');
  t.equal(dispatch.thirdCall.args[0].type, FETCH_FILTERED_ITEMS_SUCCEEDED);
  t.equal(dispatch.thirdCall.args[0].payload.json, responseJSON);
  t.equal(dispatch.lastCall.args[0].type, SET_ACTIVE_IMAGE_ITEM,
    'Sets active image item');
  t.equal(dispatch.lastCall.args[0].payload.imageId, imageId,
    'Sets active image item');
  t.equal(nextSpy.firstCall.args[0].type, SET_STYLE_SUCCEEDED,
    'Calls next on middleware chain completion.');
  t.end();
});
