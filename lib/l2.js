/*

*/
const version = "0.0.1"

const crypto = require('crypto')
const secp256k1 = require('secp256k1')

const bitcoin = require('bitcoinjs-lib')
const Web3 = require('web3');

const eth_util = require('ethereumjs-util')
const Tx = require('ethereumjs-tx')


class L2{

// net eth|btc|...
// opt net opts: address,provider
constructor(net, opt){
 this.net=net
 this.opt=opt

 switch(net){
 	case 'eth':
 		this.web3=new Web3();
		this.web3.setProvider(new web3.providers.HttpProvider(opt.provider)) 		 
 	break;
 	case 'btc': 
 	break;
 	default:throw  new Error('unsupported net '+net)
 }
}


// on-chain
// skA secret key A
// pkB publick key B
// ttl channel time to live
// mv min deposit value
channel_open(skA,pkB,ttl,mv){

}

channel_deposit(){

}

channel_close_start(){

}

channel_close_update(){

}

channel_close_finish(){

}

// off-chain

channel_transfer(){

}

}

module.exports = L2