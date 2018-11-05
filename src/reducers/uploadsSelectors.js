import { createSelector } from 'reselect';

const getUploadsState = state => state.uploads;

export const getUploads = createSelector(
  [getUploadsState],
  getUploadsSelect => getUploadsSelect.toJS()
);
