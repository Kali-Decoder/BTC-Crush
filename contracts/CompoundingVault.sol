// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {RewardNFT} from "./NFT.sol";
contract AutoCompVault is Ownable(msg.sender), Pausable, ReentrancyGuard {
    IERC20 public immutable depositToken; //FBTC
    IERC20 public immutable shareToken; //BTC-CRUSH
    RewardNFT public rewardNFT;
    uint256 private vaultID;
    struct VaultConfig {
        bool isActive;
        uint256 vaultId;
        uint256 yieldPercentage; //5,10,20,15,25
        uint256 yieldDuration; // 30,60,90,120,365 [whiteNFT,gold,silver,platinium,platiniumgold]
        uint256 totalDeposit;
        uint256 totalDepositors;
        uint32 lastDepositTimestamp;
        uint256 totalsharesMinted;
    }

    mapping(uint256 => VaultConfig) public vaults;
    mapping(uint256 => mapping(address => uint256)) public depositAmounts;
    mapping(uint256 => mapping(address => uint256)) public sharesAmount;

    uint32 public constant scalingFactor = 1e5;

    // ======Events======
    event Deposited(
        uint256 indexed vaultId,
        address indexed user,
        uint256 depositAmount,
        uint256 shareAmount
    );
    event Redeemed(
        uint256 indexed vaultId,
        address indexed user,
        uint256 shareAmount,
        uint256 redeemableAmount
    );

    // ======Errors======
    error ZeroAddress();
    error ZeroAmount();
    error ZeroYieldPercentage();
    error ZeroYieldDuration();
    error InvalidToken();
    error InsufficientDepositAllowance();
    error InsufficientDepositBalance();
    error InsufficientShareBalance();
    error ZeroPPFS();
    error ZeroRedeemableAmount();
    // error InsufficientTotVaultBalance();
    error RedeemAmtExceedDepositedAmt();
    error ImpossibleTotDepExceedUserDep();

    constructor(address _shareTokenAddress, address _depositToken,address _nftAddress) {
        if (_shareTokenAddress == address(0) || _depositToken == address(0)) {
            revert ZeroAddress();
        }
        shareToken = IERC20(_shareTokenAddress);
        depositToken = IERC20(_depositToken);
        rewardNFT = RewardNFT(_nftAddress);
    }

    function addVault(uint256 _apr, uint256 _yieldDuration) external onlyOwner {
        require(_apr > 0 && _apr < 15, "APR_NOT_IN_RANGE");
        require(_yieldDuration > 0, "YIELD DURATION IS NOT CORRECT");
        uint256 currentVaultId = ++vaultID;
        VaultConfig memory newVault = VaultConfig({
            isActive: true,
            vaultId: currentVaultId,
            yieldPercentage: _apr,
            yieldDuration: _yieldDuration,
            totalDeposit: 0,
            totalDepositors: 0,
            lastDepositTimestamp: uint32(block.timestamp),
            totalsharesMinted: 0
        });
        vaults[currentVaultId] = newVault;
    }

    // // ======Getters======

    // /// @dev Returns the amount of deposit token for a given user address
    function depositOf(uint256 _id) public view returns (uint256) {
        return depositAmounts[_id][msg.sender];
    }

    // /// @dev get the PPFS (price per full share) i.e.
    // // (total_deposited_amount with accrued interest over time) is divided by (total_shares)
    // // Get the PPFS in wei so as to avoid precision loss
    function getPPFS(
        uint256 _yieldPercentage,
        uint256 _yieldDuration,
        uint256 _totalDepositBalance,
        uint256 _lastDepositTimestamp,
        uint256 _totalsharesMinted
    ) public view returns (uint256) {
        uint256 ppfs = 1e18;

        uint256 _lastTotalDepositBalance = _totalDepositBalance;

        if (_lastTotalDepositBalance != 0) {
            // 1. current accrued interest percentage
            // in decimal
            uint256 currentAccruedInterestPercentage = ((block.timestamp -
                _lastDepositTimestamp) * _yieldPercentage) / _yieldDuration;
            // console.log("getPPFS::currentAccruedInterestPercentage: ", currentAccruedInterestPercentage);

            // 2. total deposited amount with interest
            // NOTE: divide by 1e18 is done in step-2 here as because in the previous step, it was becoming
            // (2.1) prefer this as it gives more precision. E.g. 1060000000000000000
            uint256 totalDepositedWithInterest = _lastTotalDepositBalance +
                ((_lastTotalDepositBalance * currentAccruedInterestPercentage) /
                    scalingFactor);
            // (2.2) prefer this as it gives more precision. E.g. 1000000000000000000
            // uint256 totalDepositedWithInterest = _lastTotalDepositBalance * (1 + currentAccruedInterestPercentage / scalingFactor);
            // console.log("getPPFS::totalDepositedWithInterest: ", totalDepositedWithInterest);
            // console.log("getPPFS::totalShares: ", totalShares());

            // 3. price per full share
            // NOTE: 1e18 is multiplied to get the precision
            // Actual value can be computed offchain by dividing by 1e18 as float type.
            ppfs = (totalDepositedWithInterest * 1e18) / _totalsharesMinted;
        }

        return ppfs;
    }

    // // TODO: add this function
    // /// @dev Get redeemable amount for a given user address for a given share amount
    // function getRedeemableAmount() public view returns (uint256) {}

    // // ======private======
    function _updateVaultIndivAndTotOnDeposit(
        VaultConfig storage _vault,
        uint256 _amount,
        uint256 _lastTotalDepositBalance,
        uint256 _lastDepositBalanceOf,
        uint32 _lastDepositTimestamp
    ) private {
        // if total deposited is zero, then mint share token = deposit token as PPFS = 1, else calculated based on PPFS
        if (_lastTotalDepositBalance == 0) {
            // update the caller's & total vault i.e. deposited amount
            depositAmounts[_vault.vaultId][msg.sender] = _amount;
            _vault.totalDeposit = _amount;
        } else {
            // update the caller's vault i.e. deposited amount with accrued interest
            uint256 accruedInterestOfprevDepositedAmt = (_lastDepositBalanceOf *
                (block.timestamp - _lastDepositTimestamp) *
                _vault.yieldPercentage) / _vault.yieldDuration;

            depositAmounts[_vault.vaultId][msg.sender] =
                _lastDepositBalanceOf +
                (accruedInterestOfprevDepositedAmt / scalingFactor) +
                _amount;

            // update the total deposited amount with accrued interest on last total deposited amount
            uint256 accruedInterestOfTotDepositedAmt = (_lastTotalDepositBalance *
                    (block.timestamp - _lastDepositTimestamp) *
                    _vault.yieldPercentage) / _vault.yieldDuration;

            _vault.totalDeposit =
                _lastTotalDepositBalance +
                (accruedInterestOfTotDepositedAmt / scalingFactor) +
                _amount;
        }
    }

    function _updateVaultIndivAndTotOnRedeem(
        VaultConfig storage _vault,
        uint256 _redeemableAmount,
        uint256 _lastTotalDepositBalance,
        uint256 _lastDepositBalanceOf,
        uint32 _lastDepositTimestamp
    ) private {
        // update the caller's vault i.e. deposited amount with accrued interest
        uint256 accruedInterestOfprevDepositedAmt = (_lastDepositBalanceOf *
            (block.timestamp - _lastDepositTimestamp) *
            _vault.yieldPercentage) / _vault.yieldDuration;

        // bracketing `accruedInterestOfprevDepositedAmt / scalingFactor` is optional
        depositAmounts[_vault.vaultId][msg.sender] =
            _lastDepositBalanceOf +
            (accruedInterestOfprevDepositedAmt / scalingFactor) -
            _redeemableAmount;

        // update the total deposited amount with accrued interest on last total deposited amount
        uint256 accruedInterestOfTotDepositedAmt = (_lastTotalDepositBalance *
            (block.timestamp - _lastDepositTimestamp) *
            _vault.yieldPercentage) / _vault.yieldDuration;

        _vault.totalDeposit =
            _lastTotalDepositBalance +
            (accruedInterestOfTotDepositedAmt / scalingFactor) -
            _redeemableAmount;
    }

    // // ======Setters======

    /// @dev Deposit tokens to the vault
    function deposit(uint256 _vaultId, uint256 _amount)
        external
        nonReentrant
        whenNotPaused
    {
        require(_vaultId <= vaultID, "NOT VALID VAULT ID");
        VaultConfig storage _vault = vaults[_vaultId];
        require(_vault.isActive, "VAULT IS NOT ACTIVE");
        if (_amount == 0) {
            revert ZeroAmount();
        }
        // check the allowance, whether approved or not
        if (_amount > depositToken.allowance(msg.sender, address(this))) {
            revert InsufficientDepositAllowance();
        }

        uint256 _lastDepositBalanceOf = depositAmounts[_vaultId][msg.sender];
        uint256 _lastTotalDepositBalance = _vault.totalDeposit;
        uint32 _lastDepositTimestamp = _vault.lastDepositTimestamp;

        if (_lastTotalDepositBalance < _lastDepositBalanceOf) {
            revert ImpossibleTotDepExceedUserDep();
        }

        // calculate share token amount
        // NOTE: PPFS (calculated) need to be divided by 1e18 i.e. multiplied in numerator.
        // PPFS = 1e18, if totalDepositBalance == 0, else PPFS > 1e18
        uint256 shareAmount = (_amount * 1e18) /
            getPPFS(
                _vault.yieldPercentage,
                _vault.yieldDuration,
                _vault.totalDeposit,
                _vault.lastDepositTimestamp,
                _vault.totalsharesMinted
            ); // more precision

        _updateVaultIndivAndTotOnDeposit(
            _vault,
            _amount,
            _lastTotalDepositBalance,
            _lastDepositBalanceOf,
            _lastDepositTimestamp
        );

        // update the last_deposit_timestamp
        _vault.lastDepositTimestamp = uint32(block.timestamp);

        require(
            shareToken.balanceOf(address(this)) >= shareAmount,
            "Insufficient Balance"
        );
      
        // transferFrom deposit token to vault
        depositToken.transferFrom(msg.sender, address(this), _amount);
        rewardNFT.mintNFTBasedOnDeposit(msg.sender, _amount);
        shareToken.transfer(msg.sender, shareAmount);
        sharesAmount[_vaultId][msg.sender] += shareAmount;
        _vault.totalsharesMinted += shareAmount;
        emit Deposited(_vault.vaultId, msg.sender, _amount, shareAmount);
    }

    // /// @dev Redeem tokens (including autocompound) from the vault
    // /// NOTE: Here, the deposited amount can't be withdrawn unlike
    // /// in a simple vault (without auto-compounding yield).
    // /// Here, the deposited amount can only be redeemed by giving back the share tokens.
    function redeem(uint256 _vaultId, uint256 _shareAmount)
        external
        nonReentrant
        whenNotPaused
    {
        if (_shareAmount == 0) {
            revert ZeroAmount();
        }
        require(_vaultId <= vaultID, "NOT VALID VAULT ID");
        VaultConfig storage _vault = vaults[_vaultId];
        require(_vault.isActive, "VAULT IS NOT ACTIVE");
        // check for available balance
        if(_shareAmount > shareToken.balanceOf(msg.sender)) {
            revert InsufficientShareBalance();
        }

        uint256 _lastDepositBalanceOf = depositAmounts[_vaultId][msg.sender];
        uint256 _lastTotalDepositBalance = _vault.totalDeposit;

        if (_lastDepositBalanceOf == 0) {
            revert InsufficientDepositBalance();
        }

        if (_lastTotalDepositBalance < _lastDepositBalanceOf) {
            revert ImpossibleTotDepExceedUserDep();
        }

        // calculate redeemable amount i.e. CRVstETH tokens
        // NOTE: PPFS (calculated) based on totalDepositBalance value (== 0 or != 0)
        uint256 _redeemableAmount = (_shareAmount *
            getPPFS(
                _vault.yieldPercentage,
                _vault.yieldDuration,
                _vault.totalDeposit,
                _vault.lastDepositTimestamp,
                _vault.totalsharesMinted
            )) / 1e18;

        // Output sanitization | check if redeemable amount is greater than user's deposited balance in vault
        if (_redeemableAmount > _lastDepositBalanceOf) {
            revert RedeemAmtExceedDepositedAmt();
        }

        _updateVaultIndivAndTotOnRedeem(
            _vault,
            _redeemableAmount,
            _lastTotalDepositBalance,
            _lastDepositBalanceOf,
            _vault.lastDepositTimestamp
        );

        // burn share token from msg.sender
        shareToken.transferFrom(msg.sender, address(this), _shareAmount);

        // transferFrom deposit token to vault
        depositToken.transfer(msg.sender, _redeemableAmount);

        emit Redeemed(_vaultId, msg.sender, _shareAmount, _redeemableAmount);
    }

    // ------------------------------------------------------------------------------------------
    /// @notice Pause contract
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    /// @notice Unpause contract
    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function transferFunds(address _token) external onlyOwner {
        require(IERC20(_token).balanceOf(msg.sender)>0,"INSUFFICIENT BALANCE");
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(msg.sender,balance);
    }
}
