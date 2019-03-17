// Core
import React, { PureComponent } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends PureComponent {
    state = {
        disabled:    true,
        editMessage: this.props.message,
    };

    _toggleFavorite = () => {
        const { id, actions, favorite, message, completed } = this.props;
        const task = [{ id, message, completed, favorite: !favorite }];

        actions.updateTaskAsync(task);
    };

    _toggleComplete = () => {
        const { id, actions, favorite, message, completed } = this.props;
        const task = [{ id, message, favorite, completed: !completed }];

        actions.updateTaskAsync(task);
    };

    _removeTask = () => {
        const { id, actions } = this.props;

        actions.removeTaskAsync(id);
    };

    _updateTaskMessage = () => {
        const { actions, id, completed, favorite } = this.props;
        const { editMessage } = this.state;
        const trimmedMessage = editMessage.trim();

        if (!trimmedMessage) {
            this._toggleEditTask();

            return;
        }

        actions.updateTaskAsync([{ id, message: trimmedMessage, completed, favorite }]);
    };

    _toggleEditTask = () => {
        const { disabled } = this.state;

        if (disabled) {
            document.addEventListener('click', this._handleOutsideClick, false);
            document.addEventListener('keyup', this._handleKeyPress, false);
        } else {
            document.removeEventListener('click', this._handleOutsideClick, false);
            document.removeEventListener('keyup', this._handleKeyPress, false);
        }

        this.setState({
            disabled: !disabled,
        }, () => {
            this.taskInput.focus();
        });
    };

    _editTask = (e) => {
        this.setState({
            editMessage: e.target.value,
        });
    };

    _handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            this.setState({
                editMessage: this.props.message,
            });
            this._toggleEditTask();
        } else if (e.key === 'Enter') {
            this._updateTaskMessage();
            this._toggleEditTask();
        }
    };

    _handleOutsideClick = (e) => {
        if (this.taskInput.contains(e.target)) {
            return;
        }
        this.setState({
            editMessage: this.props.message,
        });
        this._toggleEditTask();
    };

    render () {
        const { message, completed, favorite } = this.props;
        const { editMessage } = this.state;
        const { disabled } = this.state;

        const styles = cx(Styles.task, {
            [Styles.completed]: completed,
        });

        return (
            <li className = { styles }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleComplete }
                    />
                    <input
                        disabled = { disabled }
                        maxLength = { 50 }
                        onChange = { this._editTask }
                        ref = { (taskInput) => {
                            this.taskInput = taskInput;
                        } }
                        type = 'text'
                        value = { editMessage }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleFavorite }
                    />
                    <Edit
                        inlineBlock
                        checked = { !disabled }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleEditTask }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
