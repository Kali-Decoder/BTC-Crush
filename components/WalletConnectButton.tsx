"use client";
import React from 'react';
import { useWallet } from './WalletProvider';

export function WalletConnectButton() {
  const { address, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
      {!address ? (
        <button
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-lg hover:scale-105 transition-transform animate-candy border-2 border-white"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="px-5 py-2 rounded-full bg-white text-pink-600 font-bold shadow-lg border-2 border-pink-200 animate-candy">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            className="ml-2 px-3 py-2 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform border-2 border-white text-xs"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

export default WalletConnectButton; 