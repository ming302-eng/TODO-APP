import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FolderManager from './components/FolderManager';
import CategoryTabs from './components/CategoryTabs';
import TodoList from './components/TodoList';
import TodoModal from './components/TodoModal';
import { saveTodos, loadTodos, saveFolders, loadFolders, categorizeTodo } from './utils/localStorage';
import styles from './App.module.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [category, setCategory] = useState('today');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // LocalStorage에서 초기 데이터 로드
  useEffect(() => {
    const loadedTodos = loadTodos();
    const loadedFolders = loadFolders();
    setTodos(loadedTodos);
    setFolders(loadedFolders);
  }, []);

  // todos 변경 시 LocalStorage에 저장
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // folders 변경 시 LocalStorage에 저장
  useEffect(() => {
    saveFolders(folders);
  }, [folders]);

  // 할일 추가/수정
  const handleSaveTodo = (todoData) => {
    if (editingTodo) {
      // 수정
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? todoData : todo
      ));
      setEditingTodo(null);
    } else {
      // 추가
      setTodos([...todos, todoData]);
    }
    setIsModalOpen(false);
  };

  // 할일 완료 토글
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 할일 삭제
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할일 수정 모달 열기
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // 폴더 추가
  const handleAddFolder = (folderData) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      ...folderData,
    };
    setFolders([...folders, newFolder]);
  };

  // 폴더 삭제
  const handleDeleteFolder = (folderId) => {
    // 기본 폴더는 삭제 불가
    const defaultFolderIds = ['folder-1', 'folder-2', 'folder-3'];
    if (defaultFolderIds.includes(folderId)) {
      return;
    }
    
    // 해당 폴더의 할일들을 폴더 없음으로 변경
    setTodos(todos.map(todo => 
      todo.folderId === folderId ? { ...todo, folderId: null } : todo
    ));
    setFolders(folders.filter(f => f.id !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  // 카테고리별 필터링
  const getFilteredTodos = () => {
    let filtered = todos.filter(todo => !todo.completed);
    
    // 카테고리 필터
    if (category === 'today') {
      filtered = filtered.filter(todo => categorizeTodo(todo) === 'today');
    } else if (category === 'thisWeek') {
      filtered = filtered.filter(todo => categorizeTodo(todo) === 'thisWeek');
    } else if (category === 'later') {
      filtered = filtered.filter(todo => categorizeTodo(todo) === 'later');
    }

    // 폴더 필터
    if (selectedFolderId) {
      filtered = filtered.filter(todo => todo.folderId === selectedFolderId);
    }

    return filtered;
  };

  // 카테고리별 개수 계산
  const getCategoryCounts = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    return {
      today: activeTodos.filter(todo => categorizeTodo(todo) === 'today').length,
      thisWeek: activeTodos.filter(todo => categorizeTodo(todo) === 'thisWeek').length,
      later: activeTodos.filter(todo => categorizeTodo(todo) === 'later').length,
    };
  };

  const filteredTodos = getFilteredTodos();
  const categoryCounts = getCategoryCounts();

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>할일 관리</h1>
        
        <Dashboard todos={todos} folders={folders} />
        
        <FolderManager
          folders={folders}
          onAddFolder={handleAddFolder}
          onDeleteFolder={handleDeleteFolder}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />

        <div className={styles.mainContent}>
          <div className={styles.headerSection}>
            <CategoryTabs
              currentCategory={category}
              onCategoryChange={setCategory}
              counts={categoryCounts}
            />
            <button
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              + 할일 추가
            </button>
          </div>

          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={handleEditTodo}
            folders={folders}
            selectedFolderId={selectedFolderId}
          />
        </div>

        <TodoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTodo}
          todo={editingTodo}
          folders={folders}
        />
      </div>
    </div>
  );
}

export default App;
