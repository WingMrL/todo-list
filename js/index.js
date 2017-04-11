import React from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers } from 'redux';


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

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const getVisibleTodos = (
    todos,
    filter
) => {
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

// const todoApp = (state = {}, action) => {
//     return {
//         todos: todos(state.todos, action),
//         visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//     }; 
// };

const store = createStore(todoApp);

// console.log("Initial state:");
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching ADD_TODO');
// store.dispatch({
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Learn Redux'
// });
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching ADD_TODO');
// store.dispatch({
//     type: 'ADD_TODO',
//     id: 1,
//     text: 'Go Shopping'
// });
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching TOGGLE_TODO');
// store.dispatch({
//     type: 'TOGGLE_TODO',
//     id: 0
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching SET_VISIBILITY_FILTER');
// store.dispatch({
//     type: 'SET_VISIBILITY_FILTER',
//     filter: 'SHOW_COMPLETED'
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');

let nextTodoId = 0;

class FilterLink extends React.Component {
    render() {
        if(this.props.filter === this.props.currentFilter) {
            return (
                <span>{this.props.children}</span>
            );
        }
        return (
            <a href="#"
                onClick={e => {
                    e.preventDefault();
                    {/*debugger;*/}
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: this.props.filter
                    });
                }}
                >
                {this.props.children}
            </a>
        );
    }
}

class Todo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li 
                onClick={this.props.onClick}
                style={{
                    textDecoration:
                        this.props.todo.completed ? 'line-through' : 'none'
                }}>
                {this.props.todo.text}
            </li>
        );
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
    }

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

class TodoAPP extends React.Component {
    constructor(props) {
        super(props);

        this.addTodoBtnOnClickHandler = this.addTodoBtnOnClickHandler.bind(this);
        this.onTodoClick = this.onTodoClick.bind(this);
    }

    addTodoBtnOnClickHandler() {
        store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
        });
        this.input.value = '';
    }

    onTodoClick(id) {
        // console.log(e);
        store.dispatch({
            type: 'TOGGLE_TODO',
            id
        });
    }

    render() {
        const {
            todos,
            visibilityFilter
        } = this.props;

        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
        );
        
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button onClick={this.addTodoBtnOnClickHandler}>Add Todo</button>
                <TodoList todos={visibleTodos} 
                            onTodoClick={ id => this.onTodoClick(id)}/>
                <p>
                    Show:
                    {' '}
                    <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>All</FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>Active</FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>Completed</FilterLink>
                </p>
            </div>
        );
    }
}

const render = () => {
    ReactDom.render(<TodoAPP {...store.getState()}/>, document.getElementById('root'));
};

store.subscribe(render);
render();