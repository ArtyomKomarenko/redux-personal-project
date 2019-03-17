// Core
import { combineForms } from 'react-redux-form';

export const formsReducer = combineForms(
    {
        task: {
            message: '',
        },
    },
    'forms',
);
