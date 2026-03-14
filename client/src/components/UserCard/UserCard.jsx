import { useNavigate } from 'react-router-dom'
import SkillTag from '../SkillTag/SkillTag'
import styles from './UserCard.module.css'

export default function UserCard({ user, onConnect, requestStatus }) {
  const navigate = useNavigate()
  const initial = user.name?.charAt(0).toUpperCase()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            : initial}
        </div>
        <div>
          <h3 className={styles.name}>{user.name}</h3>
          <p className={styles.location}>📍 {user.location || 'Remote'}</p>
        </div>
        {user.isOnline && <span className="online-dot" style={{ marginLeft: 'auto' }} />}
      </div>

      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      <div className={styles.skills}>
        <div>
          <p className={styles.skillLabel}>Offers</p>
          <div className={styles.skillList}>
            {user.skillsOffered?.slice(0, 3).map(s => <SkillTag key={s} skill={s} type="offered" />)}
          </div>
        </div>
        <div>
          <p className={styles.skillLabel}>Wants</p>
          <div className={styles.skillList}>
            {user.skillsWanted?.slice(0, 3).map(s => <SkillTag key={s} skill={s} type="wanted" />)}
          </div>
        </div>
      </div>

      {user.hourlyRate > 0 && (
        <p className={styles.rate}>
          <span className="badge badge-gold">⭐ ${user.hourlyRate}/hr</span>
        </p>
      )}

      <div className={styles.actions}>
        <button className="btn btn-outline" onClick={() => navigate(`/profile/${user._id}`)} style={{ flex: 1 }}>
          View Profile
        </button>
        {onConnect && (
          <button
            className="btn btn-primary"
            onClick={() => onConnect(user)}
            disabled={requestStatus === 'pending' || requestStatus === 'accepted'}
            style={{ flex: 1 }}
          >
            {requestStatus === 'pending' ? 'Pending' : requestStatus === 'accepted' ? 'Connected ✓' : 'Connect'}
          </button>
        )}
        <button className="btn btn-outline" onClick={() => navigate(`/chat/${user._id}`)} style={{ padding: '10px 14px' }}>
          💬
        </button>
      </div>
    </div>
  )
}