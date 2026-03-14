import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/userSlice'
import { loginUser, registerUser } from '../api/api'
import styles from './Login.module.css'

export default function Login() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.user)
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', bio: '',
    location: '', skillsOffered: '', skillsWanted: '', hourlyRate: 0
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const data = isRegister
        ? {
            ...form,
            skillsOffered: form.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
            skillsWanted: form.skillsWanted.split(',').map(s => s.trim()).filter(Boolean),
          }
        : { email: form.email, password: form.password }

      const res = isRegister ? await registerUser(data) : await loginUser(data)
      dispatch(loginSuccess(res.data))
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Something went wrong'))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Exchange Skills.<br />Grow Together.</h1>
          <p className={styles.heroSub}>
            SkillSwap connects you with talented freelancers ready to trade expertise.
            Learn new skills, find collaborators, build your network.
          </p>
          <div className={styles.stats}>
            <div><span className={styles.statNum}>2.4K+</span><span className={styles.statLabel}>Active Freelancers</span></div>
            <div><span className={styles.statNum}>150+</span><span className={styles.statLabel}>Skill Categories</span></div>
            <div><span className={styles.statNum}>8.9K+</span><span className={styles.statLabel}>Successful Swaps</span></div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className={styles.formSub}>
            {isRegister ? 'Join the skill exchange community' : 'Sign in to your account'}
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {isRegister && (
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            )}
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

            {isRegister && (
              <>
                <input name="bio" placeholder="Short bio about yourself" value={form.bio} onChange={handleChange} />
                <input name="location" placeholder="Your Location (e.g. Mumbai, India)" value={form.location} onChange={handleChange} />
                <input name="skillsOffered" placeholder="Skills you offer (e.g. React, Node.js, Design)" value={form.skillsOffered} onChange={handleChange} />
                <input name="skillsWanted" placeholder="Skills you want (e.g. Python, Marketing)" value={form.skillsWanted} onChange={handleChange} />
                <input name="hourlyRate" type="number" placeholder="Hourly Rate in USD (e.g. 25)" value={form.hourlyRate} onChange={handleChange} min="0" />
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account ⚡' : 'Sign In →'}
            </button>
          </form>

          <p className={styles.toggle}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsRegister(!isRegister)} className={styles.toggleBtn}>
              {isRegister ? ' Sign In' : ' Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}