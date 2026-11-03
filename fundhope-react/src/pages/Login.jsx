import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    const loginEmail = email.trim().toLowerCase()

    // ADMIN LOGIN
    if (
      loginEmail === 'admin@fundhope.com' &&
      password === 'Admin@123'
    ) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('fundhopeCurrentRole', 'admin')

      alert('Admin login successful!')
      navigate('/admin-dashboard')
      return
    }

    // GET REGISTERED USERS
    let users = []

    try {
      users = JSON.parse(
        localStorage.getItem('fundhopeUsers') || '[]'
      )
    } catch {
      users = []
    }

    // SUPPORT OLD USER DATA
    try {
      const oldUser = JSON.parse(
        localStorage.getItem('fundhopeUser') || 'null'
      )

      if (
        oldUser &&
        !users.some(
          user => user.email?.toLowerCase() === oldUser.email?.toLowerCase()
        )
      ) {
        users.push(oldUser)
      }
    } catch {
      // Ignore invalid old data
    }

    // FIND USER
    const user = users.find(
      item =>
        item.email?.toLowerCase() === loginEmail &&
        item.password === password
    )

    if (user) {
      localStorage.setItem('fundhopeUser', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('fundhopeCurrentRole', 'user')

      alert('Login successful! Welcome ' + user.name)
      navigate('/dashboard')
    } else {
      alert('Invalid email or password!')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Welcome Back!</h1>
        <p>Login to your FundHope account</p>

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </form>
    </div>
  )
}

export default Login