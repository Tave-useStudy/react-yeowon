import { useState } from 'react';

function TextInput({ onAddTodo }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('공부');
  const [priority, setPriority] = useState('medium');

  const isOverLimit = text.length > 20;
  const isEmpty = text.trim() === '';
  const isDisabled = isEmpty || isOverLimit;

  const handleAdd = () => {
    if (isDisabled) return;
    onAddTodo({ text, category, priority });
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요 (최대 20자)"
          style={{ flex: 1, padding: '8px' }}
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option value="공부">공부</option>
          <option value="업무">업무</option>
          <option value="일상">일상</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px' }}>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>

        <button onClick={handleAdd} disabled={isDisabled} style={{ padding: '8px 16px' }}>
          추가
        </button>
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <span>{text.length} / 20자</span>
        {isOverLimit && (
          <p style={{ color: 'red', margin: '4px 0 0' }}>20자를 초과할 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default TextInput;