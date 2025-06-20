import { ethers } from 'ethers';

// Real contract address
export const VAULT_ADDRESS = '0x5CD4F8932184a601d0be60C4dd945c60725c92b3';
export const FBTC_ADDRESS = '0x0e5D06e810Edca5fc273ca75D49F8D7c84137E4b'; // Replace with actual fBTC address

export const VAULT_ABI = [
  // Only the relevant functions for UI
  "function deposit(uint256 _vaultId, uint256 _amount)",
  "function redeem(uint256 _vaultId, uint256 _shareAmount)",
  "function depositOf(uint256 _id) view returns (uint256)",
  "function sharesAmount(uint256, address) view returns (uint256)",
  "function vaults(uint256) view returns (bool isActive, uint256 vaultId, uint256 yieldPercentage, uint256 yieldDuration, uint256 totalDeposit, uint256 totalDepositors, uint32 lastDepositTimestamp, uint256 totalsharesMinted)",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export function getVaultContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signerOrProvider);
}

export function getFBTCToken(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(FBTC_ADDRESS, ERC20_ABI, signerOrProvider);
} 