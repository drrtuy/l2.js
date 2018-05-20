const L2=require("../lib/l2.js")

const Web3 = require('web3')

const WebSocket = require('ws')

const events = require('events')
const em = new events.EventEmitter()

const eth_util = require('ethereumjs-util')

const keys = require('../lib/keys')
const utils = require('../lib/utils')

const fs = require('fs')

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'key', type: String, defaultValue: "./keys/k0.json"},
  { name: 'pwd', type: String, defaultValue: "./keys/pwd"},
  { name: 'eth_provider', type: String, defaultValue: "http://localhost:8545"},
  { name: 'B', type: String, defaultValue: "07b1032016aa26925049cedb2a3bd71fbb94a07b"},
  { name: 'gw', type: String, defaultValue: "http://localhost:9000"},
  { name: 'value', type: Number, defaultValue: 1.1},
] 
 

const commandLineArgs = require('command-line-args')
const opts = commandLineArgs(optionDefinitions)
console.log("options:",opts)

if("help" in opts || !opts.key){
  console.log("Usage: --key keys/k0.json --pwd keys/pwd --bob 029.. ")
  process.exit(0)
}

// node examples/example1.js --key  keys/k0.json --pwd keys/pwd --bob 0278a1dcad673628874a1cc1f310bde790070d776abd08880e66222860c428d8fc


//const ws = new WebSocket('ws://localhost:9000/ws')
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(opts.provider));


var eth_contractName = 'XPaymentChannel';
var eth_abiFile = './eth/build/contracts_sol_'+eth_contractName+'.abi';
var eth_binFile = './eth/build/contracts_sol_'+eth_contractName+'.bin';
var addrFile = eth_contractName+'.address'

var eth_abi = JSON.parse(fs.readFileSync(eth_abiFile).toString());
var eth_bin = fs.readFileSync(eth_binFile).toString()
//var eth_contract = web3.eth.contract(eth_abi);


const l2=new L2('eth',{web3:web3, abi:eth_abi, bin: eth_bin})

console.log("L2 deploy")

var acc
var pub_key
var eth_addr


(async ()=>{

//console.log('acc',acc)
/*
acc=await keys.getFromEncFile(opts.key,opts.pwd)
pub_key=acc.pub.toString('hex')
eth_addr=eth_util.pubToAddress(acc.pub,true).toString('hex')
console.log('priv (debug only view)',acc.priv.toString('hex'))
console.log('pub',pub_key)
console.log('eth_addr',eth_addr)
var skA=acc.priv
*/
var B=opts.B
var v=opts.value
//var address=fs.readFileSync(addrFile).toString()
var ch=await l2.channel_open(v,B,3600,0)
console.log('ch',ch)
//if(ch)fs.writeFileSync(addrFile,ch);

})()