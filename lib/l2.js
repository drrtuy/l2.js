/*

L2 leyer two js lib

*/
const version = "0.0.1"

const Eth = require('./eth.js')
const Btc = require('./btc.js')
const Waves = require('./waves.js')

class L2{

// net eth|btc|...
// opt net opts: address,provider
constructor(net, opt){
 this.net=net || 'eth'
 this.opt=opt
 switch(net){
 	case 'eth':
		this.ch=new Eth(opt) 		 
 	break;
 	case 'btc':
 		this.ch=new Btc(opt) 
 	break;
 	case 'waves':
 		this.ch=new Waves(opt) 
 	break;
 	default:throw  new Error('unsupported net '+net)
 }

 
}


// on-chain

// B addr | publick key B
// ttl channel time to live
// mv min deposit value
// opt optional skA
channel_open(B,ttl,mv,opt){
	return this.ch.channel_open(B,ttl,mv,opt)
}


// skA|skB secret key to sign
// opt optional skA
channel_deposit(ch,value,opt){
	return this.ch.channel_deposit(ch,value,opt)

}


// ch channel id 
// opt channel options and optional sk
channel_close_start(ch,opt){
 	return this.ch.channel_close_start(ch,opt)
}

// update
channel_close_update(ch,opt){
	return this.ch.channel_close_update(ch,opt)
}

// close
// p penalty
channel_close_finish(ch,opt){
	return this.ch.channel_close_finish(ch,opt)
}

// withdraw if channel not used after ttl 
channel_withdraw(ch,opt){
	return this.ch.channel_withdraw(ch,opt)
}


// get channel state
channel_info(ch){
	return this.ch.channel_info(ch)
}

// off-chain

// ch channel id|addr
// to addr | pub key 
// value
// opt optional skFrom
channel_transfer(ch,to,value){
	return this.ch.channel_transfer(ch,to,value,opt)
}

}

module.exports = L2