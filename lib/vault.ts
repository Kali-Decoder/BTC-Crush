import { ethers } from 'ethers';

// Dummy contract address and ABI (replace with real values)
export const VAULT_ADDRESS = '0x000000000000000000000000000000000000dead';
export const VAULT_ABI = [
  // Only the relevant functions for UI
  "function deposit(uint256 _vaultId, uint256 _amount)",
  "function redeem(uint256 _vaultId, uint256 _shareAmount)",
  "function depositOf(uint256 _id) view returns (uint256)",
  "function sharesAmount(uint256, address) view returns (uint256)",
  "function vaults(uint256) view returns (bool isActive, uint256 vaultId, uint256 yieldPercentage, uint256 yieldDuration, uint256 totalDeposit, uint256 totalDepositors, uint32 lastDepositTimestamp, uint256 totalsharesMinted)",
];

export function getVaultContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signerOrProvider);
} 