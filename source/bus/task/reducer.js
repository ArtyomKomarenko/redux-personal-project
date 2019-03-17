// Core
import { fromJS, List, Map } from 'immutable';

// Types
import { types } from './types';

const initialState = Map({
    sorted:   List(),
    filtered: null,
});

export const tasksReducer = (state = initialState, action) => {
    const sorted = state.get('sorted');

    switch (action.type) {
        case types.FILL_TASKS:
            return state.set('sorted', fromJS(action.payload));

        case types.CREATE_TASK:
            return state.set('sorted', sorted.unshift(fromJS(action.payload)));

        case types.UPDATE_TASK:
            return state.set('sorted', sorted.set(sorted.findIndex((task) => {
                return task.get('id') === action.payload.id;
            }), fromJS(action.payload)));

        case types.REMOVE_TASK:
            return state.set('sorted', sorted.filter((task) => task.get('id') !== action.payload));

        case types.SORT_TASKS:
            return state.set('sorted', sorted.sortBy((task) => !task.get('favorite')).sortBy((task) => task.get('completed')));

        case types.FILTER_TASKS:
            const term  = action.payload;

            if (term.length === 0) {
                return state.set('filtered', null);
            }

            return state.set('filtered', sorted.filter(
                (task) => task.get('message').indexOf(term) !== -1).map((task) => task.get('id')));

        default:
            return state;
    }
};
