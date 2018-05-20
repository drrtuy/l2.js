const Web3 = require('web3');

const eth_util = require('ethereumjs-util')
const Tx = require('ethereumjs-tx')

const crypto = require('crypto')
const secp256k1 = require('secp256k1')

var utils = require('./utils')

class EthRaw{ 

constructor(opt){
  console.log('EthRaw',opt)
  this.web3=opt.web3
  this.opt=opt
  this.eth_contract=opt.web3.eth.contract(opt.abi)
  this.channels={}

}  

channel_open(vA,B,ttl,mv,opt){
  const web3=this.web3
  if(opt && opt.sk){
  var pkA=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  console.log('pkA',pkA,' ',pkA.length)
  pkA=utils.ck0x(pkA)
  var eaA='0x'+eth_util.pubToAddress(pkA,true).toString('hex')
  console.log('eaA',eaA)
  console.log('pkB',pkB,' ',pkB.length)
  pkB=utils.ck0x(pkB)
  var eaB=B //'0x'+eth_util.pubToAddress(pkB,true).toString('hex')
  var value = web3.toWei(vA, "ether")
  var ttl=web3.toHex(ttl || 3600)
  var mv = web3.toWei(mv, "ether")

  console.log('pkA',pkA)
  console.log('eaA',eaA)
  console.log('eaB',eaB)
  console.log('mv',mv)
  console.log('value',value)
  console.log('ttl',ttl)

  var tx = new Tx({
    nonce: web3.toHex(web3.eth.getTransactionCount('0x'+eaA)),
    gasPrice: web3.toHex(web3.eth.gasPrice),
    gasLimit: web3.toHex(this.opt.gasLimit || 4000000),
    from: eaA,
    value: web3.toHex(value),
    data: this.eth_contract.new.getData(eaB,ttl,mv,{data: '0x'+this.opt.bin})
  });
  tx.sign(skA);

  console.log('sendRawTransaction')
return new Promise( (resolve, reject) => {
  web3.eth.sendRawTransaction('0x'+tx.serialize().toString('hex'),async (err, hash)=> {
  if(err)throw new Error(err)
  console.log('sendRawTransaction',err,hash) 
  var intObj=setInterval(function(){
  var receipt = web3.eth.getTransactionReceipt(hash);
  if(receipt){
    if('contractAddress' in receipt){
      clearInterval(intObj)
      console.log('contractAddress',receipt.contractAddress)
      resolve(receipt.contractAddress)
    } 
  }
  console.log('waiting receipt...');
  },1000);

  }) 
  }) // promise

  }else{
    // web3 account must be unlocked
    //var contract = web3.eth.contract(this.opt.abi)

    var B=utils.ck0x(B) //'0x'+eth_util.pubToAddress(pkB,true).toString('hex')
    var value = web3.toWei(vA, "ether")
    //var ttl=web3.toHex(ttl || 3600)
    var mv = web3.toWei(mv, "ether")

    console.log('B',B)
    console.log('value',value)

    return new Promise( (resolve, reject) => {

    var instance = this.eth_contract.new(B,ttl,mv,
      {data: '0x'+this.opt.bin, from: web3.eth.accounts[0], value: value, gas: this.opt.gasLimit || 4000000},
      function(err, myContract){
        if(err) {
        console.log(err);
        reject();
        return
        }
        //console.log(myContract)
        var intObj=setInterval(function(){
  var receipt = web3.eth.getTransactionReceipt(myContract.transactionHash);
  if(receipt){
    if('contractAddress' in receipt){
      clearInterval(intObj)
      console.log('contractAddress',receipt.contractAddress)
      resolve(receipt.contractAddress)
    } 
  }
  console.log('waiting receipt...');
  },1000);
        
      });
    //console.log('instance',instance)
    }) // promise
  }

} // channel_open

channel_deposit(ch,value,opt){
  const web3=this.web3
  if(opt.sk){

  var pk=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')

  ch = utils.ck0x(ch);
  value = web3.toWei(value, "ether");

  console.log('ch_addr',ch_addr)
  console.log('eth_addr',eth_addr)
  console.log('value',value)

  var tx = new Tx({
    nonce: web3.toHex(web3.eth.getTransactionCount('0x'+eth_addr)),
    gasPrice: web3.toHex(web3.eth.gasPrice),
    gasLimit: web3.toHex(this.opt.gasLimit || 4000000),
    to: ch,
    value: web3.toHex(value),
  });
  tx.sign(sk);

  return new Promise( (resolve, reject) => {

  web3.eth.sendRawTransaction('0x'+tx.serialize().toString('hex'),async (err, hash)=> {
  if(err)throw new Error(err)
  console.log('sendRawTransaction',err,hash) 
  var intObj=setInterval(function(){
  var receipt = web3.eth.getTransactionReceipt(hash);
  if(receipt){
      clearInterval(intObj)
      console.log('receipt',receipt)
      resolve()
      return
  }
  console.log('waiting receipt...');
  },1000);

  })
  }) // promise
  } else {
    //var instance = this.eth_contract.at(ch)
    //instance.depositFunds({from: web3.eth.accounts[0], gas: this.opt.gasLimit || 4000000, value: value}, 
    //  function(err, res){});
    return new Promise( (resolve, reject) => {
    web3.sendTransaction({to:utils.ck0x(ch), from:web3.eth.accounts[0], 
      value:web3.toWei(value, "ether")},function(err){
      if(err){console.log(err)}
        resolve()
    })
    }) // promise

  }

} // channel_deposit

channel_close_start(ch,opt){
 const web3=this.web3
  if(opt.sk){  
  var pk=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')
  ch = utils.ck0x(ch);

  console.log('channel_close_start')
  console.log('pk',pk)
  console.log('eth_addr',eth_addr)
  console.log('ch',ch)
  }else{


  }
} // channel_close_start

channel_close_update(ch,opt){
const web3=this.web3
  if(opt.sk){  

  var pk=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')
  ch = utils.ck0x(ch);

  console.log('channel_close_update')
  console.log('pk',pk)
  console.log('eth_addr',eth_addr)
  console.log('ch',ch)
  } else{


  } //else
} // channel_close_update

channel_close_finish(ch,opt){
const web3=this.web3
  if(opt.sk){  
  var pk=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')
  ch = utils.ck0x(ch);
  console.log('channel_close_finish')
  console.log('pk',pk)
  console.log('eth_addr',eth_addr)
  console.log('ch',ch)
  } else {


  } // else
} // channel_close_finish

channel_withdraw(ch,opt){
const web3=this.web3
  if(opt.sk){  
  var pk=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')
  ch = utils.ck0x(ch);

  console.log('channel_withdraw')
  console.log('pk',pk)
  console.log('eth_addr',eth_addr)
  console.log('ch',ch)  
  } else {


  }
} // channel_withdraw


// off chain
channel_transfer(ch,to,value,opt){
  if(opt.sk){  
  var pkFrom=secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var ethFrom='0x'+eth_util.pubToAddress(pkFrom,true).toString('hex')
  var ethTo='0x'+eth_util.pubToAddress(to,true).toString('hex')
  ch = utils.ck0x(ch);

  console.log('channel_transfer')
  console.log('pkFrom',pkFrom)
  console.log('ethFrom',ethFrom)
  console.log('ethTo',ethTo)
  console.log('ch',ch)
  } else {

  }

} // channel_transfer

} // EthRaw

module.exports = EthRaw
