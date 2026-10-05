const TODO_API_URL =
  'https://jsonplaceholder.typicode.com/todos';

const CATEGORIES = ['공부', '업무', '일상'];
const PRIORITIES = ['low', 'medium', 'high'];

function convertApiTodo(todo) {
  return {
    id: todo.id,
    text: todo.title,
    category:
      CATEGORIES[(todo.userId - 1) % CATEGORIES.length],
    priority:
      PRIORITIES[(todo.id - 1) % PRIORITIES.length],
    done: todo.completed,
  };
}

export async function fetchTodos() {
  const response = await fetch(TODO_API_URL);

  // body parsing은 HTTP 성공 여부를 확인한 뒤 수행합니다.
  if (!response.ok) {
    throw new Error(
      `API 요청에 실패했습니다. (${response.status})`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('API 응답 형식이 올바르지 않습니다.');
  }

  return data.slice(0, 10).map(convertApiTodo);
}
