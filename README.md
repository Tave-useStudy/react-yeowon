# React Todo Week Assignment

지난 주차 Todo 프로젝트를 이어서 이번 주 요구사항을 적용한 예시입니다.

## 바뀐 파일

```text
src/
├─ App.jsx
├─ components/
│  └─ ApiTodoLoader.jsx
├─ hooks/
│  └─ useLocalStorage.js
├─ index.css
├─ pages/
│  └─ HomePage.jsx
├─ reducers/
│  └─ todoReducer.js
└─ services/
   └─ todoApi.js
```

기존 `DetailPage.jsx`, `FilterBar.jsx`, `TextInput.jsx`, `TaskList.jsx`,
`UserProfile.jsx`, `SettingsPage.jsx`는 그대로 사용합니다.

---

## 1. useState → useReducer

### 기존 문제

`App.jsx` 안에서 다음 CRUD 로직이 각각 `setTodos`를 호출했습니다.

- 추가
- 완료 토글
- 삭제
- 수정

Todo 관련 상태 변경 규칙이 App 컴포넌트 곳곳에 흩어져 있었습니다.

### 적용 rule

`useReducer`

### 결과

이벤트 핸들러는 "무슨 일이 일어났는지"를 action으로 전달하고,
실제 배열 변경 로직은 `todoReducer.js`에 모았습니다.

```js
dispatch({
  type: 'todo/deleted',
  payload: { id },
});
```

---

## 2. localStorage 저장 / 불러오기

### 기존 문제

새로고침하면 todos가 모두 사라졌습니다.

### 적용 rule

- `client-localstorage-schema`
- `rerender-lazy-state-init`
- `rerender-dependencies`

### 결과

`useLocalStorage`를 별도 Custom Hook으로 분리했습니다.

저장 형식:

```js
{
  version: 1,
  savedAt: '...',
  data: [...]
}
```

처음 로딩할 때만 lazy initializer로 localStorage를 읽습니다.

```js
useState(() => readStoredValue(key, fallbackValue));
```

Todo state가 바뀔 때는 React state를 브라우저의 외부 저장소인
localStorage와 동기화하기 위해 Effect를 사용합니다.

---

## 3. Effect 남용 방지

### 기존에 피해야 하는 코드

```js
useEffect(() => {
  fetch('/todos').then(...);
}, []);
```

이번 구현은 사용자가 `API 투두 불러오기` 버튼을 클릭했을 때
네트워크 요청이 발생하므로 이벤트 핸들러 안에서 처리했습니다.

```js
const handleLoadApiTodos = async () => {
  // fetch
};
```

즉 "사용자 이벤트 때문에 실행되는 로직"을 Effect로 옮기지 않았습니다.

---

## 4. 파생 상태 금지

### 문제

필터 결과와 정렬 결과를 별도 state로 만들면 원본 todos와
동기화해야 하는 상태가 늘어납니다.

### 적용 rule

`rerender-derived-state-no-effect`

### 결과

기존 HomePage 방식처럼 렌더링 중 계산합니다.

```js
const filteredTodos = todos.filter(...);
const sortedTodos = filteredTodos.toSorted(...);
```

별도 `useEffect`와 `setFilteredTodos`는 만들지 않았습니다.

---

## 5. API 연동

API:

```text
https://jsonplaceholder.typicode.com/todos
```

앞 10개 데이터를 기존 프로젝트의 Todo 형식으로 변환합니다.

JSONPlaceholder:

```js
{
  userId,
  id,
  title,
  completed
}
```

프로젝트 Todo:

```js
{
  id,
  text,
  category,
  priority,
  done
}
```

`title → text`, `completed → done`으로 변환하고,
기존 UI와 호환하기 위해 category / priority를 부여합니다.

---

## 6. 로딩 / 에러 / 재시도

Reducer에 다음 비동기 상태를 함께 관리합니다.

```text
idle
loading
success
error
```

`ApiTodoLoader`는 이 값에 따라

- CSS 애니메이션 로딩 스피너
- 에러 메시지
- 재시도 버튼
- 성공 메시지

를 렌더링합니다.

---

## 7. 불변성

Reducer에서는 기존 배열이나 객체를 직접 변경하지 않습니다.

```js
todos: state.todos.map(...)
todos: state.todos.filter(...)
todos: [...state.todos, newTodo]
```

---

## 8. js-set-map-lookups

API 불러오기 버튼을 여러 번 눌렀을 때 동일 id Todo가 중복될 수 있습니다.

매 항목마다 `find()`로 전체 배열을 반복 탐색하지 않고,
기존 id를 Set으로 만들어 O(1)에 가까운 lookup을 사용합니다.

```js
const existingIds = new Set(
  state.todos.map((todo) => todo.id)
);

const uniqueApiTodos = apiTodos.filter(
  (todo) => !existingIds.has(todo.id)
);
```

---

## 9. async-defer-await

HTTP 응답이 성공인지 먼저 확인한 다음 body를 await합니다.

```js
const response = await fetch(url);

if (!response.ok) {
  throw new Error(...);
}

const data = await response.json();
```

필요 없는 작업을 먼저 시작하지 않고,
실제로 필요한 지점에서 응답 body를 파싱합니다.

---

## 10. async-parallel

이번 과제의 필수 API는 단일 `/todos` 요청 하나이므로,
독립적인 여러 요청을 억지로 `Promise.all()`로 만들지 않았습니다.

추후 서로 독립적인 여러 엔드포인트를 동시에 가져오게 된다면:

```js
const [todos, users] = await Promise.all([
  fetchTodos(),
  fetchUsers(),
]);
```

처럼 적용할 수 있습니다.

"rule을 무조건 쓰는 것"보다 실제 병렬화 가능한 작업이 있을 때
적용하는 것이 이 과제의 비동기 설계 취지에 더 맞습니다.

---

## 발표용 핵심 설명

### useReducer

> CRUD 업데이트 규칙을 하나의 reducer로 모아서 상태 변경 흐름을
> action 단위로 명확하게 만들었습니다.

### localStorage

> 새로고침 후에도 Todo를 유지해야 하기 때문에 React state를
> 브라우저 외부 저장소인 localStorage와 Effect로 동기화했습니다.

### Effect 남용 금지

> API 요청은 버튼 클릭이라는 명확한 사용자 이벤트가 원인이므로
> useEffect가 아니라 이벤트 핸들러에서 요청했습니다.

### 파생 상태 금지

> 필터링/정렬 결과는 todos와 필터 조건만 있으면 계산할 수 있기 때문에
> 별도 state로 저장하지 않고 렌더링 중 계산했습니다.

### Custom Hook

> localStorage의 JSON 파싱, schema 검사, 예외 처리, 저장 로직을
> `useLocalStorage`에 숨겨 App 컴포넌트의 역할을 줄였습니다.

### Set

> API Todo 중복 검사에 Set을 사용해 배열을 매번 다시 탐색하지 않도록 했습니다.
