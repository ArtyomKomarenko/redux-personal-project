// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Control } from 'react-redux-form';

// Instruments
import Styles from './styles.m.css';

// Actions
import { tasksActions } from '../../bus/task/actions';

// Components
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from '../Spinner';

const mapStateToProps = (state) => {
    return {
        tasks:      state.tasks.get('sorted'),
        isSpinning: state.ui.get('isSpinning'),
        filtered:   state.tasks.get('filtered'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ ...tasksActions }, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Scheduler extends Component {

    componentDidMount () {
        const { actions } = this.props;

        actions.fetchTasksAsync();
    }

    _onSubmitForm = (task) => {
        this._createTask(task);
    };

    _createTask = ({ message }) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            return null;
        }

        this.props.actions.createTaskAsync(trimmedMessage);
    };

    _completeAllTasks = () => {
        const { tasks, actions } = this.props;

        actions.updateTaskAsync(tasks.map((task) => task.set('completed', true)));
    };

    _onSearchInputChange = (e) => {
        const term = e.target.value.trim().toLowerCase();
        const { actions } = this.props;

        actions.filterTasks(term);
    };

    render () {
        const { tasks, actions, isSpinning, filtered } = this.props;
        const isFiltered = filtered !== null;
        const isFilterResultEmpty = isFiltered && filtered.isEmpty();
        const filteredTasks = !isFiltered ? tasks : isFilterResultEmpty ? filtered : filtered.map((id) => tasks.find((task) => task.get('id') === id));

        const todoList = filteredTasks.map((taskMapObject) => {
            const task = taskMapObject.toJS();

            return (<Task
                actions = { actions }
                completed = { task.completed }
                favorite = { task.favorite }
                id = { task.id }
                key = { task.id }
                message = { task.message }
                { ...task }
            />);
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isSpinning } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            onChange = { this._onSearchInputChange }
                        />
                    </header>
                    <section>
                        <Form
                            model = 'forms.task'
                            onSubmit = { this._onSubmitForm }>
                            <Control.text
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                model = 'forms.task.message'
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                            />
                            <button>Добавить задачу</button>
                        </Form>
                        <div className = { Styles.overlay }>
                            <ul>{todoList}</ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked color1 = '#363636' color2 = '#fff'
                            onClick = { this._completeAllTasks }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
