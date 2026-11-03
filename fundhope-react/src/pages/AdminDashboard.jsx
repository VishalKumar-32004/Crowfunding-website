import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const getData = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
      return []
    }
  }

  const users = getData('fundhopeUsers')
  const oldUser = JSON.parse(
    localStorage.getItem('fundhopeUser') || 'null'
  )

  const allUsers = [
    ...users,
    ...(oldUser && !users.some(u => u.email === oldUser.email)
      ? [oldUser]
      : [])
  ]

  const campaigns = getData('fundhopeCampaignProgress').length
    ? getData('fundhopeCampaignProgress')
    : getData('fundhopeCampaigns')

  const donations = getData('fundhopeDonations')

  const totalDonations = donations.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  )

  const formatAmount = amount =>
    Number(amount || 0).toLocaleString('en-IN')

  const deleteCampaign = (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return
    }

    const updated = campaigns.filter(item => item.id !== id)

    localStorage.setItem(
      'fundhopeCampaignProgress',
      JSON.stringify(updated)
    )

    localStorage.setItem(
      'fundhopeCampaigns',
      JSON.stringify(
        getData('fundhopeCampaigns').filter(item => item.id !== id)
      )
    )

    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('fundhopeCurrentRole')
    navigate('/login')
  }

  const menu = [
    'Overview',
    'Users',
    'Campaigns',
    'Donations'
  ]

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <h2>❤️ FundHope</h2>
        <p className="admin-label">ADMIN PANEL</p>

        {menu.map(item => (
          <button
            key={item}
            className={activeTab === item ? 'admin-active' : ''}
            onClick={() => setActiveTab(item)}
          >
            {item === 'Overview' ? '▦' :
             item === 'Users' ? '♙' :
             item === 'Campaigns' ? '▣' : '₹'}
            &nbsp; {item}
          </button>
        ))}

        <button className="admin-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="admin-main">

        <header className="admin-header">
          <div>
            <span>FundHope / Admin</span>
            <h1>{activeTab}</h1>
          </div>
          <div className="admin-badge">Administrator</div>
        </header>

        {activeTab === 'Overview' && (
          <>
            <div className="admin-welcome">
              <h2>Welcome, Admin! 👋</h2>
              <p>Manage your FundHope platform from one place.</p>
            </div>

            <div className="admin-stats">
              <div>
                <span>Total Users</span>
                <h2>{allUsers.length}</h2>
              </div>

              <div>
                <span>Total Campaigns</span>
                <h2>{campaigns.length}</h2>
              </div>

              <div>
                <span>Total Donations</span>
                <h2>{donations.length}</h2>
              </div>

              <div>
                <span>Amount Donated</span>
                <h2>₹{formatAmount(totalDonations)}</h2>
              </div>
            </div>

            <section className="admin-panel">
              <h2>Recent Donations</h2>

              {donations.length === 0 ? (
                <p>No donations available.</p>
              ) : (
                donations.slice(-5).reverse().map((item, index) => (
                  <div className="admin-row" key={item.id || index}>
                    <div>
                      <strong>{item.userName}</strong>
                      <p>{item.campaignTitle}</p>
                    </div>
                    <strong>₹{formatAmount(item.amount)}</strong>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {activeTab === 'Users' && (
          <section className="admin-panel">
            <h2>Registered Users ({allUsers.length})</h2>

            {allUsers.length === 0 ? (
              <p>No registered users found.</p>
            ) : (
              allUsers.map((user, index) => (
                <div className="admin-row" key={user.email || index}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <span className="admin-user-tag">User</span>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'Campaigns' && (
          <section className="admin-panel">
            <h2>All Campaigns ({campaigns.length})</h2>

            {campaigns.length === 0 ? (
              <p>No campaigns available.</p>
            ) : (
              campaigns.map((item, index) => (
                <div className="admin-row" key={item.id || index}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.category}</p>
                    <small>
                      Raised: ₹{formatAmount(item.raised)} /
                      ₹{formatAmount(item.goal)}
                    </small>
                  </div>

                  <button
                    className="admin-delete"
                    onClick={() => deleteCampaign(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'Donations' && (
          <section className="admin-panel">
            <h2>All Donations ({donations.length})</h2>

            <h3>Total: ₹{formatAmount(totalDonations)}</h3>

            {donations.map((item, index) => (
              <div className="admin-row" key={item.id || index}>
                <div>
                  <strong>{item.userName}</strong>
                  <p>{item.campaignTitle}</p>
                  <small>{item.date}</small>
                </div>

                <strong>₹{formatAmount(item.amount)}</strong>
              </div>
            ))}
          </section>
        )}

      </main>
    </div>
  )
}

export default AdminDashboard