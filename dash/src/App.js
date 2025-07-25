import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-brand">Dashboard</div>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#analytics">Analytics</a></li>
              <li><a href="#users">Users</a></li>
              <li><a href="#settings">Settings</a></li>
            </ul>
          </nav>
        </aside>
        
        <main className="main-content">
          <header className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <div className="user-menu">
              <span>Welcome, User!</span>
            </div>
          </header>
          
          <div className="dashboard-grid">
            <div className="metric-card">
              <h3>Total Users</h3>
              <div className="metric-value">1,234</div>
            </div>
            <div className="metric-card">
              <h3>Revenue</h3>
              <div className="metric-value">$12,345</div>
            </div>
            <div className="metric-card">
              <h3>Orders</h3>
              <div className="metric-value">567</div>
            </div>
            <div className="metric-card">
              <h3>Growth</h3>
              <div className="metric-value">+12%</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;