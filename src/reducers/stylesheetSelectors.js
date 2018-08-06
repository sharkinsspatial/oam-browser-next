import { List } from 'immutable';
import { createSelector } from 'reselect';
import { filteredItemsSource } from '../constants/stylesheetConstants';

const getStyleState = state => state.stylesheet.get('style');

export const getStyle = createSelector(
  [getStyleState],
  style => style
);

export const getFilteredItems = createSelector(
  [getStyle],
  (style) => {
    const filteredItems = style
      .getIn(['sources', filteredItemsSource, 'data', 'features']);
    return filteredItems || List();
  }
);
