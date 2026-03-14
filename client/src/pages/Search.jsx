import { useState, useEffect } from 'react'
import { getUsers, sendRequest, getRequests } from '../api/api'
import UserCard from '../components/UserCard/UserCard'
import styles from './Search.module.css'

export default function Search() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [sentRequests, setSentRequests] = useState({})
  const [filters, setFilters] = useState({ search: '', skill: '', location: '', minRate: '', maxRate: '' })
  const [showConnect, setShowConnect] = useState(null)
  const [connectForm, setConnectForm] = useState({ message: '', skillOffered: '', skillWanted: '' })

  useEffect(() => {
    fetchUsers()
    getRequests().then(r => {
      const map = {}
      r.data.sent?.forEach(req => { map[req.receiver._id || req.receiver] = req.status })
      r.data.received?.forEach(req => { map[req.sender._id || req.sender] = req.status })
      setSentRequests(map)
    }).catch(() => {})
  }, [])

  const fetchUsers = async (params = {}) => {
    setLoading(true)
    try {
      const res = await getUsers(params)
      setUsers(res.data.users || [])
    } catch {
      setUsers([])
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.skill) params.skill = filters.skill
    if (filters.location) params.location = filters.location
    if (filters.minRate) params.minRate = filters.minRate
    if (filters.maxRate) params.maxRate = filters.maxRate
    fetchUsers(params)
  }

  const handleConnect = async () => {
    if (!connectForm.skillOffered || !connectForm.skillWanted) {
      return alert('Please fill in both skill fields')
    }
    try {
      await sendRequest({ receiverId: showConnect._id, ...connectForm })
      setSentRequests(prev => ({ ...prev, [showConnect._id]: 'pending' }))
      setShowConnect(null)
      setConnectForm({ message: '', skillOffered: '', skillWanted: '' })
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request')
    }
  }

  return (
    <div className="page">
      <h1 className={styles.title}>Explore Freelancers</h1>
      <p className={styles.sub}>Find talented people to exchange skills with</p>

      <form onSubmit={handleSearch} className={styles.filterBar}>
        <input
          placeholder="Search name or skill..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className={styles.searchInput}
        />
        <input
          placeholder="Skill offered..."
          value={filters.skill}
          onChange={e => setFilters({ ...filters, skill: e.target.value })}
        />
        <input
          placeholder="Location..."
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          placeholder="Min rate $"
          type="number"
          value={filters.minRate}
          onChange={e => setFilters({ ...filters, minRate: e.target.value })}
          className={styles.rateInput}
        />
        <input
          placeholder="Max rate $"
          type="number"
          value={filters.maxRate}
          onChange={e => setFilters({ ...filters, maxRate: e.target.value })}
          className={styles.rateInput}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => { setFilters({ search: '', skill: '', location: '', minRate: '', maxRate: '' }); fetchUsers() }}
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className={styles.loading}>Searching freelancers...</div>
      ) : (
        <>
          <p className={styles.resultCount}>{users.length} freelancer{users.length !== 1 ? 's' : ''} found</p>
          <div className={styles.grid}>
            {users.map(user => (
              <UserCard
                key={user._id}
                user={user}
                requestStatus={sentRequests[user._id]}
                onConnect={(u) => setShowConnect(u)}
              />
            ))}
          </div>
          {users.length === 0 && (
            <div className={styles.empty}>No freelancers found. Try different filters.</div>
          )}
        </>
      )}

      {showConnect && (
        <div className={styles.modal} onClick={() => setShowConnect(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Connect with {showConnect.name}</h3>
            <p className={styles.modalSub}>Tell them what you offer and what you want to learn</p>
            <div className={styles.modalForm}>
              <input
                placeholder="Skill you offer (e.g. React Development)"
                value={connectForm.skillOffered}
                onChange={e => setConnectForm({ ...connectForm, skillOffered: e.target.value })}
              />
              <input
                placeholder="Skill you want from them (e.g. UI/UX Design)"
                value={connectForm.skillWanted}
                onChange={e => setConnectForm({ ...connectForm, skillWanted: e.target.value })}
              />
              <textarea
                placeholder="Personal message (optional)"
                value={connectForm.message}
                onChange={e => setConnectForm({ ...connectForm, message: e.target.value })}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={handleConnect} style={{ flex: 1 }}>
                Send Request ⚡
              </button>
              <button className="btn btn-outline" onClick={() => setShowConnect(null)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}