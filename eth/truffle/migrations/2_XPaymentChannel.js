'use strict';
var XPaymentChannel = artifacts.require("XPaymentChannel");

module.exports = function(deployer, network, accounts) {
  //XPaymentChannel.defaults({ value: web3.toWei(5.0, "ether") });
  var value = web3.toWei(5.0, "ether");
  deployer.deploy(XPaymentChannel, accounts[1], 255, 400000, {value: value});
  XPaymentChannel.deployed().
  then(instance => {
      //instance.state().then(result => console.log('Initial state() '+ result));
      //instance.send(web3.toWei(5.0, 'ether'))
        instance.A().then(result => console.log('A() '+ result));
        instance.B().then(result => console.log('B() '+ result));
        instance.sum().then(result => console.log('sum() '+ result));
        instance.state().then(result => console.log('state() '+ result));


      //var instance = XPaymentChannel.at(XPaymentChannel.address);

  })
};
