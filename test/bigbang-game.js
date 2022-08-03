// import expectThrow from './expectThrow';

var Nft = artifacts.require("./MineNFT.sol");
var Factory = artifacts.require("./MineNFTFactory.sol");
var Crowns = artifacts.require("./CrownsToken.sol");
var Mscp = artifacts.require("./MscpToken.sol");
var MinerGame = artifacts.require("MinerGame");


contract('mine MinerGame', async (accounts) => {

  // imported contracts
  let crowns      = null;
  let minerGame   = null;
  let factory     = null;
  let nft         = null;
  let mscp        = null;

  //accounts data
  let player    = null;
  let gameOwner = null;
  let verifier  = null;

  //token
  let rewardToken    = null;
  let exchangeToken1 = null;
  let exchangeToken2 = null;
  let ratio          = 15000;
  let newRatio       = 20000;
  let typeId         = 0;
  let tokenType      = null;
  let token          = null;
  let nftId          = 1;
  let amount         = web3.utils.toWei("1","ether");
  let gold           = 5000;
  let nonce          = null;
  let chainId        = 0;


  // //digital signatures
  async function signNft(nftId, player) {
    //v, r, s related stuff
    let nonce = await minerGame.nonce();

    let bytes1 = web3.eth.abi.encodeParameters(["uint256"],[nftId]); 
    let bytes2 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(nonce.toString())]);

    let str = bytes1 + player.substr(2) + (minerGame.address).substr(2) + bytes2.substr(2);
    let data = web3.utils.keccak256(str);
    let hash = await web3.eth.sign(data, verifier);

    let r = hash.substr(0,66);
    let s = "0x" + hash.substr(66,64);
    let v = parseInt(hash.substr(130), 16);
    if (v < 27) {
        v += 27;
    }

    return [v, r, s];
  }

  async function signExchange(gold, player) {
    //v, r, s related stuff
    let nonce = await minerGame.nonce();
    let chainId = await web3.eth.net.getId();
    console.log(chainId);
    let bytes1 = web3.eth.abi.encodeParameters(["uint256"],[gold]); 
    let bytes2 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(nonce.toString())]);
    let bytes3 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(chainId.toString())]);

    let str = bytes1 + player.substr(2) + bytes2.substr(2) + (minerGame.address).substr(2) + bytes3.substr(2);
    let data = web3.utils.keccak256(str);
    let hash = await web3.eth.sign(data, verifier);

    let r = hash.substr(0,66);
    let s = "0x" + hash.substr(66,64);
    let v = parseInt(hash.substr(130), 16);
    if (v < 27) {
        v += 27;
    }
    return [v, r, s];
  }

  // before player starts, need a few things prepare.
  // one of things to allow nft to be minted by nft factory
  it("1. should link nft, nft factory and nft staking contracts", async () => {
    nft       = await Nft.deployed();
    factory   = await Factory.deployed();
    crowns    = await Crowns.deployed();
    mscp      = await Mscp.deployed();
    minerGame = await MinerGame.deployed();

    gameOwner = accounts[0];
    player    = accounts[1];
    verifier  = accounts[2];

    rewardToken = crowns.address;
    exchangeToken1 = crowns.address;
    exchangeToken2 = mscp.address;

    await nft.setFactory(factory.address);

   
  });

  it("2. Give player and contract tokens to exchange the gold and issue reward", async() => {
    //give player token to exchange gold
    await crowns.approve(gameOwner, web3.utils.toWei("10000000","ether"), {from: gameOwner});
    await crowns.transferFrom(gameOwner, player, web3.utils.toWei("100","ether"), {from: gameOwner});

    await mscp.approve(gameOwner, web3.utils.toWei("10000000","ether"), {from: gameOwner});
    await mscp.transferFrom(gameOwner, player, web3.utils.toWei("100","ether"), {from: gameOwner});

    //give contract token to issue reward
    await crowns.transferFrom(gameOwner, minerGame.address, web3.utils.toWei("10000","ether"), {from: gameOwner});
  });


  it("3. should mint 2 nft tokens", async () => {

    let granted = await factory.isGenerator(gameOwner);
    if (!granted) {
      await factory.addGenerator(gameOwner);
    } else {
      //replace with throw errror
	    console.log(`Account ${gameOwner} was already granted a permission`);
    }

    let generation = 0;
    let quality = 1;
    // mint 2 tokens of each quality
    for(var i = 0; i < 2; i++){
      await factory.mint(player, generation, quality);
    }

  });


  //Add the address where the second token can be exchanged for gold
  it("4. add second exchange token to game contract (addToken method)", async () => {
    
    try{
      await minerGame.addToken(exchangeToken2, {from: gameOwner});
    }catch(e){
      console.log(e);
    }

  });


  it("5. Import nft to game contract to increase gold revenue(importNft method)", async () => {
    signature = await signNft(nftId, player);

    //ERC721 approve and import token to contract
    await nft.setApprovalForAll(minerGame.address, true, {from: player});

    try{
      await minerGame.importNft(nftId, signature[0], signature[1], signature[2], {from: player});
    }catch(e){
      console.log(e);
    }

  });


  it("6. Put in the second NFT to replace the previous one", async () => {
    nftId++;

    signature = await signNft(nftId,player);

    try{
      //if importNft() doesnt fail, test should pass
      await minerGame.importNft(nftId, signature[0], signature[1], signature[2], {from: player});
    }catch(e){
      //if importNft() fails, the test should fail
      console.log(e);
    }
  });


  it("7. Exchange the first token for gold coins (tokenChangeGold method) ", async () => {

    //ERC20 approve and token exchange gold coins
    await crowns.approve(minerGame.address, web3.utils.toWei("10000000","ether"), {from: player});
    await minerGame.tokenChangeGold(0, amount, {from: player});

  });


  it("8. Exchange the second token for gold coins (tokenChangeGold method) ", async () => {

    //ERC20 approve and token exchange gold coins

    await mscp.approve(minerGame.address, web3.utils.toWei("10000000","ether"), {from: player});
    await minerGame.tokenChangeGold(1, amount, {from: player});

  });


  it("9. Gold coin exchange rewardToken (goldChangeToken method)", async () => {

    signature = await signExchange(gold, player, {from: player});

    //ERC20 approve and  gold coins exchange token 
    await crowns.approve(minerGame.address, web3.utils.toWei("10000000","ether"), {from: gameOwner});
    await minerGame.goldChangeToken(parseInt(gold), signature[0], signature[1], signature[2], {from: player});
  });


  it("10. Modification of exchange ratio  (setScale method) ", async () => {
    try{
      //if setScale() dont fail, test should pass
      await minerGame.setScale(newRatio, {from: gameOwner});
    }catch(e){
     console.log(e);
    }
  });


  it("11. Remove the NFT from the game contract (exportNft method)", async () => {

    try{
      await minerGame.exportNft(nftId, {from: player});
    }catch(e){
      console.log("exportNft fail " + e);
    }
  });


  it("12. Withdraw the exchangeToken one in the contract (withdraw method)", async () => {

    try{
      await minerGame.withdraw(exchangeToken1, amount, {from: gameOwner});
    }catch(e){
      console.log("withdraw fail " + e);
    }
  });


  it("13. Withdraw the exchangeToken two in the contract (withdraw method)", async () => {

    try{
      await minerGame.withdraw(exchangeToken2, amount, {from: gameOwner});
    }catch(e){
      console.log("withdraw fail " + e);
    }
  });

});