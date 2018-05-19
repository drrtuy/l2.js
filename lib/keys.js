var crypto = require('crypto')
var secp256k1 = require('secp256k1')
var fs = require("fs")
const readline = require('readline');

var utils = require('./utils')
var enc = require('./enc')

exports.genKeyPair=function(){

var privKey

do {
  privKey = crypto.randomBytes(32)
} while (!secp256k1.privateKeyVerify(privKey))

var pubKey = secp256k1.publicKeyCreate(privKey)

return {
	"priv" : privKey,
	"pub"  : pubKey
}

}

exports.genKeyPairSuggest=function(s){

var privKey = utils.sha256e(s)
if (!secp256k1.privateKeyVerify(privKey)) throw new Error('!secp256k1.privateKeyVerify(privKey)')

var pubKey = secp256k1.publicKeyCreate(privKey)

return {
	"priv" : privKey,
	"pub"  : pubKey
}

}


exports.toHex = function(kp){
return {
	"priv" : kp.priv.toString('hex'),
	"pub"  : kp.pub.toString('hex')
}
}

exports.fromHex = function(kp){
return {
	"priv" : Buffer.from(kp.priv, 'hex'),
	"pub" : Buffer.from(kp.pub, 'hex')	
}
}

/*
exports.check = function(kp){
if(!secp256k1.privateKeyVerify(kp.priv)){
	console.log("!secp256k1.privateKeyVerify",kp.priv)
	return false
}

var pub = secp256k1.publicKeyCreate(kp.priv)
//var address = account.pub_to_address(pub)
var address = eth_util.pubToAddress(pub,true)
if( Buffer.compare(address,kp.address) == 0){
	return true
}

return false
}
*/

exports.getFromEncFile = async function(fkeys,fpwd){

let p=new Promise( (resolve, reject) => { 

let kp_json
try{
  kp_json=JSON.parse(fs.readFileSync(fkeys).toString())
} catch(e){
  reject(e)
}


if (!kp_json){
  reject("No keys")
}



if(fpwd){
   let pwd=fs.readFileSync(fpwd).toString()
   let l=pwd.length
   let pb=Buffer.from(pwd)
   if(pb[l-1] == 10 || pb[l-1] == 13) pwd=pwd.slice(0,l-1)
   dopwd(pwd)
} else {
//    process.stdout.write("enter password:")
//    utils.readPassword(function(pwd){
//      dopwd(pwd)
//    })
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
//  rl.stdoutMuted = true;
  rl.question('enter password:', (pwd) => {
      rl.close();
      dopwd(pwd)
  })
  rl._writeToOutput = (s)=>{};

}

function dopwd(pwd){
  if (pwd.length<1){
    reject('empty password')
  }

  var priv = enc.fromV3(kp_json,pwd)
  if(!secp256k1.privateKeyVerify(priv)){
    reject('wrong keys/password')
  }
  var pub = secp256k1.publicKeyCreate(priv)

  if(pub.toString('hex')==kp_json.pub){
    resolve({priv:priv,pub:pub})
  } else {
    reject('pub compare error')
  }
}

}) // promise

return p

}