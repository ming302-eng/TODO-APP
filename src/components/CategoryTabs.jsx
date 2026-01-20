import styles from './CategoryTabs.module.css';

function CategoryTabs({ currentCategory, onCategoryChange, counts }) {
  const categories = [
    { id: 'today', label: '오늘', count: counts.today },
    { id: 'thisWeek', label: '이번주', count: counts.thisWeek },
    { id: 'later', label: '나중에', count: counts.later },
  ];

  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`${styles.tab} ${
            currentCategory === category.id ? styles.active : ''
          }`}
        >
          <span className={styles.label}>{category.label}</span>
          {category.count > 0 && (
            <span className={styles.count}>{category.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
