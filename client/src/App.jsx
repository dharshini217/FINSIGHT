import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, TrendingUp, PlusCircle, PieChart as PieIcon, LogOut, User as UserIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function App() {
  // Global State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(0);

  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });

  // Dashboard Form State
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/transactions');
      setTransactions(res.data.data);
      if (res.data.data.length > 1) {
        const aiRes = await axios.post('http://127.0.0.1:8000/forecast', res.data.data);
        setForecast(aiRes.data.next_month_estimate);
      }
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'login' : 'register';
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/auth/${url}`, authData);
      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      } else {
        alert("Registration Successful! Please Login.");
        setIsLogin(true);
      }
    } catch (err) { alert(err.response?.data?.message || "Auth Error"); }
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const onAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/transactions', { text, amount: +amount });
      setText(''); setAmount('');
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  const chartData = transactions.reduce((acc, curr) => {
    if (curr.amount < 0) {
      const cat = curr.category?.toUpperCase() || "GENERAL";
      const found = acc.find(i => i.name === cat);
      if (found) found.value += Math.abs(curr.amount);
      else acc.push({ name: cat, value: Math.abs(curr.amount) });
    }
    return acc;
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // --- VIEW 1: LOGIN / REGISTER SCREEN ---
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px' }}>
          <h2 style={{ textAlign: 'center', color: '#4f46e5' }}>{isLogin ? 'Welcome Back 💰' : 'Create Account 🚀'}</h2>
          <form onSubmit={handleAuth} style={{ marginTop: '20px' }}>
            {!isLogin && (
              <input type="text" placeholder="Full Name" onChange={e => setAuthData({...authData, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd' }} />
            )}
            <input type="email" placeholder="Email Address" onChange={e => setAuthData({...authData, email: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="Password" onChange={e => setAuthData({...authData, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd' }} />
            <button style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', marginTop: '15px', color: '#4f46e5', cursor: 'pointer' }}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD SCREEN ---
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>FinSight AI <small style={{color:'#64748b'}}>| Welcome, {user.name}</small></h2>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* AI Box */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px' }}>
        <h3>🔮 AI Predictive Insight</h3>
        <p style={{ fontSize: '1.2rem' }}>Hello {user.name}, the AI predicts a monthly spend of <b>${forecast}</b>.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Form */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{display:'flex', alignItems:'center', gap:'10px'}}><PlusCircle color="#4f46e5"/> New Entry</h3>
          <form onSubmit={onAddTransaction} style={{ marginTop: '20px' }}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you buy?" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount..." style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Transaction</button>
          </form>
        </div>

        {/* Chart */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3><PieIcon color="#4f46e5"/> Spending Breakdown</h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;