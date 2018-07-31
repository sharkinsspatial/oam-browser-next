import React from 'react';
import 'typeface-roboto'; // eslint-disable-line
import { Provider } from 'react-redux';
import createStore from './store/store';
import Container from './components/Container';

const store = createStore;

const App = () => (
  <Provider store={store}>
    <Container />
  </Provider>
);

export default App;

