import { useState } from 'react';
import TextInput from '../components/TextInput';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import UserProfile from '../components/UserProfile';
import ApiTodoLoader from '../components/ApiTodoLoader';

const PRIORITY_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1,
};

function HomePage({
  todos,
  onAddTodo,
  onToggleDone,
  onDelete,
  onUpdate,
  requestStatus,
  requestError,
  onLoadApiTodos,
}) {
  const [statusTab, setStatusTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('default');

  // filteredTodos / sortedTodos는 기존 state로부터 계산 가능한 "파생 값"입니다.
  // 별도의 state와 Effect를 만들지 않고 렌더링 중 바로 계산합니다.
  const filteredTodos = todos.filter((todo) => {
    if (statusTab === 'active' && todo.done) return false;
    if (statusTab === 'completed' && !todo.done) return false;
    if (
      selectedCategory !== 'ALL' &&
      todo.category !== selectedCategory
    ) {
      return false;
    }

    return true;
  });

  // toSorted()를 사용해 원본 todos 배열을 직접 변경하지 않습니다.
  const sortedTodos = filteredTodos.toSorted((a, b) => {
    if (sortOrder === 'priority') {
      return (
        PRIORITY_WEIGHT[b.priority] -
        PRIORITY_WEIGHT[a.priority]
      );
    }

    return b.id - a.id;
  });

  return (
    <div>
      <TextInput onAddTodo={onAddTodo} />

      <ApiTodoLoader
        status={requestStatus}
        error={requestError}
        onLoad={onLoadApiTodos}
      />

      <FilterBar
        statusTab={statusTab}
        setStatusTab={setStatusTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TaskList
        todos={sortedTodos}
        onToggleDone={onToggleDone}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />

      <UserProfile />
    </div>
  );
}

export default HomePage;
