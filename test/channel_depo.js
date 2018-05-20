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
  { name: 'ch', type: String},
  { name: 'value', type: Number, defaultValue: 0.1},
] 
 

const commandLineArgs = require('command-line-args')
const opts = commandLineArgs(optionDefinitions)
console.log("options:",opts)

if("help" in opts || !opts.key){
  console.log("Usage: --key keys/k0.json --pwd keys/pwd --bob 029.. ")
  process.exit(0)
}

// node tes/channel_depo.js --key  keys/k0.json --pwd keys/pwd --ch 0x.. --value


//const ws = new WebSocket('ws://localhost:9000/ws')
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(opts.provider));


var eth_contractName = 'XPaymentChannel';
var eth_abiFile = './eth/build/contracts_sol_'+eth_contractName+'.abi';
//var eth_binFile = './eth/build/contracts_sol_'+eth_contractName+'.bin';
var addrFile = eth_contractName+'.address'

var eth_abi = JSON.parse(fs.readFileSync(eth_abiFile).toString());
//var eth_bin = fs.readFileSync(eth_binFile).toString()
//var eth_contract = web3.eth.contract(eth_abi);


const l2=new L2('eth',{provider:opts.eth_provider, web3:web3, abi:eth_abi})//, bin: eth_bin})

console.log("L2 deposit");

(async ()=>{


var ch=opts.ch
if(!ch){ch = fs.readFileSync(addrFile).toString()};

var v=opts.value
var res=await l2.channel_deposit(ch,v)
console.log('ch',ch)

})()