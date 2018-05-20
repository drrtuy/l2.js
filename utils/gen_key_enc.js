var crypto = require('crypto')
var secp256k1 = require('secp256k1')
var util = require('util');

var keys = require('../lib/keys');
//var acc = require('../lib/account');
var utils = require('../lib/utils');
var enc = require('../lib/enc');
var eth_util = require('ethereumjs-util');

var fs = require("fs");

if (process.argv.length<3){
	console.log("usage: node gen_keypair.js keypair.json")
	process.exit(0)
}

process.stdout.write("enter password:");

utils.readPassword(function(pwd){

if (pwd.length<1){
	console.log("wrong password")
	process.exit(0)	
}

var kp=keys.genKeyPair()

console.log('priv (debug only)',kp.priv.toString('hex'))


var kp_enc_json=enc.toV3(pwd,kp.priv,{n:1024})
kp_enc_json.pub=kp.pub.toString('hex')
kp_enc_json.date=new Date().toISOString()
kp_enc_json.eth_addr=eth_util.pubToAddress(kp.pub,true).toString('hex')


var fileName = process.argv[2]
fs.writeFileSync(fileName,JSON.stringify(kp_enc_json, null, ' '));

process.exit(0)

})

