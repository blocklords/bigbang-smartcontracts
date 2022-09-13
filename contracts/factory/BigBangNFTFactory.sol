// SPDX-License-Identifier: MIT
pragma solidity 0.6.7;

import "./../openzeppelin/contracts/access/AccessControl.sol";
import "./../openzeppelin/contracts/math/SafeMath.sol";
import "./../nfts/BigBangNFT.sol";
// import "./NftTypes.sol";

/// @title Nft Factory mints Mine NFTs
/// @notice Nft factory has gives to other contracts or wallet addresses permission
/// to mint NFTs.
///
///   Generator role - allows to mint NFT of any quality.
///
/// Nft Factory can revoke the role, or give it to any number of contracts.
contract BigBangNFTFactory is AccessControl {
    using SafeMath for uint256;
    // using NftTypes for NftTypes;

    bytes32 public constant STATIC_ROLE = keccak256("STATIC");
    bytes32 public constant GENERATOR_ROLE = keccak256("GENERATOR");

    BigBangNFT private nft;
    address private owner;
    
    constructor(address _nft) public {
       require(_nft != address(0), "NFT Factory: NFT can't be zero address");
	    nft = BigBangNFT(_nft);
	    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
       owner = msg.sender;
    }

    //--------------------------------------------------
    // Only Mine Staking contract
    //--------------------------------------------------

   function mint(address _owner, uint256 _quality, uint256 _image) public onlyGenerator returns(uint256) {
      require(_owner != address(0), "NFT Factory: Owner can't be zero address");
	   require (_quality > 0 && _quality < 6, "NFT Factory: invalid quality");
	   return nft.mint(_owner, _quality, _image);
   }
    
    //--------------------------------------------------
    // Only owner
    //--------------------------------------------------
   function setNft(address _nft) public onlyAdmin {
	   nft = BigBangNFT(_nft);
   }

   /// @dev Add an account to the admin role. Restricted to admins.
   function addAdmin(address account) public virtual onlyAdmin
   {
      grantRole(DEFAULT_ADMIN_ROLE, account);
   }

   /// @dev Remove oneself from the admin role.
   function renounceAdmin() public virtual
   {
      require(owner != msg.sender, "NFT Factory: owner can not call this method");
	  renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
   }

   /// @dev Return `true` if the account belongs to the admin role.
   function isAdmin(address account) public virtual view returns (bool)
   {
	  return hasRole(DEFAULT_ADMIN_ROLE, account);
   }

   /// @dev Restricted to members of the admin role.
   modifier onlyAdmin()
   {
	  require(isAdmin(msg.sender), "Restricted to admins.");
	  _;
   }

   /// @dev Restricted to members of the user role.
   modifier onlyGenerator()
   {
	  require(isGenerator(msg.sender), "Restricted to random generator.");
	  _;
   }

   /// @dev Return `true` if the account belongs to the user role.
   function isGenerator(address account) public virtual view returns (bool)
   {
      return hasRole(GENERATOR_ROLE, account);
   }
     
   /// @dev Add an account to the user role. Restricted to admins.
   function addGenerator(address account) public virtual onlyAdmin
   {
	  grantRole(GENERATOR_ROLE, account);
   }

   /// @dev Remove an account from the user role. Restricted to admins.
   function removeGenerator(address account) public virtual onlyAdmin
   {
	  revokeRole(GENERATOR_ROLE, account);
   }
}


