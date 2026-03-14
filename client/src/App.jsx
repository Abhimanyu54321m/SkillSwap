import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Chat from './pages/Chat'

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser ? children : <Navigate to="/login" />
}

export default function App() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <BrowserRouter>
      {currentUser && <Navbar />}
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/profile/:id?" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/chat/:userId?" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}