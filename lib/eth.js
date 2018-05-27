//const Web3 = require('web3');

const eth_util = require('ethereumjs-util')
const Tx = require('ethereumjs-tx')

const crypto = require('crypto')
const secp256k1 = require('secp256k1')

var utils = require('./utils')
var sig = require('./sig')

class EthRaw{ 

constructor(opt){
  //console.log('EthRaw',opt)
  this.web3=opt.web3
  this.opt=opt
  this.eth_contract=opt.web3.eth.contract(opt.abi)
}  

/*
 vA - value Float
 B - 2nd party address
 ttl -
 mv - gaz limit
 opt - everything else
 */
channel_open(vA,B,ttl,mv,opt){
  var web3=this.web3;

  if(opt && opt.sk){
      if(typeof(opt.sk)!=='Buffer')opt.sk=Buffer.from(opt.sk, 'hex')
      var pkA=secp256k1.publicKeyCreate(opt.sk).toString('hex')
      console.log('pkA',pkA,' ',pkA.length)
      pkA=utils.ck0x(pkA)
      var eaA='0x'+eth_util.pubToAddress(pkA,true).toString('hex')
      console.log('eaA',eaA)
      //console.log('pkB',pkB,' ',pkB.length)
      //pkB=utils.ck0x(pkB)
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

        console.log('tr count for A ' + web3.eth.getTransactionCount(eaA));


      var tx = new Tx({
        nonce: web3.toHex(web3.eth.getTransactionCount(eaA)),
        gasPrice: web3.toHex(web3.eth.gasPrice),
        gasLimit: web3.toHex(this.opt.gasLimit || 4000000),
        from: eaA,
        value: web3.toHex(value),
        data: this.eth_contract.new.getData(eaB,ttl,mv,{data: '0x'+this.opt.bin})
      });
      tx.sign(opt.sk);

      console.log('sendRawTransaction')
    return new Promise( (resolve, reject) => {
      web3.eth.sendRawTransaction('0x'+tx.serialize().toString('hex'), (err, hash)=> {
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
    var that=this;
    return new Promise( (resolve, reject) => {

    var instance = that.eth_contract.new(B,ttl,mv,
      {data: '0x'+that.opt.bin, from: that.web3.eth.accounts[0], value: value, gas: that.opt.gasLimit || 4000000},
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
  } // else

} // channel_open

channel_deposit(ch,value,opt){
  const web3=this.web3
  if(opt && opt.sk){
  if(typeof(opt.sk)!=='Buffer')opt.sk=Buffer.from(opt.sk, 'hex')
  var pk='0x'+secp256k1.publicKeyCreate(opt.sk).toString('hex')
  var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')

  ch = utils.ck0x(ch);
  value = web3.toWei(value, "ether");

  console.log('ch',ch)
  
  console.log('value',value)

  var tx = new Tx({
    nonce: web3.toHex(web3.eth.getTransactionCount(eth_addr)),
    gasPrice: web3.toHex(web3.eth.gasPrice),
    gasLimit: web3.toHex(this.opt.gasLimit || 4000000),
    to: ch,
    value: web3.toHex(value),
  });
  tx.sign(opt.sk);

  var that=this
  return new Promise( (resolve, reject) => {

  that.web3.eth.sendRawTransaction('0x'+tx.serialize().toString('hex'), (err, hash)=> {
  if(err)throw new Error(err)
  console.log('sendRawTransaction',err,hash) 
  var intObj=setInterval(function(){
  var receipt = that.web3.eth.getTransactionReceipt(hash);
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
    var that=this
    return new Promise( (resolve, reject) => {
    that.web3.eth.sendTransaction({to:utils.ck0x(ch), from:that.web3.eth.accounts[0], 
      value:that.web3.toWei(value, "ether")},function(err){
      if(err){console.log(err)}
        resolve()
    })
    }) // promise

  }

} // channel_deposit

channel_close_start(ch,opt){
 //console.log(this.web3);
 console.log('channel_close_start()');
 var web3=this.web3;

  //eth_contract,chan_addr,_value,ptx ??
  var tx=sig.sig(web3, this.eth_contract, ch, 0, opt)
  if(opt.sk){
      if(typeof(opt.sk)!=='Buffer')
        opt.sk=Buffer.from(opt.sk, 'hex')
      var pk='0x' + secp256k1.publicKeyCreate(opt.sk).toString('hex')
      var eth_addr='0x'+eth_util.pubToAddress(pk,true).toString('hex')
      ch = utils.ck0x(ch);

      console.log('channel_close_start')
      console.log('pk',pk)
      console.log('eth_addr',eth_addr)
      console.log('ch',ch)
      //console.log(tx);
      return new Promise( (resolve, reject) => {
      // Отправить tx с нужным вызовом
      /*
          var instance = this.eth_contract.at(ch);
          var id =
          var vA =
          var vB =
          instance.challengeStart(id,vA,vB, h,pi,v,r,s, {from: web3.eth.accounts[0], gas: 4000000},
            function (err, res){
              if(err) throw new Error(err);
              console.log('res',res)
              resolve(res)
          });
      */
      });

  }else{
  /*
    ch = utils.ck0x(ch);
    var instance = this.eth_contract.at(ch)
    return new Promise( (resolve, reject) => {
    //instance.challengeStart(id,vA,vB, h,pi,v,r,s, {from: web3.eth.accounts[0], gas: 4000000}, function (err, res){
    if(err) { reject(); }//throw new Error(err);
    //console.log('res',res)
    //resolve(res)
    })
    */
  } // promise
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

channel_info(){
  
}


} // EthRaw

module.exports = EthRaw
