import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserById, updateProfile } from '../api/api'
import { updateUser } from '../redux/userSlice'
import SkillTag from '../components/SkillTag/SkillTag'
import styles from './Profile.module.css'

export default function Profile() {
  const { id } = useParams()
  const { currentUser } = useSelector((s) => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOwn = !id || id === currentUser._id

  const [user, setUser] = useState(isOwn ? currentUser : null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [newSkillOffered, setNewSkillOffered] = useState('')
  const [newSkillWanted, setNewSkillWanted] = useState('')

  useEffect(() => {
    if (!isOwn) {
      getUserById(id).then(r => setUser(r.data.user)).catch(() => navigate('/'))
    } else {
      setUser(currentUser)
    }
  }, [id])

  useEffect(() => {
    if (user && editing) {
      setForm({
        name: user.name,
        bio: user.bio || '',
        location: user.location || '',
        hourlyRate: user.hourlyRate || 0,
        skillsOffered: [...(user.skillsOffered || [])],
        skillsWanted: [...(user.skillsWanted || [])],
      })
    }
  }, [editing, user])

  const addSkill = (type) => {
    if (type === 'offered' && newSkillOffered.trim()) {
      setForm(f => ({ ...f, skillsOffered: [...f.skillsOffered, newSkillOffered.trim()] }))
      setNewSkillOffered('')
    }
    if (type === 'wanted' && newSkillWanted.trim()) {
      setForm(f => ({ ...f, skillsWanted: [...f.skillsWanted, newSkillWanted.trim()] }))
      setNewSkillWanted('')
    }
  }

  const removeSkill = (type, skill) => {
    setForm(f => ({ ...f, [type]: f[type].filter(s => s !== skill) }))
  }

  const handleSave = async () => {
    try {
      const res = await updateProfile(form)
      dispatch(updateUser(res.data.user))
      setUser(res.data.user)
      setEditing(false)
    } catch {
      alert('Error updating profile')
    }
  }

  if (!user) return <div className="page" style={{ color: 'var(--muted)' }}>Loading...</div>

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="avatar" style={{ width: 90, height: 90, fontSize: 36 }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            : user.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.location}>📍 {user.location || 'Remote'}</p>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.headerActions}>
            {isOwn && !editing && (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
            )}
            {!isOwn && (
              <button className="btn btn-primary" onClick={() => navigate(`/chat/${user._id}`)}>
                💬 Message
              </button>
            )}
          </div>
        </div>
        {user.hourlyRate > 0 && (
          <span className="badge badge-gold" style={{ alignSelf: 'flex-start', fontSize: 15, padding: '6px 16px' }}>
            ⭐ ${user.hourlyRate}/hr
          </span>
        )}
      </div>

      {editing ? (
        <div className={styles.editForm}>
          <h2 className={styles.sectionTitle}>Edit Profile</h2>
          <div className={styles.editGrid}>
            <div>
              <label className={styles.label}>Name</label>
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={styles.label}>Location</label>
              <input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className={styles.label}>Hourly Rate (USD)</label>
              <input type="number" value={form.hourlyRate || 0} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} min="0" />
            </div>
          </div>
          <label className={styles.label}>Bio</label>
          <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} style={{ marginBottom: 16 }} />

          <div className={styles.skillEdit}>
            <div>
              <label className={styles.label}>Skills Offered</label>
              <div className={styles.skillList}>
                {form.skillsOffered?.map(s => (
                  <SkillTag key={s} skill={s} type="offered" onRemove={() => removeSkill('skillsOffered', s)} />
                ))}
              </div>
              <div className={styles.skillAdd}>
                <input
                  placeholder="Add skill..."
                  value={newSkillOffered}
                  onChange={e => setNewSkillOffered(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill('offered')}
                />
                <button className="btn btn-outline" onClick={() => addSkill('offered')}>Add</button>
              </div>
            </div>
            <div>
              <label className={styles.label}>Skills Wanted</label>
              <div className={styles.skillList}>
                {form.skillsWanted?.map(s => (
                  <SkillTag key={s} skill={s} type="wanted" onRemove={() => removeSkill('skillsWanted', s)} />
                ))}
              </div>
              <div className={styles.skillAdd}>
                <input
                  placeholder="Add skill..."
                  value={newSkillWanted}
                  onChange={e => setNewSkillWanted(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill('wanted')}
                />
                <button className="btn btn-outline" onClick={() => addSkill('wanted')}>Add</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.infoGrid}>
          <div className="card">
            <h3 className={styles.sectionTitle}>Skills Offered</h3>
            <div className={styles.skillList}>
              {user.skillsOffered?.length
                ? user.skillsOffered.map(s => <SkillTag key={s} skill={s} type="offered" />)
                : <p style={{ color: 'var(--muted)' }}>None listed</p>}
            </div>
          </div>
          <div className="card">
            <h3 className={styles.sectionTitle}>Skills Wanted</h3>
            <div className={styles.skillList}>
              {user.skillsWanted?.length
                ? user.skillsWanted.map(s => <SkillTag key={s} skill={s} type="wanted" />)
                : <p style={{ color: 'var(--muted)' }}>None listed</p>}
            </div>
          </div>
          <div className="card">
            <h3 className={styles.sectionTitle}>Connections</h3>
            <p style={{ fontSize: 28, fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--accent)' }}>
              {user.connections?.length || 0}
            </p>
          </div>
          <div className="card">
            <h3 className={styles.sectionTitle}>Member Since</h3>
            <p style={{ color: 'var(--muted)' }}>
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}