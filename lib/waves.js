const crypto = require('crypto')
const secp256k1 = require('secp256k1')

var utils = require('./utils')

class WavesRaw{ 

constructor(opt){
  console.log('WavesRaw',opt)
  this.opt=opt
  
} 

channel_open(vA,B,ttl,mv,opt){

}

channel_deposit(ch,value,opt){

}

channel_close_start(ch,opt){

}

channel_close_update(ch,opt){

}

channel_close_finish(ch,opt){
	
}

}

module.exports = WavesRaw
