// SPDX-License-Identifier: MIT
pragma solidity 0.6.7;

import "./../openzeppelin/contracts/math/SafeMath.sol";
import "./../openzeppelin/contracts/access/Ownable.sol";
import "./../openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./../openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./../openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./../nfts/BigBangNFT.sol";

contract BigBangGame is IERC721Receiver, Ownable{

  using SafeMath for uint256;
  uint256 constant MULTIPLIER = 10**18;

  address public BBNft;
  address public rewardToken;
  address public verifier;
  uint256 public ratio = 15000;       //Subscription Ratio: 15000 gold can exchange 1 token
  uint256 public typeId;

  uint256 public nonce;

  struct PlayerParams {
    uint256 nftId;
    uint256 stakeTime;
  }

  mapping(address => PlayerParams) public player;
  mapping(uint256 => address) public BBOwners;
  mapping(address => bool) public changeAllowed;
  mapping(uint256 => address) public token;

  event ImportNft(address indexed owner, uint256 indexed nftId, uint256 time);
  event ExportNft(address indexed owner, uint256 indexed nftId, uint256 time);
  event TokenChangeGold(address indexed owner, uint256 indexed tokenAmount, uint256 time);
  event GoldChangeToken(address indexed owner, uint256 indexed gold, uint256 indexed tokenAmount, uint256 time);
  event Withdraw(address indexed tokenAddress, uint256 indexed tokenAmount, address indexed receiver, uint256 time);
  event AddToken(address indexed tokenAddress, uint256 indexed typeId, uint256 time);

  constructor(address _token, address _nft, address _verifier) public {
    require(_token != address(0), "BBGame: Token can't be zero address");
    require(_nft != address(0), "BBGame: Nft can't be zero address");
    require(_verifier != address(0), "BBGame: Verifier can't be zero address");

    rewardToken = _token;
    BBNft     = _nft;
    verifier    = _verifier;

    changeAllowed[_token] = true;
    token[typeId]     = _token;
  }

  //stake mine NFT
  function importNft(uint256 _nftId, uint8 _v, bytes32 _r, bytes32 _s) external {
    require(_nftId > 0, "BBGame: nft Id invalid");

    BigBangNFT nft = BigBangNFT(BBNft);
    require(nft.ownerOf(_nftId) == msg.sender, "BBGame: Not BBNft owner");

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(_nftId, msg.sender, address(this), nonce));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "Verification failed about stakeToken");
    }

    nft.safeTransferFrom(msg.sender, address(this), _nftId);

    nonce++;

    PlayerParams storage _player = player[msg.sender];
    _player.nftId = _nftId;
    _player.stakeTime = block.timestamp;

    BBOwners[_nftId] = msg.sender;

    emit ImportNft(msg.sender, _nftId, block.timestamp);
  }

  //unstake mine NFT
  function exportNft(uint256 _nftId) external {
    require(BBOwners[_nftId] == msg.sender, "BBGame: Not the owner");

    BigBangNFT nft = BigBangNFT(BBNft);
    nft.safeTransferFrom(address(this), msg.sender, _nftId);

    PlayerParams storage _player = player[msg.sender];
    delete _player.nftId;
    delete _player.stakeTime;

    delete BBOwners[_nftId];

    emit ExportNft(msg.sender, _nftId, block.timestamp);        
  }

  //Exchange tokens for gold coins
  function tokenChangeGold(uint256 _typeId, uint256 _amount) external {
    require(_amount > 0, "BBGame: The exchange amount can't be 0");
    require(checkToken(_typeId), "BBGame: Do not have this token type");

    IERC20 _token = IERC20(token[_typeId]); 
    require(_token.balanceOf(msg.sender) >= _amount, "BBGame: Not enough token to stake");
    
    _token.transferFrom(msg.sender, address(this), _amount);

    emit TokenChangeGold(msg.sender, _amount, block.timestamp);     
  }


  //Exchange  gold coins for tokens
  function goldChangeToken(uint256 _gold, uint8 _v, bytes32 _r, bytes32 _s) external {
    require(_gold > 0, "BBGame: The exchange amount must greater than zero");

    uint256 chainId;   
    assembly {
        chainId := chainid()
    }

    PlayerParams storage _player = player[msg.sender];

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(_gold, msg.sender, nonce, address(this), chainId));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "Verification failed about stakeToken");
    }

    nonce++;

    uint256 _tokenAmount = _gold * MULTIPLIER / ratio;
    _safeTransfer(token[0], msg.sender, _tokenAmount);

    emit GoldChangeToken(msg.sender, _gold, _tokenAmount, block.timestamp);  

  }

  //Check whether this token can be exchanged for gold
  function checkToken(uint256 _typeId) public view returns(bool) {
    address _tokenAddress = token[_typeId];

    if(changeAllowed[_tokenAddress]) {
      return true;
    }

    return false;
  }

  //Safe Transfer
  function _safeTransfer(address _token, address _to, uint256 _amount) internal {
    if (_token != address(0)) {
      IERC20 _rewardToken = IERC20(_token);

      uint256 _balance = _rewardToken.balanceOf(address(this));
      require(_amount <= _balance, "do not have enough token to reward");

      uint256 _beforBalance = _rewardToken.balanceOf(_to);
      _rewardToken.transfer(_to, _amount);

      require(_rewardToken.balanceOf(_to) == _beforBalance + _amount, "Invalid transfer");
    } else {

      uint256 _balance = address(this).balance;
      require(_amount <= _balance, "Do not have enough token to reward");

      payable(_to).transfer(_amount);
    }
  }

  /// @dev encrypt token data
  /// @return encrypted data
  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
  }

  // Accept native tokens.
  receive() external payable {
    //React to receiving ether
  }


  //Owner methods
  //withdraw token
  function withdraw(address _token, uint256 _amount) public onlyOwner{
    require(_token != address(0), "BBGame: Token can't be zero address");
    require(_amount > 0, "BBGame: Must be greater than 0");

    _safeTransfer(_token, owner(), _amount);

    emit Withdraw(_token, _amount, msg.sender, block.timestamp);
  }

  //Add tokens that can be exchanged for gold
  function addToken(address _token) public onlyOwner {
    require(_token != address(0), "BBGame: Token can't be zero address");
    require(!changeAllowed[_token], "BBGame: This token is exist");

    changeAllowed[_token] = true;
    token[++typeId] = _token;

    emit AddToken(_token, typeId, block.timestamp);
  }

  //Change the ratio of tokens to gold coins
  function setScale(uint256 _ratio) public onlyOwner {
    require(_ratio > 0, "BBGame: Ratio must greater than zero");
    ratio = _ratio;
  }
  
}
