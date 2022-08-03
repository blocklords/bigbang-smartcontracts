var BigBangNFTFactory  = artifacts.require("./BigBangNFTFactory.sol");
var BigBangNFT = artifacts.require("./BigBangNFT.sol");

var BBNFTAddress = "0xBFfc9eEbfDA9F37980042476f7A2F97eba06e246";

module.exports = async function(deployer, network) {
   
        // await deployer.deploy(BigBangNFTFactory, BigBangNFT.address).then(function(){
        //     console.log("BigBangNFTFactory contract was deployed at address: "+ BigBangNFTFactory.address);
        // });

        await deployer.deploy(BigBangNFTFactory, BBNFTAddress).then(function(){
            console.log("BigBangNFTFactory contract was deployed at address: "+ BigBangNFTFactory.address);
        });

        //0xD5B6cfC873b97468FA5b2B7FBB1cc12777226B67
};