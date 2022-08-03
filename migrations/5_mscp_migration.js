var Mscp = artifacts.require("./MscpToken.sol");

module.exports = function(deployer, network) {
    deployer.deploy(Mscp).then(function(){
	    console.log("Mscp was deployed at: "+ Mscp.address);
    });
}
