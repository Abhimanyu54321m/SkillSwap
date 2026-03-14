import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/userSlice'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { currentUser } = useSelector((s) => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span>SkillSwap</span>
      </Link>
      <div className={styles.links}>
        <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>Home</Link>
        <Link to="/search" className={`${styles.link} ${isActive('/search') ? styles.active : ''}`}>Explore</Link>
        <Link to="/chat" className={`${styles.link} ${isActive('/chat') ? styles.active : ''}`}>Messages</Link>
      </div>
      <div className={styles.right}>
        <Link to={`/profile/${currentUser?._id}`} className={styles.avatarBtn}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
            {currentUser?.avatar
              ? <img src={currentUser.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              : currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userName}>{currentUser?.name?.split(' ')[0]}</span>
        </Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  )
}