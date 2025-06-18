"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { getVaultContract } from '@/lib/vault';

interface WalletContextProps {
  address: string | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const addr = await signer.getAddress();
      setAddress(addr);
      setContract(getVaultContract(signer));
    } else {
      alert('MetaMask not found!');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setSigner(null);
    setAddress(null);
    setContract(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, signer, contract, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
} 