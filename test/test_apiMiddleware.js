/* eslint no-underscore-dangle: "off" */
import test from 'tape';
import sinon from 'sinon';
import apiMiddleware from '../src/store/apiMiddleware';


const testAction = {
  type: 'CALL_API',
  payload: {
    endpoint: '',
    authenticated: true,
    types: {
      requestType: 'FETCH',
      successType: 'FETCH_SUCCEEDED',
      errorType: 'FETCH_FAILED'
    },
    method: 'GET'
  }
};

const setup = () => {
  const token = 'token';
  const getTokenStub = sinon.stub().returns(token);
  const callApiStub = sinon.stub().resolves(true);
  const store = { dispatch: () => false };
  const dispatch = sinon.stub(store, 'dispatch');
  const nextSpy = sinon.spy();
  return {
    getTokenStub,
    callApiStub,
    store,
    dispatch,
    token,
    nextSpy
  };
};

test('apiMiddleware', (t) => {
  const action = { type: 'test' };
  const store = {};
  const next = sinon.spy();
  apiMiddleware(store)(next)(action);
  t.ok(
    next.withArgs(action).calledOnce,
    'Immediately returns next action when not CALL_API'
  );
  t.end();
});


test('apiMiddleware', (t) => {
  const { store, dispatch, nextSpy } = setup();
  const tokenExpiredAction = { type: 'TOKEN_EXPIRED' };
  const getTokenStub = sinon.stub().returns(null);
  apiMiddleware.__Rewire__('getToken', getTokenStub);
  apiMiddleware(store)(nextSpy)(testAction);
  t.ok(
    dispatch.withArgs(tokenExpiredAction).calledOnce,
    'Creates tokenExpiredAction when token is null'
  );
  t.end();
});

test('apiMiddleware', (t) => {
  const {
    getTokenStub,
    callApiStub,
    store,
    token,
    nextSpy
  } = setup();

  apiMiddleware.__Rewire__('getToken', getTokenStub);
  const results = 'results';
  const response = JSON.stringify({ results });
  callApiStub.resolves(response);
  apiMiddleware.__Rewire__('callApi', callApiStub);

  apiMiddleware(store)(nextSpy)(testAction);
  const { endpoint, method, json } = testAction.payload;
  t.ok(
    callApiStub.calledWithExactly(endpoint, method, token, json),
    'Calls the callApi function with proper arguments'
  );
  callApiStub().then(() => {
    t.equal(
      nextSpy.firstCall.args[0].payload.json.results, results,
      'Calls next function with callApi response when succesfull'
    );
    t.equal(
      nextSpy.firstCall.args[0].type,
      testAction.payload.types.successType,
      'Calls next function with success action type when succesfull'
    );
    t.end();
  });
});

test('apiMiddleware', (t) => {
  const {
    getTokenStub,
    callApiStub,
    store,
    nextSpy
  } = setup();

  apiMiddleware.__Rewire__('getToken', getTokenStub);

  const reject = { message: 'reject' };
  callApiStub.rejects(reject);
  apiMiddleware.__Rewire__('callApi', callApiStub);
  apiMiddleware(store)(nextSpy)(testAction);
  callApiStub().then().catch(() => {
    t.equal(nextSpy.firstCall.args[0].error, reject.message);
    t.equal(nextSpy.firstCall.args[0].type, testAction.payload.types.errorType);
    t.end();
  });
});
