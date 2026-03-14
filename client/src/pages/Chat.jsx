import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { getConnections, getUserById } from '../api/api'
import ChatBox from '../components/ChatBox/ChatBox'
import styles from './Chat.module.css'

let socket

export default function Chat() {
  const { userId } = useParams()
  const { currentUser, token } = useSelector((s) => s.user)
  const [connections, setConnections] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token }
    })
    socket.emit('user_online', currentUser._id)
    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    getConnections().then(r => {
      const conns = r.data.connections || []
      setConnections(conns)
      if (userId) {
        const found = conns.find(u => u._id === userId)
        if (found) {
          setSelectedUser(found)
        } else {
          getUserById(userId).then(res => setSelectedUser(res.data.user)).catch(() => {})
        }
      }
    }).catch(() => {})
  }, [userId])

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sideTitle}>Messages</h2>
        {connections.length === 0 && (
          <p className={styles.empty}>Connect with freelancers to start chatting.</p>
        )}
        {connections.map(user => (
          <button
            key={user._id}
            className={`${styles.userItem} ${selectedUser?._id === user._id ? styles.selected : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="avatar" style={{ width: 42, height: 42, fontSize: 16, flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userSkill}>{user.skillsOffered?.[0] || 'Freelancer'}</p>
            </div>
            {user.isOnline && <span className="online-dot" />}
          </button>
        ))}
      </div>

      <div className={styles.main}>
        {selectedUser && socket ? (
          <ChatBox socket={socket} selectedUser={selectedUser} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>💬</span>
            <h3 className={styles.placeholderText}>Select a connection to start chatting</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Real-time messages powered by Socket.io</p>
          </div>
        )}
      </div>
    </div>
  )
}