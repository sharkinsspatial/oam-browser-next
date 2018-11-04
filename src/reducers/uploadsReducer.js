import { Map } from 'immutable';
import * as actions from '../constants/action_types';

const initialState = Map({
});

export default function uploadsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPLOAD_PROGRESS: {
      const { id, progress } = action.payload;
      let newState;
      if (progress === 100) {
        newState = state.delete(id);
      } else {
        newState = state.setIn([id, 'progress'], progress);
      }
      return newState;
    }

    default: {
      return state;
    }
  }
}
