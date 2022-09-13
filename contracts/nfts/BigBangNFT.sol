// SPDX-License-Identifier: MIT
pragma solidity 0.6.7;

import "./../openzeppelin/contracts/access/Ownable.sol";
import "./../openzeppelin/contracts/utils/Counters.sol";
import "./../openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./../openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";

/// @author Season Lei
contract BigBangNFT is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private nftId;

    struct Params {
        uint256 quality;   
        uint256 image;  
    }

    address private factory;

    mapping(uint256 => Params) public paramsOf;

    event Minted(address indexed owner, uint indexed id,  uint256 quality, uint256 image, uint time);

    constructor() public ERC721("BigBang NFT", "BB") {
        nftId;
    }

    modifier onlyFactory() {
        require(factory == _msgSender(), "Mine NFT: Only NFT Factory can call the method");
        _;
    }

    function mint(address _to, uint256 _quality, uint256 _image) public onlyFactory returns(uint256) {

        uint256 _nftId = nftId.current();

        _safeMint(_to, _nftId);

        paramsOf[_nftId] = Params(_quality, _image);
        nftId.increment();

      	emit Minted(_to, _nftId, _quality, _image, block.timestamp);
      	return _nftId;
    }

    function setOwner(address _owner) public onlyOwner {
        transferOwnership(_owner);
    }

    function setFactory(address _factory) public onlyOwner {
        factory = _factory;
    }

    function setBaseUri(string memory _uri) public onlyOwner {
        _setBaseURI(_uri);
    }
}
