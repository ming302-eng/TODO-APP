import { useState } from 'react';
import { formatDateTime } from '../utils/localStorage';
import styles from './TodoItem.module.css';

function TodoItem({ todo, onToggle, onDelete, onEdit, folders }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  const getFolderColor = (folderId) => {
    if (!folderId) return null;
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.color : null;
  };

  const getFolderName = (folderId) => {
    if (!folderId) return null;
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : null;
  };

  const folderColor = getFolderColor(todo.folderId);
  const folderName = getFolderName(todo.folderId);

  return (
    <li
      className={`${styles.item} ${todo.completed ? styles.completed : ''} ${
        isDeleting ? styles.deleting : ''
      }`}
      style={folderColor ? { borderLeftColor: folderColor } : {}}
    >
      <div className={styles.content}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
        />
        <div className={styles.textContent}>
          <div className={styles.header}>
            <span className={styles.title}>{todo.title}</span>
            {folderName && (
              <span
                className={styles.folderBadge}
                style={{ backgroundColor: folderColor }}
              >
                {folderName}
              </span>
            )}
          </div>
          {todo.memo && (
            <p className={styles.memo}>{todo.memo}</p>
          )}
          {todo.dueDate && (
            <div className={styles.dateTime}>
              <span className={styles.date}>
                📅 {formatDateTime(todo.dueDate)}
              </span>
              {todo.dueTime && (
                <span className={styles.time}>⏰ {todo.dueTime}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => onEdit(todo)}
          className={styles.editButton}
          aria-label="수정"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          className={styles.deleteButton}
          aria-label="삭제"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
