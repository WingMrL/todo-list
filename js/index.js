import React from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';


const todo = (state, action) => {
    switch(action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO': 
            if(state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const getVisibleTodos = (todos, filter) => {
    switch(filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        default:
            return todos;
    }
}

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};
const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};
const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

class Todo extends React.Component {
    render() {
        return (
            <li 
                onClick={this.props.onClick}
                style={{
                    textDecoration: this.props.todo.completed ? 'line-through' : 'none'
                }}>
                {this.props.todo.text}
            </li>
        );
    }
}

class TodoList extends React.Component {
    render() {
        return (
            <ul>
                {this.props.todos.map(todo => 
                    <Todo  key={todo.id} 
                            todo={todo} 
                            onClick={() => this.props.onTodoClick(todo.id)}/>
                )}
            </ul>
        );
    }
}

const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
};
const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }
    }
};
const VisibleTodoList = connect(
    mapStateToTodoListProps, 
    mapDispatchToTodoListProps
)(TodoList);

class AddTodo extends React.Component {
    render() {
        return (
            <div>
                <input ref={node => {
                        this.input = node;
                    }}/>
                <button onClick={() => {
                    this.props.dispatch(addTodo(this.input.value));
                    this.input.value = '';
                    }}>Add Todo</button>
            </div>
        );
    }
}
AddTodo = connect()(AddTodo);

class Link extends React.Component {
    render() {
        if(this.props.active) {
            return (
                <span>{this.props.children}</span>
            );
        }
        return (
            <a href="#"
                onClick={e => {
                    e.preventDefault();
                    this.props.onClick();
                }}
                >
                {this.props.children}
            </a>
        );
    }
}

const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

class Footer extends React.Component {
    render() {
        return (
            <p>
                Show:{' '}
                <FilterLink filter="SHOW_ALL">All</FilterLink>{' '}
                <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>{' '}
                <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
            </p>
        );
    }
}

class TodoAPP extends React.Component {
    render() {
        return (
            <div>
                <AddTodo />
                <VisibleTodoList />
                <Footer />
            </div>
        );
    }
}

ReactDom.render(
    <Provider store={createStore(todoApp)}>
        <TodoAPP />
    </Provider>
, document.getElementById('root'));