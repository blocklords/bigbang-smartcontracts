let BigBangGame = artifacts.require("BigBangGame");
let ERC20 = artifacts.require("CrownsToken");
let BigBangNFT    = artifacts.require("BigBangNFT");
let NftFactory    = artifacts.require("MineNFTFactory");

module.exports = async function(callback) {
    console.log("Calling the init function...")
    let res = await init();
    
    callback(null, res);
};

let init = async function() {
    console.log("account is setting..")
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    let gameOwner = accounts[0];



// // // bsctestnet

// // let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
// // let cwsAddress = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";


// // let nftAddress = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";
// // let nftFactoryAddress = "0xCeE733CA0fF7e1F7Ea276734051C23CA46547e34";

let bbGameAddress = "0xc93921Ae9d9b5f1340c1B1E5D923Bd2368579C66";

// // //--------------------------------------------------------------


//     console.log("loading contracts...");
    let BigBangGame = await BigBangGame.at(bbGameAddress);
//     let BigBangNFT   = await BigBangNFT.at(nftAddress);
//     let nftFactory= await NftFactory.at(nftFactoryAddress);

// // // //----------------------approve start------------------------------------

//     console.log("loading token contracts...");
// 	// let usdc = await ERC20.at(usdcAddress);
// 	let cws  = await ERC20.at(cwsAddress);
//     let rib  = await ERC20.at(ribAddress);

// 	try{
// 		let approveAmount = web3.utils.toWei("100000000","ether");
        
// 		console.log(`cws approve BigBangGame{bbGameAddress} start`);
// 		await cws.approve(bbGameAddress, approveAmount);

//         // console.log(`usdc approve BigBangGame{bbGameAddress} start`);
//         // await usdc.approve(bbGameAddress, approveAmount);

//         console.log(`rib approve BigBangGame{bbGameAddress} start`);
//         await rib.approve(bbGameAddress, approveAmount);

//         console.log("nft setApprovalForAll BigBangGame start");
//         await BigBangNFT.setApprovalForAll(bbGameAddress, true);
//         console.log("nft setApprovalForAll BigBangGame finished");

// 	}catch(e){
// 		console.log(e);
// 	}
// 	console.log("approve fine");


//     try{

//         console.log(`nft add factory!!!!`);
//         await BigBangNFT.setFactory(nftFactoryAddress);
        

//         console.log(`factory add Generator!!!!`);
//         let isGenerator = await nftFactory.isGenerator(gameOwner);
//         if(!isGenerator) {
//             await nftFactory.addGenerator(gameOwner);
//         }

//     }catch(e){
//         console.log(e);
//     }
//     console.log("factory fine");

    let player = "0xC6EF8A96F20d50E347eD9a1C84142D02b1EFedc0";
    let verifier = "0xA25AcBa8DC413ac340a55B90e946db41c3A77310";
    async function signExchange(gold, player) {
    //v, r, s related stuff
    let nonce = await BigBangGame.nonce();
    let chainId = await web3.eth.net.getId();
    console.log(chainId);
    let bytes1 = web3.eth.abi.encodeParameters(["uint256"],[gold]); 
    let bytes2 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(nonce.toString())]);
    let bytes3 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(chainId.toString())]);

    let str = bytes1 + player.substr(2) + bytes2.substr(2) + (BigBangGame.address).substr(2) + bytes3.substr(2);
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


  let a = await signExchange(1,player);
  console.log(a[0], a[1], a[2]);

}.bind(this);