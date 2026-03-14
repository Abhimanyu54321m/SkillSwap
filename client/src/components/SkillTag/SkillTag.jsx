import styles from './SkillTag.module.css'

export default function SkillTag({ skill, type = 'offered', onRemove }) {
  return (
    <span className={`${styles.tag} ${styles[type]}`}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className={styles.remove}>×</button>
      )}
    </span>
  )
}