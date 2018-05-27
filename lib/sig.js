const crypto = require('crypto')
const secp256k1 = require('secp256k1')
const utils = require('./utils.js');
const eth_util = require('ethereumjs-util')

/*
 * Signs the offchain state from the point of view of the channel partner/-s
 * web3 inst
 * contract address
 * value in ether
 * opt that could contain sk
 * ptx description of the state, signed by the partner/-s ???
 */
function sig(web3, eth_contract,chan_addr,_value,opt, ptx){

//var chan_addr = cmda[2]
//var _value = parseFloat(cmda[3])

 var value = web3.toWei(_value, "ether");

 console.log('chan_addr',chan_addr)
 console.log('value',value)

 var instance = eth_contract.at(chan_addr)

 var A=utils.rm0x(instance.A())
 var B=utils.rm0x(instance.B())

/*
 var ch
 try{
  var chs=await db.get('ch~'+chan_addr)
  ch=JSON.parse(chs.toString())
 }catch(e){
  console.log('no such chan',chan_addr)
  return
 }
  console.log('ch',ch)

 var ptx
 try{
  var ptxs=await db.get('tx~'+chan_addr)
  console.log('ptxs',ptxs)
  ptx=JSON.parse(ptxs.toString())
 }catch(e){
  let vA=instance.valueX('0x'+A)
  let vB=instance.valueX('0x'+B)
  console.log('>>>vA,vB',vA.toString(),vB.toString())
  ptx={ id:0,A:A,B:B,vA:vA,vB:vB }
 }
*/
console.log('ptx',ptx)

var vA;
var vB;
var PrAddr;


if(ptx){

if(A==eth_addr){ vA=ptx.vA.sub(value);vB=ptx.vB.add(value); PrAddr=B;}
else if(B==eth_addr){ vA=ptx.vA.add(value);vB=ptx.vB.sub(value); PrAddr=A;}
else {
  console.log("A!=eth_addr || B!=eth_addr")
  return
}

} else{
  console.log('A' + A);
  console.log('B' + B);
  let vA=instance.valueX('0x'+A)
  let vB=instance.valueX('0x'+B)
  console.log('>>>vA,vB',vA.toString(),vB.toString())
//  console.log('vA',vA.toString())
//  console.log('vB',vB.toString())
  ptx={ id:0,A:A,B:B,vA:vA,vB:vB }; // there is no ptx, so the first tx
  // hardcoded Bob addr as PrAddr
  PrAddr = web3.eth.accounts[1];
  //ptx = {};

}

vA = ptx.vA;
vB = ptx.vB;

let pi=crypto.randomBytes(32)
let h = eth_util.sha3(new Buffer(pi,'hex'))
let h_hex = h.toString('hex')
let pi_hex = pi.toString('hex')


var id=ptx.id+1; // uint32 bytes4
var vA_hex = utils.leftpad(web3.toHex(vA).substr(2), 64)
var vB_hex = utils.leftpad(web3.toHex(vB).substr(2), 64)
var id_hex = utils.leftpad(web3.toHex(id).substr(2), 8)

let msg = chan_addr
+PrAddr
+id_hex
+vA_hex
+vB_hex
+h_hex;

console.log('msg',msg)

let hash = eth_util.sha3(new Buffer(msg,'hex'))
let hash_hex = '0x'+hash.toString('hex')

console.log('hash',hash_hex);

var sig = secp256k1.sign(hash, new Buffer(opt.sk, 'hex'));

let r = sig.signature.slice(0, 32).toString('hex');
let s = sig.signature.slice(32, 64).toString('hex');
let v = sig.recovery + 27;

let tx={
  id:id,
  A:ptx.A,B:ptx.B,
  from:web3.eth.accounts[0], // The sender is the one with the sk?
  h:h_hex,
  pi:pi_hex,
  value:value,
  vA:vA.toString(),
  vB:vB.toString(),
  v:v,r:r,s:s
}

console.log('tx',tx)

return tx
}

module.exports = {
  sig:sig
}