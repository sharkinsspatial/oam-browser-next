require('babel-register')({
    plugins: ['rewire'],
    presets: ['react-app']
});
require('./test_apiMiddleware');
