import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, TrendingUp, PlusCircle, PieChart as PieIcon, LogOut, User as UserIcon, Sun, Moon, History, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function App() {
  // Global State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/transactions`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTransactions(res.data.data);
      if (res.data.data.length > 1) {
        const aiRes = await axios.post(`${import.meta.env.VITE_ML_URL}/forecast`, res.data.data);
        setForecast(aiRes.data.next_month_estimate);
      }
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'login' : 'register';
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/${url}`, authData);
      if (isLogin) {
        const userData = { ...res.data.user, token: res.data.token };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/transactions`, 
        { text, amount: +amount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: darkMode ? '#0f172a' : '#f0f2f5', color: darkMode ? '#f8fafc' : '#0f172a' }}>
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: darkMode ? '#f8fafc' : '#0f172a' }}>
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
        <div style={{ background: darkMode ? '#1e293b' : '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px' }}>
          <h2 style={{ textAlign: 'center', color: '#4f46e5' }}>{isLogin ? 'Welcome Back 💰' : 'Create Account 🚀'}</h2>
          <form onSubmit={handleAuth} style={{ marginTop: '20px' }}>
            {!isLogin && (
              <input type="text" placeholder="Full Name" onChange={e => setAuthData({...authData, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000' }} />
            )}
            <input type="email" placeholder="Email Address" onChange={e => setAuthData({...authData, email: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000' }} />
            <input type="password" placeholder="Password" onChange={e => setAuthData({...authData, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000' }} />
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
    <div style={{ padding: '40px', fontFamily: 'system-ui', backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f8fafc' : '#0f172a', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>FinSight AI <small style={{color: darkMode ? '#94a3b8' : '#64748b'}}>| Welcome, {user.name}</small></h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: darkMode ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center' }}>
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={() => setShowHistory(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <History size={18} /> History
          </button>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* AI Box */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px' }}>
        <h3>🔮 AI Predictive Insight</h3>
        <p style={{ fontSize: '1.2rem' }}>Hello {user.name}, the AI predicts a monthly spend of <b>${forecast}</b>.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Form */}
        <div style={{ background: darkMode ? '#1e293b' : '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{display:'flex', alignItems:'center', gap:'10px'}}><PlusCircle color="#4f46e5"/> New Entry</h3>
          <form onSubmit={onAddTransaction} style={{ marginTop: '20px' }}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you buy?" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000' }} />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount..." style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000' }} />
            <button style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Transaction</button>
          </form>
        </div>

        {/* Chart */}
        <div style={{ background: darkMode ? '#1e293b' : '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{display:'flex', alignItems:'center', gap:'10px'}}><PieIcon color="#4f46e5"/> Spending Breakdown</h3>
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

      {/* History Modal */}
      {showHistory && (() => {
        const categories = ['All', ...new Set(transactions.map(t => t.category))];
        const filteredTransactions = selectedCategory === 'All' ? transactions : transactions.filter(t => t.category === selectedCategory);
        
        return (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div style={{ background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000', padding: '30px', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><History color="#4f46e5" /> Transaction History</h3>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#000', cursor: 'pointer' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => setShowHistory(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: darkMode ? '#fff' : '#000' }}><X size={24} /></button>
                </div>
              </div>
              {filteredTransactions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>No transactions found.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filteredTransactions.slice().reverse().map((t, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: darkMode ? '1px solid #334155' : '1px solid #eee' }}>
                      <div>
                        <strong>{t.text}</strong>
                        <div style={{ fontSize: '0.85rem', color: darkMode ? '#94a3b8' : '#64748b', marginTop: '4px' }}>{t.category} • {new Date(t.date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: t.amount < 0 ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center' }}>
                        {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default App;