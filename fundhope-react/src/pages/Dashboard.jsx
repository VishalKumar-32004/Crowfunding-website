import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

const defaultCampaigns = [
  {
    id: 'education',
    title: 'Help Children Get Education',
    category: 'Education',
    description: 'Support children who need financial help to continue their education.',
    goal: 100000,
    raised: 65000,
  },
  {
    id: 'medical',
    title: 'Medical Support for Families',
    category: 'Medical',
    description: 'Help families who need support for essential medical treatment.',
    goal: 200000,
    raised: 120000,
  },
  {
    id: 'food',
    title: 'Food for Needy People',
    category: 'Food',
    description: 'Provide food and basic necessities to people in need.',
    goal: 50000,
    raised: 35000,
  },
]

function Dashboard() {
  const navigate = useNavigate()

  const savedUser = JSON.parse(
    localStorage.getItem('fundhopeUser') || 'null'
  )

  const [activeTab, setActiveTab] = useState('Dashboard')

  const [campaigns, setCampaigns] = useState(() => {
    const savedProgress = JSON.parse(
      localStorage.getItem('fundhopeCampaignProgress') || 'null'
    )

    const userCampaigns = JSON.parse(
      localStorage.getItem('fundhopeCampaigns') || '[]'
    ).map((item, index) => ({
      ...item,
      id: item.id || `user-${index}-${item.title}`,
      goal: Number(item.goal) || 0,
      raised: Number(item.raised) || 0,
    }))

    if (savedProgress) {
      const combined = [...savedProgress]

      userCampaigns.forEach(item => {
        if (!combined.some(c => c.id === item.id)) {
          combined.push(item)
        }
      })

      return combined
    }

    return [...defaultCampaigns, ...userCampaigns]
  })

  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('fundhopeFavorites') || '[]')
  )

  const donations = JSON.parse(
    localStorage.getItem('fundhopeDonations') || '[]'
  )

  const userEmail = savedUser?.email || ''

  const myCampaigns = campaigns.filter(
    item => item.ownerEmail === userEmail
  )

  const myDonations = donations.filter(
    item => item.userEmail === userEmail
  )

  const favoriteCampaigns = campaigns.filter(
    item => favorites.includes(item.title)
  )

  const totalDonated = myDonations.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  )

  const formatAmount = amount =>
    Number(amount || 0).toLocaleString('en-IN')

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false')
    navigate('/login')
  }

  const deleteCampaign = id => {
    const updated = campaigns.filter(item => item.id !== id)

    setCampaigns(updated)

    localStorage.setItem(
      'fundhopeCampaignProgress',
      JSON.stringify(updated)
    )

    const updatedUserCampaigns = JSON.parse(
      localStorage.getItem('fundhopeCampaigns') || '[]'
    ).filter(item => item.id !== id)

    localStorage.setItem(
      'fundhopeCampaigns',
      JSON.stringify(updatedUserCampaigns)
    )
  }

  const toggleFavorite = title => {
    const updated = favorites.includes(title)
      ? favorites.filter(item => item !== title)
      : [...favorites, title]

    setFavorites(updated)

    localStorage.setItem(
      'fundhopeFavorites',
      JSON.stringify(updated)
    )
  }

  const menuItems = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Explore Campaigns', icon: '◈' },
    { name: 'My Donations', icon: '♡' },
    { name: 'My Campaigns', icon: '▣' },
    { name: 'Favourites', icon: '★' },
    { name: 'Profile', icon: '♙' },
  ]

  const renderDashboard = () => (
    <>
      <div className="welcome-banner">
        <div>
          <span className="welcome-tag">FUNDHOPE COMMUNITY</span>

          <h1>Welcome back, {savedUser?.name || 'User'}!</h1>

          <p>
            Together, we can make a difference.
            Continue your journey of helping others.
          </p>

          <button
            className="banner-button"
            onClick={() => navigate('/create-campaign')}
          >
            + Start a Campaign
          </button>
        </div>

        <div className="banner-art">💜</div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Overview</h2>
          <p>Here is what's happening with your account.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card purple">
          <div className="stat-icon">▣</div>
          <p>My Campaigns</p>
          <h2>{myCampaigns.length}</h2>
          <span>Your created campaigns</span>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">₹</div>
          <p>Total Donated</p>
          <h2>₹{formatAmount(totalDonated)}</h2>
          <span>Your contribution</span>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">♡</div>
          <p>My Donations</p>
          <h2>{myDonations.length}</h2>
          <span>Donation transactions</span>
        </div>

        <div className="stat-card pink">
          <div className="stat-icon">★</div>
          <p>Favourites</p>
          <h2>{favorites.length}</h2>
          <span>Saved campaigns</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Donations</h2>
              <p>Your latest contribution activity</p>
            </div>

            <button onClick={() => setActiveTab('My Donations')}>
              View All →
            </button>
          </div>

          {myDonations.length === 0 ? (
            <div className="empty-message">
              <span>💜</span>
              <h3>No donations yet</h3>
              <p>Your donation activity will appear here.</p>
            </div>
          ) : (
            myDonations.slice(-5).reverse().map((item, index) => (
              <div className="recent-item" key={item.id || index}>
                <div className="recent-icon">♡</div>

                <div className="recent-details">
                  <h4>{item.campaignTitle}</h4>
                  <span>{item.date}</span>
                </div>

                <strong>₹{formatAmount(item.amount)}</strong>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-panel impact-panel">
          <div className="impact-icon">🌍</div>
          <h2>Make an Impact</h2>

          <p>
            Every small contribution can create a big change.
            Discover campaigns and support people in need.
          </p>

          <button onClick={() => setActiveTab('Explore Campaigns')}>
            Explore Campaigns →
          </button>
        </div>
      </div>

      <div className="dashboard-panel campaign-preview">
        <div className="panel-heading">
          <div>
            <h2>My Campaigns</h2>
            <p>Manage your fundraising campaigns</p>
          </div>

          <button onClick={() => setActiveTab('My Campaigns')}>
            View All →
          </button>
        </div>

        {myCampaigns.length === 0 ? (
          <div className="empty-message">
            <span>📢</span>
            <h3>Start your first campaign</h3>
            <p>Create a campaign and make a positive difference.</p>
          </div>
        ) : (
          <div className="campaign-list">
            {myCampaigns.slice(0, 3).map(item => (
              <div className="dashboard-campaign-card" key={item.id}>
                <span className="campaign-category">
                  {item.category}
                </span>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="campaign-amounts">
                  <span>Raised ₹{formatAmount(item.raised)}</span>
                  <span>Goal ₹{formatAmount(item.goal)}</span>
                </div>

                <div className="progress-container">
                  <div
                    className="dashboard-progress-bar"
                    style={{
                      width: `${item.goal
                        ? Math.min(
                            Number(item.raised || 0) /
                            Number(item.goal) * 100,
                            100
                          )
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const renderCampaigns = (list, showDelete = false) => (
    <div className="campaign-list">
      {list.map(item => (
        <div className="dashboard-campaign-card" key={item.id}>
          <span className="campaign-category">
            {item.category}
          </span>

          <button
            className="favorite-btn"
            onClick={() => toggleFavorite(item.title)}
          >
            {favorites.includes(item.title) ? '❤️' : '🤍'}
          </button>

          <h3>{item.title}</h3>
          <p>{item.description}</p>

          <div className="campaign-amounts">
            <span>Raised ₹{formatAmount(item.raised)}</span>
            <span>Goal ₹{formatAmount(item.goal)}</span>
          </div>

          <div className="progress-container">
            <div
              className="dashboard-progress-bar"
              style={{
                width: `${item.goal
                  ? Math.min(
                      Number(item.raised || 0) /
                      Number(item.goal) * 100,
                      100
                    )
                  : 0}%`,
              }}
            />
          </div>

          {showDelete && (
            <button
              className="delete-button"
              onClick={() => deleteCampaign(item.id)}
            >
              Delete Campaign
            </button>
          )}
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'My Campaigns':
        return (
          <>
            <div className="page-heading">
              <h1>My Campaigns</h1>
              <p>Manage your fundraising campaigns.</p>

              <button
                className="main-button"
                onClick={() => navigate('/create-campaign')}
              >
                + Create Campaign
              </button>
            </div>

            {myCampaigns.length === 0 ? (
              <div className="dashboard-panel empty-message">
                <span>📢</span>
                <h3>No campaigns created</h3>
                <p>Create your first campaign to get started.</p>
              </div>
            ) : renderCampaigns(myCampaigns, true)}
          </>
        )

      case 'Explore Campaigns':
        return (
          <>
            <div className="page-heading">
              <h1>Explore Campaigns</h1>
              <p>Discover causes and support people in need.</p>
            </div>

            {renderCampaigns(campaigns)}
          </>
        )

      case 'My Donations':
        return (
          <>
            <div className="page-heading">
              <h1>My Donations</h1>
              <p>Your complete donation history.</p>
            </div>

            <div className="dashboard-panel">
              <h2>Total Donated: ₹{formatAmount(totalDonated)}</h2>

              {myDonations.length === 0 ? (
                <div className="empty-message">
                  <span>💜</span>
                  <h3>No donations yet</h3>
                </div>
              ) : (
                myDonations.slice().reverse().map((item, index) => (
                  <div className="recent-item" key={item.id || index}>
                    <div className="recent-icon">♡</div>

                    <div className="recent-details">
                      <h4>{item.campaignTitle}</h4>
                      <span>{item.date}</span>
                    </div>

                    <strong>₹{formatAmount(item.amount)}</strong>
                  </div>
                ))
              )}
            </div>
          </>
        )

      case 'Favourites':
        return (
          <>
            <div className="page-heading">
              <h1>My Favourites</h1>
              <p>Campaigns you have saved.</p>
            </div>

            {favoriteCampaigns.length === 0 ? (
              <div className="dashboard-panel empty-message">
                <span>★</span>
                <h3>No favourites yet</h3>
                <p>
                  Go to Explore Campaigns and save your favourite campaigns.
                </p>
              </div>
            ) : (
              renderCampaigns(favoriteCampaigns)
            )}
          </>
        )

      case 'Profile':
        return (
          <>
            <div className="page-heading">
              <h1>My Profile</h1>
              <p>Manage your account information.</p>
            </div>

            <div className="dashboard-panel profile-card">
              <div className="profile-avatar">
                {(savedUser?.name || 'U').charAt(0).toUpperCase()}
              </div>

              <h2>{savedUser?.name || 'User'}</h2>
              <p>{savedUser?.email || 'Email unavailable'}</p>

              <div className="profile-info">
                <div>
                  <span>Full Name</span>
                  <strong>{savedUser?.name || 'User'}</strong>
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{savedUser?.email || 'Not available'}</strong>
                </div>

                <div>
                  <span>Account Type</span>
                  <strong>FundHope Member</strong>
                </div>
              </div>
            </div>
          </>
        )

      default:
        return renderDashboard()
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="brand">
          <div className="brand-logo">F</div>
          <h2>FundHope</h2>
        </div>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {(savedUser?.name || 'U').charAt(0).toUpperCase()}
          </div>

          <div>
            <h4>{savedUser?.name || 'User'}</h4>
            <span>Member Account</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {menuItems.map(item => (
            <button
              key={item.name}
              className={`sidebar-link ${
                activeTab === item.name ? 'active' : ''
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}

              {item.name === 'Favourites' && (
                <span className="favorite-badge">
                  {favorites.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link">
            <span className="menu-icon">⌂</span>
            Back to Home
          </Link>

          <button
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <span className="menu-icon">↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span>FundHope / {activeTab}</span>
            <h2>{activeTab}</h2>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              {(savedUser?.name || 'U').charAt(0).toUpperCase()}
            </div>

            <span>{savedUser?.name || 'User'}</span>
          </div>
        </header>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default Dashboard