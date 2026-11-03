import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from 'react-router-dom'

import './App.css'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateCampaign from './pages/CreateCampaign.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'


function Home() {
  const navigate = useNavigate()

  const defaultCampaigns = [
    {
      id: 'education',
      title: 'Help Children Get Education',
      category: 'Education',
      description:
        'Support children who need financial help to continue their education.',
      goal: 100000,
      raised: 65000,
      icon: '📚',
    },
    {
      id: 'medical',
      title: 'Medical Support for Families',
      category: 'Medical',
      description:
        'Help families who need support for essential medical treatment.',
      goal: 200000,
      raised: 120000,
      icon: '🏥',
    },
    {
      id: 'food',
      title: 'Food for Needy People',
      category: 'Food',
      description:
        'Provide food and basic necessities to people in need.',
      goal: 50000,
      raised: 35000,
      icon: '🍲',
    },
  ]

  const userCampaigns = JSON.parse(
    localStorage.getItem('fundhopeCampaigns') || '[]'
  ).map((campaign, index) => ({
    ...campaign,
    id: campaign.id || `user-${index}-${campaign.title}`,
    goal: Number(campaign.goal) || 0,
    raised: Number(campaign.raised) || 0,
    icon:
      campaign.category === 'Education'
        ? '📚'
        : campaign.category === 'Medical'
          ? '🏥'
          : campaign.category === 'Food'
            ? '🍲'
            : campaign.category === 'Environment'
              ? '🌳'
              : campaign.category === 'Animal Welfare'
                ? '🐾'
                : '❤️',
  }))

  const [campaignData, setCampaignData] = useState(() => {
    const savedProgress = JSON.parse(
      localStorage.getItem('fundhopeCampaignProgress') || 'null'
    )

    if (savedProgress && Array.isArray(savedProgress)) {
      const updatedCampaigns = [...savedProgress]

      defaultCampaigns.forEach((campaign) => {
        if (!updatedCampaigns.some((item) => item.id === campaign.id)) {
          updatedCampaigns.push(campaign)
        }
      })

      userCampaigns.forEach((campaign) => {
        if (!updatedCampaigns.some((item) => item.id === campaign.id)) {
          updatedCampaigns.push(campaign)
        }
      })

      return updatedCampaigns
    }

    return [...defaultCampaigns, ...userCampaigns]
  })

  const campaigns = campaignData.map((campaign) => ({
    ...campaign,
    goal: `₹${Number(campaign.goal).toLocaleString('en-IN')}`,
    raised: `₹${Number(campaign.raised).toLocaleString('en-IN')}`,
    progress:
      Number(campaign.goal) > 0
        ? Math.min(
            (Number(campaign.raised) / Number(campaign.goal)) * 100,
            100
          )
        : 0,
  }))

  const modules = [
    'Authentication Module',
    'User Dashboard Module',
    'Admin Dashboard Module',
    'Campaign Management Module',
    'Donation Module',
    'Local Storage Module',
  ]

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fundhopeFavorites') || '[]'
    )
  })

  const [darkMode, setDarkMode] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  )

  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [donationAmount, setDonationAmount] = useState('')

  const savedUser = JSON.parse(
    localStorage.getItem('fundhopeUser') || 'null'
  )

  const currentRole = localStorage.getItem('fundhopeCurrentRole')

  const toggleFavorite = (title) => {
    setFavorites((previous) => {
      const updated = previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]

      localStorage.setItem(
        'fundhopeFavorites',
        JSON.stringify(updated)
      )

      return updated
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('fundhopeCurrentRole')

    setIsLoggedIn(false)

    alert('You have been logged out!')
    navigate('/')
  }

  const handleDonate = () => {
    if (
      !isLoggedIn ||
      !savedUser ||
      currentRole === 'admin'
    ) {
      alert('Please login with a user account before donating.')
      navigate('/login')
      return
    }

    const amount = Number(donationAmount)

    if (!amount || amount <= 0 || !Number.isFinite(amount)) {
      alert('Please enter a valid donation amount.')
      return
    }

    const donations = JSON.parse(
      localStorage.getItem('fundhopeDonations') || '[]'
    )

    const newDonation = {
      id: Date.now(),
      userName: savedUser.name,
      userEmail: savedUser.email,
      campaignTitle: selectedCampaign.title,
      amount: amount,
      date: new Date().toLocaleDateString('en-IN'),
    }

    donations.push(newDonation)

    localStorage.setItem(
      'fundhopeDonations',
      JSON.stringify(donations)
    )

    const updatedCampaigns = campaignData.map((campaign) => {
      if (campaign.id === selectedCampaign.id) {
        return {
          ...campaign,
          raised: Number(campaign.raised) + amount,
        }
      }

      return campaign
    })

    setCampaignData(updatedCampaigns)

    localStorage.setItem(
      'fundhopeCampaignProgress',
      JSON.stringify(updatedCampaigns)
    )

    alert('Thank you! Your demo donation was successful ❤️')

    setSelectedCampaign(null)
    setDonationAmount('')
  }

  // FIXED SEARCH AND CATEGORY FILTER
  const filteredCampaigns = campaigns.filter((campaign) => {
    const title = (campaign.title || '').toLowerCase()
    const description = (campaign.description || '').toLowerCase()
    const campaignCategory = campaign.category || ''

    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      title.includes(searchText) ||
      description.includes(searchText) ||
      campaignCategory.toLowerCase().includes(searchText)

    const matchesCategory =
      category === 'All' || campaignCategory === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>

      {/* NAVBAR */}

      <header className="navbar">

        <a href="#home" className="brand">
          Fund<span>Hope</span> ❤️
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#campaigns">Campaigns</a>
          <a href="#modules">Modules</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-buttons">

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {isLoggedIn ? (
            <>
              {currentRole === 'admin' ? (
                <Link to="/admin-dashboard" className="login-btn">
                  🛡️ Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="login-btn">
                  👤 {savedUser?.name || 'My Account'}
                </Link>
              )}

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}

        </div>
      </header>


      {/* HERO SECTION */}

      <section className="hero-section" id="home">

        <div className="hero-content">

          <span className="tagline">
            TOGETHER WE CAN MAKE A DIFFERENCE
          </span>

          <h1>
            Small Help Can Create
            <span> Big Changes.</span>
          </h1>

          <p>
            FundHope is a crowdfunding platform where people come together
            to support meaningful causes and help those in need.
          </p>

          <div className="hero-buttons">

            <a href="#campaigns" className="primary-btn">
              Explore Campaigns →
            </a>

            <a href="#about" className="secondary-btn">
              Learn More
            </a>

          </div>

          <div className="hero-stats">

            <div>
              <h2>1,200+</h2>
              <p>Donors</p>
            </div>

            <div>
              <h2>350+</h2>
              <p>Campaigns</p>
            </div>

            <div>
              <h2>₹25L+</h2>
              <p>Donations</p>
            </div>

          </div>
        </div>

        <div className="hero-illustration">

          <div className="heart-circle">
            ❤️
          </div>

          <div className="hero-message">
            <span>💚</span>
            <h3>Be someone's hope</h3>
            <p>Your kindness matters.</p>
          </div>

        </div>

      </section>


      {/* ABOUT SECTION */}

      <section className="about-section" id="about">

        <span className="section-label">
          ABOUT FUNDHOPE
        </span>

        <h2>
          Making Giving <span>Simple & Meaningful</span>
        </h2>

        <p>
          FundHope connects campaign creators with people who want to make
          a positive difference. Our platform helps users create campaigns,
          discover causes and support people in need.
        </p>

      </section>


      {/* CAMPAIGNS SECTION */}

      <section className="campaign-section" id="campaigns">

        <span className="section-label">
          MAKE A DIFFERENCE
        </span>

        <h2>Featured Campaigns</h2>

        <p className="section-description">
          Discover campaigns and support causes that matter.
        </p>

        <div className="campaign-controls">

          <input
            type="text"
            placeholder="🔍 Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-buttons">

            {['All', 'Education', 'Medical', 'Food'].map((item) => (
              <button
                key={item}
                className={category === item ? 'active-filter' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}

          </div>

          <p className="favorite-count">
            ❤️ Favourite Campaigns: {favorites.length}
          </p>

        </div>

        <div className="campaign-grid">

          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (

              <article className="campaign-card" key={campaign.id}>

                <div className="campaign-icon">
                  {campaign.icon}
                </div>

                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(campaign.title)}
                  aria-label="Add or remove favourite"
                >
                  {favorites.includes(campaign.title) ? '❤️' : '🤍'}
                </button>

                <span className="category">
                  {campaign.category}
                </span>

                <h3>{campaign.title}</h3>

                <p>{campaign.description}</p>

                <div className="progress-info">
                  <strong>{campaign.raised}</strong>
                  <span>Goal: {campaign.goal}</span>
                </div>

                <div className="progress-bar">
                  <div
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>

                <button
                  type="button"
                  className="donate-btn"
                  onClick={() => {
                    if (
                      !isLoggedIn ||
                      !savedUser ||
                      currentRole === 'admin'
                    ) {
                      alert('Please login with a user account before donating.')
                      navigate('/login')
                    } else {
                      setSelectedCampaign(campaign)
                    }
                  }}
                >
                  Support Campaign →
                </button>

              </article>

            ))
          ) : (
            <p className="no-results">
              😕 No campaigns found. Try another search!
            </p>
          )}

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="steps-section">

        <span className="section-label">
          SIMPLE PROCESS
        </span>

        <h2>How FundHope Works</h2>

        <div className="steps-grid">

          <div className="step-card">
            <span>01</span>
            <h3>Create Account</h3>
            <p>Register yourself on the FundHope platform.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Explore Campaigns</h3>
            <p>Discover campaigns and causes that need support.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Make a Difference</h3>
            <p>Support campaigns and help people in need.</p>
          </div>

        </div>

      </section>


      {/* MODULE IDENTIFICATION */}

      <section className="modules-section" id="modules">

        <span className="section-label">
          PROJECT STRUCTURE
        </span>

        <h2>Module Identification</h2>

        <p className="section-description">
          FundHope is divided into different modules. Each module performs
          a specific function in the system.
        </p>

        <div className="modules-grid">

          {modules.map((module, index) => (
            <div className="module-card" key={index}>
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{module}</h3>
            </div>
          ))}

        </div>

      </section>


      {/* CONTACT SECTION */}

      <section className="contact-section" id="contact">

        <h2>Be the Reason Someone Smiles ❤️</h2>

        <p>
          Join FundHope and become a part of positive change.
        </p>

        <Link to="/signup" className="primary-btn">
          Join FundHope
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <a href="#home" className="brand">
          Fund<span>Hope</span> ❤️
        </a>

        <p>
          © 2026 FundHope. Together, We Make a Difference.
        </p>

      </footer>


      {/* DONATION POPUP */}

      {selectedCampaign && (

        <div className="donation-overlay">

          <div className="donation-modal">

            <button
              className="donation-close"
              onClick={() => {
                setSelectedCampaign(null)
                setDonationAmount('')
              }}
            >
              ×
            </button>

            <div className="donation-icon">
              {selectedCampaign.icon}
            </div>

            <h2>Support This Campaign</h2>

            <h3>{selectedCampaign.title}</h3>

            <p>Enter the amount you want to donate.</p>

            <label htmlFor="donationAmount">
              Donation Amount (₹)
            </label>

            <input
              id="donationAmount"
              type="number"
              min="1"
              placeholder="Enter amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />

            <button
              className="donation-submit"
              onClick={handleDonate}
            >
              Donate Now ❤️
            </button>

            <small>
              Demo only — no real payment will be made.
            </small>

          </div>

        </div>

      )}

    </div>
  )
}


// ROUTE PROTECTION

function ProtectedUserRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('isLoggedIn') === 'true'

  const role =
    localStorage.getItem('fundhopeCurrentRole')

  if (!isLoggedIn || role === 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}


function ProtectedAdminRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('isLoggedIn') === 'true'

  const role =
    localStorage.getItem('fundhopeCurrentRole')

  if (!isLoggedIn || role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}


// MAIN APP

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedUserRoute>
            <Dashboard />
          </ProtectedUserRoute>
        }
      />

      <Route
        path="/create-campaign"
        element={
          <ProtectedUserRoute>
            <CreateCampaign />
          </ProtectedUserRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App