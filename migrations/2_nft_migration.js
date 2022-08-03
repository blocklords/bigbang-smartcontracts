var BigBangNFT = artifacts.require("./BigBangNFT.sol");
// var Seascape   = require("seascape");

module.exports = async function(deployer, network) {
   
        await deployer.deploy(BigBangNFT).then(function(){
            console.log("BigBangNFT contract was deployed at address: "+ BigBangNFT.address);
        });

};