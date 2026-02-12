import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export default function WalletsPage() {
  const { wallets, setWallets, addLog } = useApp();
  const [importKey, setImportKey] = useState('');
  const [showSecret, setShowSecret] = useState({});

  const createWallet = () => {
    try {
      const keypair = Keypair.generate();
      const wallet = {
        name: `Wallet ${wallets.length + 1}`,
        publicKey: keypair.publicKey.toString(),
        keypair: keypair
      };
      
      setWallets([...wallets, wallet]);
      addLog(`Created wallet: ${wallet.publicKey.slice(0, 20)}...`, 'success');
    } catch (err) {
      addLog(`Error creating wallet: ${err.message}`, 'error');
    }
  };

  const importWallet = () => {
    try {
      let secretKey;
      
      // Try Base58
      try {
        secretKey = bs58.decode(importKey);
      } catch {
        // Try JSON array
        secretKey = new Uint8Array(JSON.parse(importKey));
      }
      
      const keypair = Keypair.fromSecretKey(secretKey);
      const wallet = {
        name: `Imported ${wallets.length + 1}`,
        publicKey: keypair.publicKey.toString(),
        keypair: keypair
      };
      
      setWallets([...wallets, wallet]);
      setImportKey('');
      addLog(`Imported wallet: ${wallet.publicKey.slice(0, 20)}...`, 'success');
    } catch (err) {
      addLog(`Import failed: ${err.message}`, 'error');
      alert('Invalid private key format');
    }
  };

  const exportWallet = (index) => {
    const wallet = wallets[index];
    const secret = Array.from(wallet.keypair.secretKey);
    const base58 = bs58.encode(wallet.keypair.secretKey);
    
    alert(`Wallet: ${wallet.publicKey}\n\nPrivate Key (Base58):\n${base58}\n\nJSON Array:\n${JSON.stringify(secret)}`);
  };

  const toggleSecret = (index) => {
    setShowSecret({ ...showSecret, [index]: !showSecret[index] });
  };

  return (
    <div>
      <div className="glass-panel">
        <div className="section-label">// CREATE NEW WALLET</div>
        <button className="btn-primary" onClick={createWallet}>
          Generate New Wallet
        </button>
      </div>

      <div className="glass-panel">
        <div className="section-label">// IMPORT WALLET</div>
        <label>Private Key (Base58 or JSON)</label>
        <textarea
          value={importKey}
          onChange={e => setImportKey(e.target.value)}
          placeholder="Enter private key..."
          style={{ minHeight: '80px', marginBottom: '16px' }}
        />
        <button className="btn-secondary" onClick={importWallet}>
          Import Wallet
        </button>
      </div>

      <div className="glass-panel">
        <div className="section-label">// MANAGED WALLETS ({wallets.length})</div>
        
        {wallets.length === 0 ? (
          <p style={{ color: '#0099cc', fontSize: '12px' }}>No wallets yet. Create or import one above.</p>
        ) : (
          wallets.map((wallet, index) => (
            <div key={index} className="wallet-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{wallet.name}</strong>
                <div>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '10px', marginRight: '8px' }}
                    onClick={() => toggleSecret(index)}
                  >
                    {showSecret[index] ? 'Hide' : 'Show'} Key
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '10px' }}
                    onClick={() => exportWallet(index)}
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="wallet-address">{wallet.publicKey}</div>
              
              {showSecret[index] && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  background: 'rgba(255, 170, 0, 0.1)', 
                  border: '1px solid rgba(255, 170, 0, 0.3)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  wordBreak: 'break-all',
                  color: '#ffaa00'
                }}>
                  <strong>SECRET KEY (NEVER SHARE):</strong><br/>
                  {bs58.encode(wallet.keypair.secretKey)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}