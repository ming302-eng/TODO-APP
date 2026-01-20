import { useState, useEffect } from 'react';
import styles from './TodoModal.module.css';

function TodoModal({ isOpen, onClose, onSave, todo, folders }) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [folderId, setFolderId] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setMemo(todo.memo || '');
      setDueDate(todo.dueDate || '');
      setDueTime(todo.dueTime || '');
      setFolderId(todo.folderId || '');
    } else {
      setTitle('');
      setMemo('');
      setDueDate('');
      setDueTime('');
      setFolderId('');
    }
  }, [todo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        id: todo?.id || Date.now(),
        title: title.trim(),
        memo: memo.trim(),
        dueDate: dueDate || null,
        dueTime: dueTime || null,
        folderId: folderId || null,
        completed: todo?.completed || false,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{todo ? '할일 수정' : '새 할일 추가'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">제목 *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할일 제목을 입력하세요"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="memo">메모</label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="추가 메모를 입력하세요"
              rows="3"
              className={styles.textarea}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="dueDate">기한 날짜</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueTime">기한 시간</label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={styles.input}
                disabled={!dueDate}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="folder">폴더</label>
            <select
              id="folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className={styles.select}
            >
              <option value="">선택 안 함</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.saveButton}>
              {todo ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoModal;
