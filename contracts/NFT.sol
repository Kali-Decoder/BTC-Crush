// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721URIStorage, Ownable {
    uint256 private tokenId;

    // URIs for different NFT tiers
    string public whiteNFT_URI;
    string public gold_URI;
    string public silver_URI;
    string public platinum_URI;
    string public platinumGold_URI;

    constructor(
        string memory collectionName,
        string memory collectionSymbol,
        string memory _whiteNFT,
        string memory _gold,
        string memory _silver,
        string memory _platinum,
        string memory _platinumGold
    ) Ownable(msg.sender) ERC721(collectionName, collectionSymbol) {
        whiteNFT_URI = _whiteNFT;
        gold_URI = _gold;
        silver_URI = _silver;
        platinum_URI = _platinum;
        platinumGold_URI = _platinumGold;
    }

    function setURIs(
        string calldata _whiteNFT,
        string calldata _gold,
        string calldata _silver,
        string calldata _platinum,
        string calldata _platinumGold
    ) external onlyOwner {
        whiteNFT_URI = _whiteNFT;
        gold_URI = _gold;
        silver_URI = _silver;
        platinum_URI = _platinum;
        platinumGold_URI = _platinumGold;
    }

    function mintNFTBasedOnDeposit(address recipient, uint256 fbtcAmount) external {
        require(balanceOf(recipient) == 0, "ALREADY MINTED");

        unchecked {
            tokenId++;
        }

        string memory selectedURI;

        // Tier logic (assuming fbtcAmount in wei, i.e., 18 decimals)
        if (fbtcAmount < 1 ether) {
            selectedURI = whiteNFT_URI;
        } else if (fbtcAmount >= 1 ether && fbtcAmount < 2 ether) {
            selectedURI = gold_URI;
        } else if (fbtcAmount >= 2 ether && fbtcAmount < 3 ether) {
            selectedURI = silver_URI;
        } else if (fbtcAmount >= 3 ether && fbtcAmount < 5 ether) {
            selectedURI = platinum_URI;
        } else {
            selectedURI = platinumGold_URI;
        }

        uint256 newItemId = tokenId;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, selectedURI);
    }
}
