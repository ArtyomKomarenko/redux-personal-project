// Core
import { put, apply } from 'redux-saga/effects';

// Instruments
import { api } from '../../../../REST';
import { tasksActions } from '../../actions';
import { uiActions } from '../../../ui/actions';
import { actions } from 'react-redux-form';

export function* createTask ({ payload: data }) {
    try {
        yield put(uiActions.startFetching());
        const response = yield apply(api, api.todo.create, [data]);
        const { data: task, message } = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
       yield put(tasksActions.createTask(task));
    } catch (error) {
        yield put(uiActions.emitError(error, 'createTask worker'));
    } finally {
        yield put(uiActions.stopFetching());
        yield put(actions.reset('forms.task'));
    }
}
