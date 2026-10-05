export function createInitialTodoState(initialTodos) {
  return {
    todos: initialTodos,
    requestStatus: 'idle',
    error: null,
  };
}

export function todoReducer(state, action) {
  switch (action.type) {
    case 'todo/added': {
      const newTodo = {
        id: action.payload.id,
        text: action.payload.text,
        category: action.payload.category,
        priority: action.payload.priority,
        done: false,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }

    case 'todo/toggled': {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, done: !todo.done }
            : todo
        ),
      };
    }

    case 'todo/deleted': {
      return {
        ...state,
        todos: state.todos.filter(
          (todo) => todo.id !== action.payload.id
        ),
      };
    }

    case 'todo/updated': {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };
    }

    case 'api/requested': {
      return {
        ...state,
        requestStatus: 'loading',
        error: null,
      };
    }

    case 'api/succeeded': {
      // API 버튼을 여러 번 눌러도 같은 id의 항목이 중복되지 않도록
      // 배열 반복 탐색 대신 Set lookup을 사용합니다.
      const existingIds = new Set(
        state.todos.map((todo) => todo.id)
      );

      const uniqueApiTodos = action.payload.todos.filter(
        (todo) => !existingIds.has(todo.id)
      );

      return {
        ...state,
        todos: [...state.todos, ...uniqueApiTodos],
        requestStatus: 'success',
        error: null,
      };
    }

    case 'api/failed': {
      return {
        ...state,
        requestStatus: 'error',
        error: action.payload.message,
      };
    }

    default: {
      throw new Error(`알 수 없는 action입니다: ${action.type}`);
    }
  }
}
