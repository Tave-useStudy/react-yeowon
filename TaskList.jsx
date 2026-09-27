import { useState } from 'react';
import { Link } from 'react-router-dom';

function TaskItem({ todo, onToggleDone, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() === '') return;
    onUpdate(todo.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
        padding: '8px',
        borderBottom: '1px solid #eee',
      }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ flex: 1, padding: '4px' }}
          />
          <button onClick={handleSave}>저장</button>
          <button onClick={handleCancel}>취소</button>
        </>
      ) : (
        <>
          <span style={{ fontSize: '12px', padding: '2px 6px', background: '#e0e0e0', borderRadius: '4px' }}>
            {todo.category}
          </span>
          <span style={{ fontSize: '12px', padding: '2px 6px', background: todo.priority === 'high' ? '#ffcdd2' : '#fff9c4', borderRadius: '4px' }}>
            {todo.priority.toUpperCase()}
          </span>

          <span
            style={{
              flex: 1,
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#aaa' : '#000',
            }}
          >
            {todo.text}
          </span>

          <Link to={`/todo/${todo.id}`} style={{ fontSize: '13px', marginRight: '4px' }}>
            [상세]
          </Link>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={() => onToggleDone(todo.id)}>
            {todo.done ? '취소' : '완료'}
          </button>
          <button onClick={() => onDelete(todo.id)}>삭제</button>
        </>
      )}
    </li>
  );
}

function TaskList({ todos, onToggleDone, onDelete, onUpdate }) {
  if (todos.length === 0) {
    return <p style={{ color: '#666', textAlign: 'center' }}>해당하는 할 일이 없습니다.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default TaskList;