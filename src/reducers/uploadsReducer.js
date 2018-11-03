import { Map } from 'immutable';
import * as actions from '../constants/action_types';

const initialState = Map({
});

export default function uploadsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.START_UPLOAD: {
      const { id, originalName } = action.payload;
      return state.setIn([id, 'originalName'], originalName);
    }

    case actions.UPLOAD_PROGRESS: {
      const { id, progress } = action.payload;
      return state.setIn([id, 'progress'], progress);
    }

    default: {
      return state;
    }
  }
}
