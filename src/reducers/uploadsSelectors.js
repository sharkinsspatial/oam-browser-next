import { createSelector } from 'reselect';

const getUploadsState = state => state.uploads;

export const getUploads = createSelector(
  [getUploadsState],
  (getUploadsSelect) => {
    console.log('Recalc');
    return getUploadsSelect.toJS();
  }
);
