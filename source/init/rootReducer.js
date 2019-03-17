// Core
import { combineReducers } from 'redux';

// Reducers
import { uiReducer as ui } from '../bus/ui/reducer';
import { tasksReducer as tasks } from '../bus/task/reducer';
import { formsReducer as forms } from '../bus/forms/reducer';

export const rootReducer = combineReducers({
    ui,
    tasks,
    forms,
});
