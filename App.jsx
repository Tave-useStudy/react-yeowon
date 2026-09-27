import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = ({ text, category, priority }) => {
    const newTodo = {
      id: Date.now(),
      text,
      category,
      priority,
      done: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleDone = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleUpdate = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
