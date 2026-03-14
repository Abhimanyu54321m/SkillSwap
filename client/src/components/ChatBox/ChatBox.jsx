import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getMessages } from '../../api/api'
import styles from './ChatBox.module.css'

export default function ChatBox({ socket, selectedUser }) {
  const { currentUser } = useSelector((s) => s.user)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeout = useRef(null)

  const roomId = [currentUser._id, selectedUser._id].sort().join('_')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getMessages(roomId)
        setMessages(res.data.messages || [])
      } catch (err) {
        setMessages([])
      }
    }
    fetchMessages()
    socket.emit('join_room', roomId)

    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]))
    socket.on('user_typing', () => setIsTyping(true))
    socket.on('user_stop_typing', () => setIsTyping(false))

    return () => {
      socket.off('receive_message')
      socket.off('user_typing')
      socket.off('user_stop_typing')
    }
  }, [selectedUser._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleInput = (e) => {
    setInput(e.target.value)
    socket.emit('typing', { roomId, userId: currentUser._id })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => socket.emit('stop_typing', { roomId }), 1500)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('send_message', {
      roomId,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      content: input.trim(),
    })
    setInput('')
    socket.emit('stop_typing', { roomId })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        <div className="avatar" style={{ width: 38, height: 38, fontSize: 15 }}>
          {selectedUser.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className={styles.chatName}>{selectedUser.name}</p>
          <p className={styles.chatStatus}>
            {isTyping ? '✍️ typing...' : selectedUser.isOnline ? '🟢 Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, i) => {
          const isSent = msg.sender === currentUser._id || msg.sender?._id === currentUser._id
          return (
            <div key={i} className={`${styles.msg} ${isSent ? styles.sent : styles.recv}`}>
              <p>{msg.content}</p>
              <span className={styles.time}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputRow}>
        <textarea
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={2}
          className={styles.textarea}
        />
        <button onClick={sendMessage} className={`btn btn-primary ${styles.sendBtn}`}>Send</button>
      </div>
    </div>
  )
}