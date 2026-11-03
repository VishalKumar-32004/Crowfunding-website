import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function CreateCampaign() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Education')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const savedUser = JSON.parse(
      localStorage.getItem('fundhopeUser') || 'null'
    )

    const campaigns = JSON.parse(
      localStorage.getItem('fundhopeCampaigns') || '[]'
    )

    const newCampaign = {
      id: Date.now(),
      title,
      category,
      description,
      goal: Number(goal),
      raised: 0,
      ownerName: savedUser?.name || 'User',
      ownerEmail: savedUser?.email || '',
      createdAt: new Date().toLocaleDateString()
    }

    localStorage.setItem(
      'fundhopeCampaigns',
      JSON.stringify([...campaigns, newCampaign])
    )

    alert('Campaign created successfully!')

    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    marginBottom: '18px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fb',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '650px',
        margin: 'auto',
        background: 'white',
        padding: '35px',
        borderRadius: '15px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
      }}>

        <Link to="/dashboard" style={{
          color: '#555',
          textDecoration: 'none'
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ color: '#222', marginTop: '25px' }}>
          Create a Campaign
        </h1>

        <p style={{ color: '#777', marginBottom: '25px' }}>
          Start your fundraising campaign and make a difference.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Campaign Title</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Category</label>
          <select
            style={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Education</option>
            <option>Medical</option>
            <option>Food</option>
            <option>Environment</option>
            <option>Animal Welfare</option>
            <option>Other</option>
          </select>

          <label>Campaign Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: '120px' }}
            placeholder="Explain why you need support..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Fundraising Goal (₹)</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="Enter your target amount"
            min="1"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#635bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Campaign
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateCampaign