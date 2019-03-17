// Core
import { put, apply, all } from 'redux-saga/effects';

// Instruments
import { api } from '../../../../REST';
import { tasksActions } from '../../actions';
import { uiActions } from '../../../ui/actions';

export function* updateTask ({ payload: data }) {
    try {
        yield put(uiActions.startFetching());

        const response = yield apply(api, api.todo.update, [data]);
        const { data: tasks, message } = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
        yield all(tasks.map((task) => put(tasksActions.updateTask(task))));
    } catch (error) {
        yield put(uiActions.emitError(error, 'updateTask worker'));
    } finally {
        yield put(tasksActions.sortTasks());
        yield put(uiActions.stopFetching());
    }
}
