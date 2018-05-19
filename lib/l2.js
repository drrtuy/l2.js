/*

*/
const version = "0.0.1"

const crypto = require('crypto')
const secp256k1 = require('secp256k1')

var bitcoin = require('bitcoinjs-lib')

var eth_util = require('ethereumjs-util')
var Tx = require('ethereumjs-tx')


class L2{

constructor(){

}


// on-chain
channel_open(){

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