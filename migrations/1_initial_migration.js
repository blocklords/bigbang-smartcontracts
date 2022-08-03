var Migrations = artifacts.require("./Migrations.sol");
var Seascape   = require("seascape");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);

  // let truffleParams = {
  //       projectName: 'season',
  //       projectEnv: 'beta',

  //       contractName: 'Migrations',
  //       contractType: 'main',
  //       contractAbi: Migrations.abi,
  //       contractAddress: Migrations.address,
        
  //       networkId: await deployer.network_id,
  //       txid: Migrations.transactionHash,
  //       owner: deployer.address,
        
  //       // verifier: "", optionally
  //       // fund: "", optioanlly
  //   };

  //   let cdnUpdated = await Seascape.CdnWrite.setTruffleSmartcontract(truffleParams);
  
  //   if (cdnUpdated) {
  //       console.log(`CDN was updated successfully`);
  //   } else {
  //       console.log(`CDN update failed. Please upload it manually!`);
  //       console.log(truffleParams);
  //   }
};
