var crypto = require('crypto')
var secp256k1 = require('secp256k1')
var util = require('util');
var fs = require("fs");

var eth_util = require('ethereumjs-util');
var keys = require('../lib/keys');
//var utils = require('../lib/utils');
//var enc = require('../lib/enc');


const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'key', type: String, defaultValue: "./keys/k0.json"},
  { name: 'pwd', type: String},
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
console.log("options:",options)

if("help" in options || !(options.key)){
  console.log("Usage: --key keys/k0.json")
  process.exit(0)
}


(async ()=>{
var acc=await keys.getFromEncFile(options.key,options.pwd)
console.log('priv',acc.priv.toString('hex'))
console.log('pub',acc.pub.toString('hex'))
console.log('eth_addr',eth_util.pubToAddress(acc.pub,true).toString('hex'))
})()

