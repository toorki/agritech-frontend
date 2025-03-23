import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function SponsorForm({ token }) {
  const [sponsorData, setSponsorData] = useState({
    sponsor_name: '', sponsor_phone: '', farmer_name: '', amount: '', crop: '', quantity: ''
  });
  const handleChange = (e) => {
    setSponsorData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://agritech-backend.onrender.com/api/sponsorship/sponsor/', sponsorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', response.data);
      alert('Sponsorship created!');
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      alert('Failed to process request.');
    }
  };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">Create Sponsorship</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" name="sponsor_name" placeholder="Sponsor Name" value={sponsorData.sponsor_name} onChange={handleChange} />
        </div>
        {/* Repeat for other fields */}
        <button type="submit" className="btn btn-primary w-100">Create Sponsorship</button>
      </form>
    </div>
  );
}

function ProduceForm({ token }) {
  const [produceData, setProduceData] = useState({
    farmer_name: '', farmer_phone: '', crop: '', quantity: '', price_per_kg: ''
  });
  const handleChange = (e) => {
    setProduceData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://agritech-backend.onrender.com/api/marketplace/list/', produceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', response.data);
      alert('Produce listed!');
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      alert('Failed to process request.');
    }
  };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">List Produce</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" name="farmer_name" placeholder="Farmer Name" value={produceData.farmer_name} onChange={handleChange} />
        </div>
        {/* Repeat for other fields */}
        <button type="submit" className="btn btn-primary w-100">List Produce</button>
      </form>
    </div>
  );
}

function BuyForm({ token }) {
  const [buyData, setBuyData] = useState({
    produce_id: '', buyer_name: '', buyer_phone: ''
  });
  const handleChange = (e) => {
    setBuyData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://agritech-backend.onrender.com/api/marketplace/buy/', buyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', response.data);
      alert('Purchase completed!');
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      alert('Failed to process request.');
    }
  };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">Buy Produce</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" name="produce_id" type="number" placeholder="Produce ID" value={buyData.produce_id} onChange={handleChange} />
        </div>
        {/* Repeat for other fields */}
        <button type="submit" className="btn btn-primary w-100">Buy Produce</button>
      </form>
    </div>
  );
}

function LoginForm({ setToken }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://agritech-backend.onrender.com/api/token/', credentials);
      setToken(response.data.access);
      console.log('Token set:', response.data.access);
      localStorage.setItem('token', response.data.access); // Store token
      alert('Logged in!');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      alert('Login failed.');
    }
  };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="card-title text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input className="form-control" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <input className="form-control" name="password" type="password" placeholder="Password" value={credentials.password} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

function AllProduce({ token }) {
  const [produceList, setProduceList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const response = await axios.get('https://agritech-backend.onrender.com/api/marketplace/all/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduceList(response.data);
      } catch (err) {
        setError('Failed to fetch produce.');
        console.error('Error:', err.response?.data || err);
      }
    };
    if (token) fetchProduce();
  }, [token]);

  console.log('AllProduce token:', token);
  if (!token) return <p className="text-center">Please log in to see produce.</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '800px' }}>
      <h2 className="card-title text-center mb-4">Available Produce</h2>
      {produceList.length === 0 ? (
        <p className="text-center">No produce available.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Farmer</th>
              <th>Crop</th>
              <th>Quantity</th>
              <th>Price/kg</th>
            </tr>
          </thead>
          <tbody>
            {produceList.map(produce => (
              <tr key={produce.id}>
                <td>{produce.id}</td>
                <td>{produce.farmer.name}</td>
                <td>{produce.crop}</td>
                <td>{produce.quantity}</td>
                <td>{produce.price_per_kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); // Load from storage
  console.log('App token:', token);
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Clear token
  };
  return (
    <Router>
      <div className="App container">
        <h1 className="my-4">AgriTech Prototype</h1>
        <p>{token ? "Logged in" : "Not logged in"}</p>
        <nav className="nav nav-pills mb-3">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/sponsor">Sponsor</Link>
          <Link className="nav-link" to="/list">List Produce</Link>
          <Link className="nav-link" to="/buy">Buy Produce</Link>
          <Link className="nav-link" to="/all">All Produce</Link>
          {token && <button className="btn btn-link nav-link" onClick={logout}>Logout</button>}
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/sponsor" element={<SponsorForm token={token} />} />
          <Route path="/list" element={<ProduceForm token={token} />} />
          <Route path="/buy" element={<BuyForm token={token} />} />
          <Route path="/all" element={<AllProduce token={token} />} />
          <Route path="/" element={<h2 className="text-center">Welcome! Please login.</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;