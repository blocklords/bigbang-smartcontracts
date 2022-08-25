let BigBangGame   = artifacts.require("BigBangGame");
let ERC20         = artifacts.require("CrownsToken");
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
let cwsAddress        = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";
let mscpAddress       = "0x56ae34F87eA05752C0A071CF0bc15EC68625d6d1";

let nftAddress        = "0xBFfc9eEbfDA9F37980042476f7A2F97eba06e246";
let nftFactoryAddress = "0xD5B6cfC873b97468FA5b2B7FBB1cc12777226B67";

let bbGameAddress     = "0x4aa41C45A72D1AcB278C2062cC58036D11a5a65A";


// // //--------------------------------------------------------------


    console.log("loading contracts...");
    let bigBangGame       = await BigBangGame.at(bbGameAddress);
    let bigBangNFT        = await BigBangNFT.at(nftAddress);
    let bigBangnftFactory = await NftFactory.at(nftFactoryAddress);

// ============================================================================================
// ==================================== owner wallet ==========================================
// // // //----------------------approve start------------------------------------

//     console.log("loading token contracts...");
// 	let cws  = await ERC20.at(cwsAddress);
//     let mscp  = await ERC20.at(mscpAddress);

// 	try{
// 		let approveAmount = web3.utils.toWei("100000000","ether");
        
// 		console.log(`cws approve BigBangGame ${bbGameAddress} start`);
// 		await cws.approve(bbGameAddress, approveAmount);

//         console.log(`mscp approve BigBangGame ${bbGameAddress} start`);
//         await mscp.approve(bbGameAddress, approveAmount);

//         console.log("nft setApprovalForAll BigBangGame start");
//         await bigBangNFT.setApprovalForAll(bbGameAddress, true);
//         console.log("nft setApprovalForAll BigBangGame finished");

// 	}catch(e){
// 		console.log(e);
// 	}
// 	console.log("approve fine");

// // // // // //----------------------approve end------------------------------------


// // // // // //----------------------add factory start------------------------------------

//     try{

//         // console.log(`nft add factory!!!!`);
//         // await bigBangNFT.setFactory(nftFactoryAddress);
        

//         console.log(`factory add Generator!!!!`);
//         let isGenerator = await bigBangnftFactory.isGenerator(bbGameAddress);
//         if(!isGenerator) {
//             await bigBangnftFactory.addGenerator(bbGameAddress);
//         }

//     }catch(e){
//         console.log(e);
//     }
//     console.log("factory fine");

// //----------------------add factory end------------------------------------


// //----------------------add token start------------------------------------

    // try{

    //     console.log(`addtoken start!!!!`);
    //     await bigBangGame.addToken(mscpAddress);

    // }catch(e){
    //     console.log(e);
    // }
    // console.log("addtoken fine");

// // // //----------------------add token end------------------------------------
// ============================================================================================
// ============================================================================================





// ============================================================================================
// ==================================== verifier wallet =======================================
// // // //----------------------get vrs start------------------------------------
  // // vrs

  //   let player   = "0x5bDed8f6BdAE766C361EDaE25c5DC966BCaF8f43";
  //   let verifier = "0xC6EF8A96F20d50E347eD9a1C84142D02b1EFedc0";
  //   let id       = 1;



  //   let quality  = 5;
  //   let image    = 1;
  //   async function signExportNFT(_id, _quality, _image, player) {
  //   //v, r, s related stuff
  //   let nonce = await bigBangGame.nonce(player);

  //   let byets0 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(_id.toString())]);
  //   let bytes1 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(nonce.toString())]);
  //   let bytes2 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(_quality.toString())]);
  //   let bytes3 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(_image.toString())]);

  //   let str = byets0 + player.substr(2) + (bigBangGame.address).substr(2) + bytes1.substr(2)  + bytes2.substr(2) + bytes3.substr(2);
  //   let data = web3.utils.keccak256(str);
  //   let hash = await web3.eth.sign(data, verifier);

  //   let r = hash.substr(0,66);
  //   let s = "0x" + hash.substr(66,64);
  //   let v = parseInt(hash.substr(130), 16);
  //   if (v < 27) {
  //       v += 27;
  //   }
  //   return [v, r, s];
  // }


  // let sign = await signExportNFT(id, quality, image, player);
  // console.log(sign[0], sign[1], sign[2]);




  // let nftId = 7;

  // async function signImportNFT(_id, _nftId, player) {
  //   //v, r, s related stuff
  //   let nonce = await bigBangGame.nonce(player);

  //   let byets0 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(_id.toString())]);
  //   let bytes1 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(_nftId.toString())]);
  //   let bytes2 = web3.eth.abi.encodeParameters(["uint256"],[parseInt(nonce.toString())]);

  //   let str = byets0 +  bytes1.substr(2) + player.substr(2) + (bigBangGame.address).substr(2) + bytes2.substr(2);
  //   let data = web3.utils.keccak256(str);
  //   let hash = await web3.eth.sign(data, verifier);

  //   let r = hash.substr(0,66);
  //   let s = "0x" + hash.substr(66,64);
  //   let v = parseInt(hash.substr(130), 16);
  //   if (v < 27) {
  //       v += 27;
  //   }
  //   return [v, r, s];
  // }


  // let signIn = await signImportNFT(id, nftId, player);
  // console.log(signIn[0], signIn[1], signIn[2]);

// // // //----------------------get vrs end------------------------------------
// ============================================================================================
// ============================================================================================





// ============================================================================================
// ==================================== player wallet =========================================
// // // //----------------------exportNFT start------------------------------------
    // quality, image the same as above
    // let id = 1;
    // let quality  = 5;
    // let image    = 1;

    // get v r s ,fill in
    // let v = ;
    // let r = ;
    // let s = ;


    // try{

    //     console.log(`exportNFT start!!!!`);
    //     await bigBangGame.exportNft(id, quality, image, v, r, s);

    // }catch(e){
    //     console.log(e);
    // }
    // console.log("exportNft fine");

// // // //----------------------exportNFT end------------------------------------



// // // //----------------------tokenChangeGold start------------------------------------

    // try{

    //     console.log(`tokenChangeGold start!!!!`);
    //     await bigBangGame.tokenChangeGold(0,web3.utils.toWei("1","ether"));

    // }catch(e){
    //     console.log(e);
    // }
    // console.log("tokenChangeGold fine");


// // // //----------------------tokenChangeGold end------------------------------------
// ============================================================================================
// ============================================================================================

}.bind(this);