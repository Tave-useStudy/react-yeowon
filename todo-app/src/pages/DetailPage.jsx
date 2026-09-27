import { useParams, useNavigate } from 'react';

function DetailPage({ todos }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const todo = todos.find((item) => item.id === Number(id));

  if (!todo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>존재하지 않는 할 일입니다.</p>
        <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>할 일 상세 정보</h2>
      <p><strong>ID:</strong> {todo.id}</p>
      <p><strong>내용:</strong> {todo.text}</p>
      <p><strong>카테고리:</strong> {todo.category}</p>
      <p><strong>우선순위:</strong> {todo.priority.toUpperCase()}</p>
      <p><strong>상태:</strong> {todo.done ? '완료됨' : '미완료'}</p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
        <button onClick={() => navigate('/')}>메인으로 가기</button>
      </div>
    </div>
  );
}

export default DetailPage;