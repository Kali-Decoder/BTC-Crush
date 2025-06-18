"use client"
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getVaultContract, VAULT_ADDRESS } from '@/lib/vault';

// Add this at the top of the file for TypeScript support
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useVaultContract() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Connect wallet (MetaMask)
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      const signer = await browserProvider.getSigner();
      setSigner(signer);
      setAddress(await signer.getAddress());
      setContract(getVaultContract(signer));
    } else {
      alert('MetaMask not found!');
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setSigner(null);
    setAddress(null);
    setContract(null);
    // Optionally clear provider, but keep for read-only
  }, []);

  // Read-only contract for public data
  useEffect(() => {
    if (!provider && typeof window !== 'undefined' && window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      setContract(getVaultContract(browserProvider));
    }
  }, [provider]);

  // Deposit to vault
  const deposit = useCallback(async (vaultId: number, amount: ethers.BigNumberish) => {
    if (!contract || !signer) throw new Error('Wallet not connected');
    const tx = await contract.deposit(vaultId, amount);
    return tx.wait();
  }, [contract, signer]);

  // Redeem from vault
  const redeem = useCallback(async (vaultId: number, shareAmount: ethers.BigNumberish) => {
    if (!contract || !signer) throw new Error('Wallet not connected');
    const tx = await contract.redeem(vaultId, shareAmount);
    return tx.wait();
  }, [contract, signer]);

  // Read user deposit for a vault
  const getDepositOf = useCallback(async (vaultId: number) => {
    if (!contract || !address) return ethers.ZeroAddress;
    return contract.depositOf(vaultId);
  }, [contract, address]);

  // Read user share amount for a vault
  const getSharesAmount = useCallback(async (vaultId: number) => {
    if (!contract || !address) return ethers.ZeroAddress;
    return contract.sharesAmount(vaultId, address);
  }, [contract, address]);

  // Read vault config
  const getVaultConfig = useCallback(async (vaultId: number) => {
    if (!contract) return null;
    return contract.vaults(vaultId);
  }, [contract]);

  return {
    connectWallet,
    disconnectWallet,
    address,
    contract,
    deposit,
    redeem,
    getDepositOf,
    getSharesAmount,
    getVaultConfig,
    provider,
    signer,
  };
} 