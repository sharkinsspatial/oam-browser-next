
## OAM Browser Next
The next generation of the OpenAerialMap.

`yarn install`
Installs necessary dependencies.

The following environment variables are required.  You can copy and rename `.env.sample` to `.env` for use as a template.<br>
`REACT_APP_API_URL` The URL with port of the oam-api.<br>
`REACT_APP_ACCESS_TOKEN_KEY` The key used for local storage of JWT.<br>
`REACT_APP_UPLOAD_BUCKET` The S3 bucket for uploads.<br>
`REACT_APP_AWS_KEY` The non-secret AWS key for signing uploads.<br>
`REACT_APP_MAPBOX_ACCESS_TOKEN`<br>

Can be used with a local instance of [oam-api-next](https://github.com/sharkinsspatial/oam-api-next) for development.

`yarn start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

`yarn test`
Runs unit tests.

`yarn run build`
Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### Design Approach

The application uses [Redux](https://redux.js.org/) for state management.

The Redux [store](https://redux.js.org/basics/store) is a vanilla JS object but each logical state slice is an [ImmutableJS](https://facebook.github.io/immutable-js/) [map](https://facebook.github.io/immutable-js/docs/#/Map).  

State slices are never queried directly from the store but are accessed via [selectors](https://redux.js.org/recipes/computingderiveddata) which are memomized using the [Reselect](https://github.com/reduxjs/reselect) library where appropriate.

The application design uses both Presentational and Container components but makes liberal use of [react-redux](https://react-redux.js.org/docs/introduction/basic-tutorial) `connect` as outlined [here](https://redux.js.org/faq/reactredux#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree).

State that is transient or does not affect other components in the application can be maintained directly in components where appropriate as described [here](https://redux.js.org/faq/organizingstate#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate).

Pure stateless React [components](https://reactjs.org/docs/state-and-lifecycle.html) are preferred but Class components are used where local state is required.

Any impure actions which may have side effects (asynchronous API requests, interaction with browser local storage) are isolated in Redux [middleware](https://redux.js.org/advanced/middleware).

Cross-cutting actions are also managed through the use of middleware.

The application uses [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) for map display and management.  When the `Map` React component mounts it loads a [style](https://www.mapbox.com/mapbox-gl-js/style-spec) and some GeoJSON data.  This state is then pushed into the Redux store where all subsequent actions act on this state and provide the Map component with the new updated style via props. A more detailed description of this approach is available in this blog [post](https://blog.mapbox.com/mapbox-gl-js-in-a-reactive-application-e08eecf0221b) by Tom Macwright.

The application uses [Material-UI](https://material-ui.com/) for UI components and styling.

Individual component style [overrides](https://material-ui.com/customization/overrides/) are acheived using Material UIs own css injection with [JSS](https://cssinjs.org/?v=v9.8.7).

The application store is configured to support the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) for advanced debugging with state rewind and fast forward.

Because the application makes extensive use of [HOCs](https://reactjs.org/docs/higher-order-components.html), wrapped components are exposed as the default export while raw components are available as a named component.  This allows for unit testing without invoking HOC behavior.

The application uses [tape-await](https://github.com/mbostock/tape-await) to simplify asynchronous test flow for middleware.
