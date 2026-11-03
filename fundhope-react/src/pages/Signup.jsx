import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
const navigate = useNavigate();

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const handleSignup = (e) => {
  e.preventDefault();

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

if (!cleanName || !cleanEmail || !password || !confirmPassword) {
  alert('Please fill all fields!');
  return;
}

if (password !== confirmPassword) {
  alert('Passwords do not match!');
  return;
}

if (password.length < 6) {
  alert('Password must be at least 6 characters!');
  return;
}

if (cleanEmail === 'admin@fundhope.com') {
  alert('This email is reserved for Admin!');
  return;
}

let users = [];

try {
  users = JSON.parse(localStorage.getItem('fundhopeUsers') || '[]');
  if (!Array.isArray(users)) users = [];
} catch (error) {
  users = [];
}

const existingUser = users.find(
  (user) => user.email?.toLowerCase() === cleanEmail
);

if (existingUser) {
  alert('Account already exists! Please Login.');
  return;
}

const newUser = {
  name: cleanName,
  email: cleanEmail,
  password: password,
  role: 'user'
};

users.push(newUser);

try {
  localStorage.setItem('fundhopeUsers', JSON.stringify(users));
  alert('Account created successfully!');
  navigate('/login');
} catch (error) {
  console.error(error);
  alert('Unable to create account. Please try again.');
}

};

return ( <div className="auth-container"> <form className="auth-card" onSubmit={handleSignup}> <h1>Create Account</h1> <p>Join the FundHope community</p>

    <label>Full Name</label>
    <input
      type="text"
      placeholder="Enter your full name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />

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
      placeholder="Create a password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <label>Confirm Password</label>
    <input
      type="password"
      placeholder="Confirm your password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />

    <button type="submit">Sign Up</button>

    <p className="auth-link">
      Already have an account? <Link to="/login">Login</Link>
    </p>

    <Link to="/" className="back-home">
      Back to Home
    </Link>
  </form>
</div>
);
}

export default Signup;
