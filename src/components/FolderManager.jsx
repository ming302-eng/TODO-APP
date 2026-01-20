import { useState } from 'react';
import styles from './FolderManager.module.css';

function FolderManager({ folders, onAddFolder, onDeleteFolder, selectedFolderId, onSelectFolder }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#FFB3BA');

  const presetColors = [
    '#FFB3BA', // 연한 핑크
    '#BAFFC9', // 연한 그린
    '#BAE1FF', // 연한 블루
    '#FFFFBA', // 연한 옐로우
    '#FFDFBA', // 연한 오렌지
    '#E1BAFF', // 연한 퍼플
  ];

  // 기본 폴더 ID 목록
  const defaultFolderIds = ['folder-1', 'folder-2', 'folder-3'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder({
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      setNewFolderName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.folderList}>
        <button
          className={`${styles.folderItem} ${!selectedFolderId ? styles.active : ''}`}
          onClick={() => onSelectFolder(null)}
        >
          <span className={styles.folderDot} style={{ backgroundColor: '#E0E0E0' }}></span>
          <span>전체</span>
        </button>
        {folders.map((folder) => (
          <div key={folder.id} className={styles.folderWrapper}>
            <button
              className={`${styles.folderItem} ${
                selectedFolderId === folder.id ? styles.active : ''
              }`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <span
                className={styles.folderDot}
                style={{ backgroundColor: folder.color }}
              ></span>
              <span>{folder.name}</span>
            </button>
            {folders.length > 3 && !defaultFolderIds.includes(folder.id) && (
              <button
                className={styles.deleteButton}
                onClick={() => onDeleteFolder(folder.id)}
                aria-label={`${folder.name} 폴더 삭제`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="폴더 이름"
            className={styles.folderInput}
            autoFocus
          />
          <div className={styles.colorPicker}>
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorOption} ${
                  newFolderColor === color ? styles.selected : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setNewFolderColor(color)}
              />
            ))}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.addButton}>
              추가
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setShowAddForm(false);
                setNewFolderName('');
              }}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          className={styles.addFolderButton}
          onClick={() => setShowAddForm(true)}
        >
          + 폴더 추가
        </button>
      )}
    </div>
  );
}

export default FolderManager;
