var BigBangGame = artifacts.require("./BigBangGame.sol");
var Crowns    = artifacts.require("./CrownsToken.sol");
var BigBangNFT = artifacts.require("./BigBangNFT.sol");

//bsctestnet
let rewardToken = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";
let nft   = "0xBFfc9eEbfDA9F37980042476f7A2F97eba06e246";
let verifier = "0xc6ef8a96f20d50e347ed9a1c84142d02b1efedc0";


// // moonbase
// let rewardToken = "0xFde9cad69E98b3Cc8C998a8F2094293cb0bD6911";
// let nft   = "0xa70D47f39B3cea4E3a1f89bF866d9F6f3B4006Ec";
// let verifier = "0xA25AcBa8DC413ac340a55B90e946db41c3A77310";


module.exports = function(deployer, network) {
    deployer.deploy(BigBangGame, rewardToken, nft, verifier).then(function(){
	    console.log("BigBangGame was deployed at address: "+ BigBangGame.address);
    });
};

// 


// async function getAccount(id) {
//     let accounts = await web3.eth.getAccounts();
//     return accounts[id];
// }

// module.exports = async function(deployer, network) {
//     var verifier = await getAccount(2);

//     // console.log(verifier);
//     await deployer.deploy(BigBangGame, Crowns.address, MineNFT.address, verifier).then(function(){
//         console.log("BigBangGame was deployed at address: "+ BigBangGame.address);
//     });
// };
 
