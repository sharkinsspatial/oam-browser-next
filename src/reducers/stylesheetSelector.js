import { createSelector } from 'reselect';

const getStyleState = state => state.stylesheet.get('style');

export const getStyle = createSelector(
  [getStyleState],
  style => style
);
