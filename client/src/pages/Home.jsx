import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getRequests, respondRequest, getConnections } from '../api/api'
import SkillTag from '../components/SkillTag/SkillTag'
import styles from './Home.module.css'

export default function Home() {
  const { currentUser } = useSelector((s) => s.user)
  const [requests, setRequests] = useState({ sent: [], received: [] })
  const [connections, setConnections] = useState([])

  useEffect(() => {
    getRequests().then(r => setRequests(r.data)).catch(() => {})
    getConnections().then(r => setConnections(r.data.connections || [])).catch(() => {})
  }, [])

  const handleRespond = async (id, status) => {
    await respondRequest(id, status)
    const r = await getRequests()
    setRequests(r.data)
    if (status === 'accepted') {
      getConnections().then(r => setConnections(r.data.connections || []))
    }
  }

  const pendingReceived = requests.received?.filter(r => r.status === 'pending') || []

  return (
    <div className="page">
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.title}>Hey, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p className={styles.sub}>Here's what's happening in your network.</p>
        </div>
        <Link to="/search" className="btn btn-primary">Explore Freelancers →</Link>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Connections', val: connections.length, icon: '🤝' },
          { label: 'Requests Sent', val: requests.sent?.length || 0, icon: '📤' },
          { label: 'Pending Requests', val: pendingReceived.length, icon: '📥' },
          { label: 'Skills Offered', val: currentUser?.skillsOffered?.length || 0, icon: '⚡' },
        ].map(({ label, val, icon }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statIcon}>{icon}</span>
            <span className={styles.statVal}>{val}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.sectionTitle}>Incoming Requests</h2>
          {pendingReceived.length === 0 && <p className={styles.empty}>No pending requests.</p>}
          {pendingReceived.map(req => (
            <div key={req._id} className={`card ${styles.requestCard}`}>
              <div className={styles.reqHeader}>
                <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {req.sender?.name?.charAt(0)}
                </div>
                <div>
                  <p className={styles.reqName}>{req.sender?.name}</p>
                  <p className={styles.reqMsg}>{req.message}</p>
                </div>
              </div>
              <div className={styles.reqSkills}>
                <span>Offers: <SkillTag skill={req.skillOffered} type="offered" /></span>
                <span>Wants: <SkillTag skill={req.skillWanted} type="wanted" /></span>
              </div>
              <div className={styles.reqActions}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleRespond(req._id, 'accepted')}>
                  Accept ✓
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleRespond(req._id, 'rejected')}>
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className={styles.sectionTitle}>Your Connections</h2>
          {connections.length === 0 && (
            <p className={styles.empty}>
              No connections yet.{' '}
              <Link to="/search" style={{ color: 'var(--accent)' }}>Find people →</Link>
            </p>
          )}
          {connections.slice(0, 5).map(user => (
            <Link to={`/chat/${user._id}`} key={user._id} className={styles.connectionItem}>
              <div className="avatar" style={{ width: 40, height: 40, fontSize: 16, flexShrink: 0 }}>
                {user.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                  {user.skillsOffered?.slice(0, 2).map(s => <SkillTag key={s} skill={s} type="offered" />)}
                </div>
              </div>
              {user.isOnline && <span className="online-dot" />}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}