import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { deployToken } from '../utils/solana';

export default function DeployPage() {
  const { wallets, connection, network, addLog, setDeployedToken } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    decimals: '9',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (wallets.length === 0) {
      alert('Please create a wallet first in the Wallets tab!');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const result = await deployToken({
        ...formData,
        wallet: wallets[0],
        connection,
        network,
        onLog: addLog
      });
      
      setResult(result);
      setDeployedToken(result);
      addLog(`Token deployed: ${result.mint}`, 'success');
    } catch (err) {
      addLog(`Deployment failed: ${err.message}`, 'error');
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="glass-panel">
        <div className="section-label">// TOKEN PARAMETERS</div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div>
              <label>Token Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="My Token"
                maxLength="32"
                required
              />
            </div>
            <div>
              <label>Symbol *</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                placeholder="TKN"
                maxLength="10"
                required
              />
            </div>
          </div>

          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Token description..."
            maxLength="200"
            style={{ minHeight: '80px', marginBottom: '16px' }}
          />

          <label>Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
            placeholder="https://..."
            style={{ marginBottom: '16px' }}
          />

          <div className="grid-2">
            <div>
              <label>Total Supply *</label>
              <input
                type="number"
                value={formData.supply}
                onChange={e => setFormData({...formData, supply: e.target.value})}
                placeholder="1000000"
                min="1"
                required
              />
            </div>
            <div>
              <label>Decimals</label>
              <select
                value={formData.decimals}
                onChange={e => setFormData({...formData, decimals: e.target.value})}
              >
                <option value="6">6 (Standard)</option>
                <option value="9">9 (SOL-like)</option>
                <option value="18">18 (ETH-like)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '24px' }}
          >
            {loading ? <><span className="spinner"></span>Deploying...</> : 'Deploy Token'}
          </button>
        </form>

        {result && !result.error && (
          <div className="success-box">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Token Deployed!</div>
            <div style={{ fontSize: '11px', marginBottom: '4px' }}>
              <strong>{formData.name}</strong> (${formData.symbol})
            </div>
            <div style={{ fontSize: '10px', color: '#0099cc', marginBottom: '8px' }}>
              Supply: {formData.supply}
            </div>
            <a 
              href={`https://explorer.solana.com/address/${result.mint}?cluster=${network}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on Explorer →
            </a>
            <div style={{ marginTop: '8px', fontSize: '10px', wordBreak: 'break-all', color: '#00ff88' }}>
              Mint: {result.mint}
            </div>
          </div>
        )}

        {result?.error && (
          <div className="error-box">
            <strong>Deployment Failed</strong><br/>
            {result.error}
          </div>
        )}
      </div>
    </div>
  );
}