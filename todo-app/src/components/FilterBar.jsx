function FilterBar({
  statusTab,
  setStatusTab,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => setStatusTab('all')}
          style={{ fontWeight: statusTab === 'all' ? 'bold' : 'normal' }}
        >
          전체
        </button>
        <button
          onClick={() => setStatusTab('active')}
          style={{ fontWeight: statusTab === 'active' ? 'bold' : 'normal' }}
        >
          미완료
        </button>
        <button
          onClick={() => setStatusTab('completed')}
          style={{ fontWeight: statusTab === 'completed' ? 'bold' : 'normal' }}
        >
          완료
        </button>
      </div>

      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="ALL">전체 카테고리</option>
        <option value="공부">공부</option>
        <option value="업무">업무</option>
        <option value="일상">일상</option>
      </select>

      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="default">최신 등록순</option>
        <option value="priority">우선순위 높은순</option>
      </select>
    </div>
  );
}

export default FilterBar;