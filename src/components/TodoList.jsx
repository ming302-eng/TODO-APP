import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

function TodoList({ todos, onToggle, onDelete, onEdit, folders, selectedFolderId }) {
  // 폴더별로 그룹화
  const groupedTodos = todos.reduce((groups, todo) => {
    const folderId = todo.folderId || 'no-folder';
    if (!groups[folderId]) {
      groups[folderId] = [];
    }
    groups[folderId].push(todo);
    return groups;
  }, {});

  // 날짜순 정렬
  const sortTodos = (todos) => {
    return [...todos].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      
      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }
      if (a.dueTime) return -1;
      if (b.dueTime) return 1;
      return 0;
    });
  };

  if (todos.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>할 일이 없습니다!</p>
        <p className={styles.emptySubtext}>새로운 할 일을 추가해보세요.</p>
      </div>
    );
  }

  // 폴더가 선택된 경우 해당 폴더만 표시
  if (selectedFolderId) {
    const filteredTodos = todos.filter(todo => todo.folderId === selectedFolderId);
    if (filteredTodos.length === 0) {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyText}>이 폴더에 할 일이 없습니다!</p>
        </div>
      );
    }
    return (
      <ul className={styles.list}>
        {sortTodos(filteredTodos).map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            folders={folders}
          />
        ))}
      </ul>
    );
  }

  // 폴더별로 그룹화하여 표시
  const folderIds = Object.keys(groupedTodos);
  const noFolderTodos = groupedTodos['no-folder'] || [];

  return (
    <div className={styles.container}>
      {noFolderTodos.length > 0 && (
        <div className={styles.group}>
          <ul className={styles.list}>
            {sortTodos(noFolderTodos).map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                folders={folders}
              />
            ))}
          </ul>
        </div>
      )}
      
      {folderIds.filter(id => id !== 'no-folder').map((folderId) => {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return null;
        
        return (
          <div key={folderId} className={styles.group}>
            <div className={styles.groupHeader}>
              <span
                className={styles.groupDot}
                style={{ backgroundColor: folder.color }}
              ></span>
              <h3 className={styles.groupTitle}>{folder.name}</h3>
            </div>
            <ul className={styles.list}>
              {sortTodos(groupedTodos[folderId]).map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  folders={folders}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;
