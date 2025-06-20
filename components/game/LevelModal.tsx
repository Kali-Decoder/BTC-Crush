'use client';

import React, { useState } from 'react';
import { Level } from '@/types/level';
import { ethers } from 'ethers';
import { useWallet } from '@/components/WalletProvider';
import { getFBTCToken, VAULT_ADDRESS } from '@/lib/vault';

interface LevelModalProps {
  selectedLevel: Level | null;
  onClose?: () => void;
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function LevelModal({ selectedLevel, onClose }: LevelModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<ethers.BigNumberish>(0);
  const [fbtcBalance, setFbtcBalance] = useState<ethers.BigNumberish>(0);

  const { address, contract, connectWallet, signer } = useWallet();

  // Timer update
  React.useEffect(() => {
    if (!selectedLevel) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [selectedLevel]);

  // Blockchain state
  const [userDeposit, setUserDeposit] = useState<ethers.BigNumberish>(0);
  const [userShares, setUserShares] = useState<ethers.BigNumberish>(0);
  const [vaultLoading, setVaultLoading] = useState(false);

  React.useEffect(() => {
    async function fetchData() {
      if (!selectedLevel || !address || !contract) return;
      setVaultLoading(true);
      try {
        const [deposit, shares] = await Promise.all([
          contract.depositOf(selectedLevel.id),
          contract.sharesAmount(selectedLevel.id, address),
        ]);
        setUserDeposit(deposit);
        setUserShares(shares);
      } catch (e) {
        // ignore for now
      }
      setVaultLoading(false);
    }
    fetchData();
  }, [selectedLevel, address, contract, success, redeemSuccess]);

  // Fetch fBTC allowance and balance
  React.useEffect(() => {
    async function fetchTokenData() {
      if (!address || !signer) return;
      try {
        const fbtcContract = getFBTCToken(signer);
        const [allowanceAmount, balance] = await Promise.all([
          fbtcContract.allowance(address, VAULT_ADDRESS),
          fbtcContract.balanceOf(address),
        ]);
        setAllowance(allowanceAmount);
        setFbtcBalance(balance);
      } catch (e) {
        // ignore for now
      }
    }
    fetchTokenData();
  }, [address, signer, approvalSuccess]);

  if (!selectedLevel) return null;

  const { id, interestRate, lockPeriod } = selectedLevel;
  const parsedAmount = parseFloat(amount) || 0;
  const yieldAmount = ((parsedAmount * (interestRate / 100)) * (lockPeriod / 365)).toFixed(4);

  const userSharesBigInt = typeof userShares === 'bigint' ? userShares : BigInt(userShares?.toString?.() || '0');
  const amountBigInt = ethers.parseUnits(amount || '0', 18);
  const allowanceBigInt = typeof allowance === 'bigint' ? allowance : BigInt(allowance?.toString?.() || '0');
  const needsApproval = amountBigInt > allowanceBigInt;

  // Debug logs
  console.log('amountBigInt:', amountBigInt.toString());
  console.log('allowanceBigInt:', allowanceBigInt.toString());
  console.log('needsApproval:', needsApproval);

  const handleApprove = async () => {
    if (!address || !signer) return;
    setApprovalLoading(true);
    setApprovalError(null);
    setApprovalSuccess(null);
    try {
      const fbtcContract = getFBTCToken(signer);
      console.log('approving', VAULT_ADDRESS);
      console.log('fbtcContract', fbtcContract);
      console.log('address', address);
      console.log('signer', signer);
      const tx = await fbtcContract.approve(VAULT_ADDRESS, ethers.MaxUint256);
      await tx.wait();
      setApprovalSuccess('Approval successful!');
      
     
    } catch (e: any) {
      setApprovalError(e.message || 'Approval failed');
    }
    setApprovalLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl relative max-w-sm w-full border-4 border-yellow-200 animate-pop">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-200 hover:bg-pink-300 flex items-center justify-center text-pink-700 text-xl font-bold shadow-md transition"
          onClick={onClose}
        >
          ×
        </button>
        <div className="text-center">
          {/* Cute Level Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg border-4 border-pink-200 animate-bounce-slow">
            <span className="text-white font-bold text-3xl drop-shadow">{id}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-pink-600 mb-1">Level {id}</h2>
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold shadow">{interestRate}% APR</span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold shadow">{lockPeriod} days</span>
          </div>
          <p className="text-gray-600 mb-6 text-sm">Lock your fBTC to earn sweet rewards! 🍬</p>

          {/* Wallet connect */}
          {!address ? (
            <button
              className="mb-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-pink-400 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-transform animate-candy"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <div className="mb-4 text-xs text-gray-500">Connected: {address.slice(0, 6)}...{address.slice(-4)}</div>
          )}

          {/* Loading vault state */}
          {vaultLoading && <div className="mb-4 text-pink-500">Loading vault info...</div>}

          {/* Deposit form */}
          {address && !vaultLoading && (
            <>
              {userSharesBigInt > 0n ? (
                // Redeem UI
                <form
                  className="flex flex-col items-center gap-4"
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!contract) return;
                    setRedeemLoading(true);
                    setRedeemError(null);
                    setRedeemSuccess(null);
                    try {
                      await contract.redeem(id, userSharesBigInt);
                      setRedeemSuccess('Redeemed successfully!');
                    } catch (e: any) {
                      setRedeemError(e.message || 'Redeem failed');
                    }
                    setRedeemLoading(false);
                  }}
                >
                  <div className="text-lg font-bold text-pink-500">You have {ethers.formatUnits(userSharesBigInt, 18)} shares</div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-yellow-400 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-candy"
                    disabled={redeemLoading || !contract}
                  >
                    {redeemLoading ? 'Redeeming...' : '🎁 Redeem Now!'}
                  </button>
                  {redeemSuccess && <div className="text-green-600 text-sm mt-2">{redeemSuccess}</div>}
                  {redeemError && <div className="text-red-600 text-sm mt-2">{redeemError}</div>}
                </form>
              ) : (
                // Lock form
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter fBTC amount"
                    className="w-full px-4 py-2 rounded-xl border-2 border-yellow-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none text-lg text-center bg-yellow-50 shadow-inner"
                    required
                  />
                  <div className="text-xs text-gray-500 mb-2">Expected yield: <span className="font-bold text-green-600">{yieldAmount} fBTC</span></div>
                  
                  {/* Approval button */}
                  {needsApproval && amount && (
                    <button
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-red-400 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-candy"
                      onClick={handleApprove}
                      disabled={approvalLoading}
                    >
                      {approvalLoading ? 'Approving...' : '🔓 Approve fBTC'}
                    </button>
                  )}
                  
                  {/* Deposit button */}
                  <form
                    className="w-full"
                    onSubmit={async e => {
                      e.preventDefault();
                      if (!contract) return;
                      setLoading(true);
                      setError(null);
                      setSuccess(null);
                      try {
                        // Convert to 18 decimals for fBTC
                        const amt = ethers.parseUnits(amount, 18);
                        console.log('depositing', amt);
                        console.log('contract', contract);
                        console.log('id', id);
                        await contract.deposit(1, amt);
                        setSuccess('Deposit successful!');
                        setAmount('');
                      } catch (e: any) {
                        setError(e.message || 'Deposit failed');
                      }
                      setLoading(false);
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-candy"
                      disabled={loading || !contract || needsApproval}
                    >
                      {loading ? 'Locking...' : '🍭 Lock Now!'}
                    </button>
                  </form>
                  
                  {approvalSuccess && <div className="text-green-600 text-sm mt-2">{approvalSuccess}</div>}
                  {approvalError && <div className="text-red-600 text-sm mt-2">{approvalError}</div>}
                  {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                  {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                </div>
              )}
            </>
          )}
        </div>
        {/* Candy Crush–style decorations */}
        <div className="absolute -top-6 left-6 w-10 h-10 bg-pink-300 rounded-full shadow-lg border-2 border-pink-200 animate-bounce" style={{ zIndex: 1 }} />
        <div className="absolute -bottom-6 right-8 w-8 h-8 bg-yellow-300 rounded-full shadow-lg border-2 border-yellow-200 animate-bounce-slow" style={{ zIndex: 1 }} />
        <div className="absolute -bottom-8 left-12 w-6 h-6 bg-orange-300 rounded-full shadow-lg border-2 border-orange-200 animate-bounce" style={{ zIndex: 1 }} />
      </div>
    </div>
  );
}

// Animations (add to your global CSS or Tailwind config):
// .animate-pop { animation: pop 0.4s cubic-bezier(.68,-0.55,.27,1.55) both; }
// .animate-bounce-slow { animation: bounce 2s infinite; }
// .animate-candy { animation: wiggle 0.8s infinite alternate; }
// @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
// @keyframes wiggle { 0% { transform: rotate(-2deg); } 100% { transform: rotate(2deg); } }