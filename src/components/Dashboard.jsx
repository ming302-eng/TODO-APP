import { formatDateTime } from '../utils/localStorage';
import styles from './Dashboard.module.css';

function Dashboard({ todos, folders }) {
  const todayTodos = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).sort((a, b) => {
    if (a.dueTime && b.dueTime) {
      return a.dueTime.localeCompare(b.dueTime);
    }
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;
    return 0;
  });

  const getFolderColor = (folderId) => {
    if (!folderId) return '#E0E0E0';
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.color : '#E0E0E0';
  };

  const getFolderName = (folderId) => {
    if (!folderId) return '';
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : '';
  };

  if (todayTodos.length === 0) {
    return (
      <div className={styles.dashboard}>
        <h2 className={styles.title}>오늘의 일정</h2>
        <div className={styles.empty}>
          <p>오늘 예정된 할일이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>오늘의 일정</h2>
      <div className={styles.todoList}>
        {todayTodos.map((todo) => (
          <div key={todo.id} className={styles.todoItem}>
            <div className={styles.todoContent}>
              <div className={styles.todoHeader}>
                <h3 className={styles.todoTitle}>{todo.title}</h3>
                {todo.folderId && (
                  <span
                    className={styles.folderBadge}
                    style={{ backgroundColor: getFolderColor(todo.folderId) }}
                  >
                    {getFolderName(todo.folderId)}
                  </span>
                )}
              </div>
              {todo.memo && (
                <p className={styles.todoMemo}>{todo.memo}</p>
              )}
              <div className={styles.todoTime}>
                {todo.dueTime ? (
                  <span className={styles.time}>⏰ {todo.dueTime}</span>
                ) : (
                  <span className={styles.date}>📅 {formatDateTime(todo.dueDate)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
