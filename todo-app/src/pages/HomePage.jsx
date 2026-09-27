import { useState } from 'react';
import TextInput from '../components/TextInput';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import UserProfile from '../components/UserProfile';

function HomePage({ todos, onAddTodo, onToggleDone, onDelete, onUpdate }) {
  const [statusTab, setStatusTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('default');

  // filter() 활용
  const filteredTodos = todos.filter((todo) => {
    if (statusTab === 'active' && todo.done) return false;
    if (statusTab === 'completed' && !todo.done) return false;
    if (selectedCategory !== 'ALL' && todo.category !== selectedCategory) return false;
    return true;
  });

  const priorityWeight = { high: 3, medium: 2, low: 1 };

  // .toSorted() 활용
  const sortedTodos = filteredTodos.toSorted((a, b) => {
    if (sortOrder === 'priority') {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return b.id - a.id;
  });

  return (
    <div>
      <TextInput onAddTodo={onAddTodo} />
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