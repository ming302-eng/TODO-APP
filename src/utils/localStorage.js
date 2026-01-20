const STORAGE_KEY_TODOS = 'todo-app-todos';
const STORAGE_KEY_FOLDERS = 'todo-app-folders';

// 기본 폴더 정의
const DEFAULT_FOLDERS = [
  { id: 'folder-1', name: '업무', color: '#FFB3BA' },
  { id: 'folder-2', name: '개인', color: '#BAFFC9' },
  { id: 'folder-3', name: '공부', color: '#BAE1FF' },
];

// 할일 저장/로드
export const saveTodos = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  } catch (error) {
    console.error('할 일 저장 실패:', error);
  }
};

export const loadTodos = () => {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY_TODOS);
    if (storedTodos) {
      const todos = JSON.parse(storedTodos);
      // 기존 데이터 마이그레이션: text 필드를 title로 변환
      return todos.map(todo => {
        if (todo.text && !todo.title) {
          return {
            ...todo,
            title: todo.text,
            text: undefined,
          };
        }
        return todo;
      });
    }
  } catch (error) {
    console.error('할 일 불러오기 실패:', error);
  }
  return [];
};

// 폴더 저장/로드
export const saveFolders = (folders) => {
  try {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  } catch (error) {
    console.error('폴더 저장 실패:', error);
  }
};

export const loadFolders = () => {
  try {
    const storedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (storedFolders) {
      return JSON.parse(storedFolders);
    }
  } catch (error) {
    console.error('폴더 불러오기 실패:', error);
  }
  // 기본 폴더 반환
  return DEFAULT_FOLDERS;
};

// 날짜/시간 유틸리티
export const formatDateTime = (date, time) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  if (time) {
    return `${year}-${month}-${day} ${time}`;
  }
  return `${year}-${month}-${day}`;
};

// 할일 카테고리 분류 (오늘, 이번주, 나중에)
export const categorizeTodo = (todo) => {
  if (!todo.dueDate) return 'later';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 오늘 날짜
  if (diffDays === 0) return 'today';
  // 오늘부터 7일 이내 (이번주)
  if (diffDays > 0 && diffDays <= 7) return 'thisWeek';
  // 과거 날짜는 오늘로 처리
  if (diffDays < 0) return 'today';
  // 그 외는 나중에
  return 'later';
};

// 오늘 날짜의 할일 필터링
export const getTodayTodos = (todos) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return todos.filter(todo => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && !todo.completed;
  }).sort((a, b) => {
    // 시간순 정렬
    if (a.dueTime && b.dueTime) {
      return a.dueTime.localeCompare(b.dueTime);
    }
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;
    return 0;
  });
};
