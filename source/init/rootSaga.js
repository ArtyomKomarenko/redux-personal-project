// Core
import { all, call } from 'redux-saga/effects';

// Watchers
import { watchTasks } from '../bus/task/saga/watchers';

export function* rootSage () {
    yield all([call(watchTasks)]);
}
