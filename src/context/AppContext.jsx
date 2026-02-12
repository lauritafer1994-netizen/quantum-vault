import React, { createContext, useContext, useState } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Network connection
  const [network, setNetwork] = useState('devnet');
  const connection = new Connection(clusterApiUrl(network), 'confirmed');

  // Wallets
  const [wallets, setWallets] = useState([]);
  
  // Current token being traded
  const [deployedToken, setDeployedToken] = useState(null);
  
  // Console logs
  const [logs, setLogs] = useState([
    { msg: 'System initialized', type: 'success', time: new Date().toLocaleTimeString() }
  ]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const value = {
    network,
    setNetwork,
    connection,
    wallets,
    setWallets,
    deployedToken,
    setDeployedToken,
    logs,
    addLog
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}