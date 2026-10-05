import { useEffect, useReducer } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import SettingsPage from './pages/SettingsPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  createInitialTodoState,
  todoReducer,
} from './reducers/todoReducer';
import { fetchTodos } from './services/todoApi';

const STORAGE_KEY = 'tave-todos';

function App() {
  // localStorage는 "초기값 읽기 + 저장 함수"만 담당합니다.
  // 실제 앱의 단일 상태 원천(source of truth)은 useReducer입니다.
  const [savedTodos, saveTodos] = useLocalStorage(STORAGE_KEY, []);

  const [state, dispatch] = useReducer(
    todoReducer,
    savedTodos,
    createInitialTodoState
  );

  const { todos, requestStatus, error } = state;

  // Effect는 React state를 브라우저 외부 시스템(localStorage)과
  // 동기화할 때만 사용합니다.
  useEffect(() => {
    saveTodos(todos);
  }, [todos, saveTodos]);

  const handleAddTodo = ({ text, category, priority }) => {
    dispatch({
      type: 'todo/added',
      payload: {
        id: Date.now(),
        text,
        category,
        priority,
      },
    });
  };

  const handleToggleDone = (id) => {
    dispatch({
      type: 'todo/toggled',
      payload: { id },
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'todo/deleted',
      payload: { id },
    });
  };

  const handleUpdate = (id, newText) => {
    dispatch({
      type: 'todo/updated',
      payload: {
        id,
        text: newText,
      },
    });
  };

  // 사용자의 버튼 클릭으로 시작되는 네트워크 요청이므로
  // useEffect가 아니라 이벤트 핸들러에서 처리합니다.
  const handleLoadApiTodos = async () => {
    dispatch({ type: 'api/requested' });

    try {
      const apiTodos = await fetchTodos();

      dispatch({
        type: 'api/succeeded',
        payload: { todos: apiTodos },
      });
    } catch (requestError) {
      dispatch({
        type: 'api/failed',
        payload: {
          message:
            requestError instanceof Error
              ? requestError.message
              : '알 수 없는 오류가 발생했습니다.',
        },
      });
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ margin: 0 }}>투두리스트</h1>

        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/">홈</Link>
          <Link to="/settings">설정</Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              todos={todos}
              onAddTodo={handleAddTodo}
              onToggleDone={handleToggleDone}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              requestStatus={requestStatus}
              requestError={error}
              onLoadApiTodos={handleLoadApiTodos}
            />
          }
        />

        <Route path="/todo/:id" element={<DetailPage todos={todos} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
