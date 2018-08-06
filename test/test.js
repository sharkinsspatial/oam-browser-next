/* eslint import/no-extraneous-dependencies: 0 */
require('babel-register')({
  plugins: ['rewire'],
  presets: ['react-app']
});
require('./test_apiMiddleware');
require('./test_Container');
require('./test_stylesheetSelectors');
