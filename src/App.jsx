import React, { useState } from 'react';
import './App.css';
import { useApp } from './context/AppContext';
import DeployPage from './pages/DeployPage';
import WalletsPage from './pages/WalletsPage';
import TradingPage from './pages/TradingPage';
import ConsolePage from './pages/ConsolePage';

function App() {
  const [activeTab, setActiveTab] = useState('deploy');
  const { network, setNetwork } = useApp();

  return (
    <div className="app">
      <div className="bg-grid"></div>
      
      <div className="container">
        <header className="header">
          <h1>
            <span className="neon-cyan">NEXUS</span>
            <br />
            <span className="neon-violet">LAUNCHPAD</span>
          </h1>
          <p className="subtitle">COMPLETE TOKEN DEPLOYMENT SYSTEM</p>
          
          <div className="network-selector">
            <label>Network:</label>
            <select 
              value={network} 
              onChange={(e) => setNetwork(e.target.value)}
              className={network === 'mainnet' ? 'mainnet' : ''}
            >
              <option value="devnet">Devnet (Test)</option>
              <option value="mainnet">Mainnet (Production)</option>
            </select>
            {network === 'mainnet' && (
              <span className="mainnet-warning">⚠️ Live Network</span>
            )}
          </div>
        </header>

        <nav className="tabs">
          {['deploy', 'wallets', 'trading', 'console'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <main className="content">
          {activeTab === 'deploy' && <DeployPage />}
          {activeTab === 'wallets' && <WalletsPage />}
          {activeTab === 'trading' && <TradingPage />}
          {activeTab === 'console' && <ConsolePage />}
        </main>
      </div>
    </div>
  );
}

export default App;