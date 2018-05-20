var Web3 = require('web3');

var eth_util = require('ethereumjs-util')
var Tx = require('ethereumjs-tx')

var fs = require('fs')

var utils = require('../lib/utils')
var keys = require('../lib/keys')

// ganache-cli --account "0x636dd68e3788e5d935d3787cb3356ba30ef668a50c0777457be39a0aebefb451,10000000000000000000" --account "0xceaa875bac4fadac1c74543c9926d767b3f9c4dd096d49aa50e11cd94681910e,10000000000000000000" --account "0x04a2e6b0acec462900ad7ac0e2bd8eaf06cacdb1dad6d7c36a382337ca3cbd97,10000000000000000000"



const duration = {
  seconds: function(val) { return val},
  minutes: function(val) { return val * this.seconds(60) },
  hours:   function(val) { return val * this.minutes(60) },
  days:    function(val) { return val * this.hours(24) },
  weeks:   function(val) { return val * this.days(7) },
  years:   function(val) { return val * this.days(365)} 
};


var contractName = 'XPaymentChannel';

var abiFile = './eth/build/contracts_sol_'+contractName+'.abi';
var binFile = './eth/build/contracts_sol_'+contractName+'.bin';
var addrFile = contractName+'.address'


var abi = JSON.parse(fs.readFileSync(abiFile).toString());
var bin = fs.readFileSync(binFile).toString()



const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'key', type: String, defaultValue: "./keys/k0.json"},
  { name: 'pwd', type: String, defaultValue: "./keys/pwd"},
  { name: 'eth_provider', type: String, defaultValue: "http://localhost:8545"},
  { name: 'bob', type: String, defaultValue: "07b1032016aa26925049cedb2a3bd71fbb94a07b"},
  { name: 'ttl', type: Number, defaultValue: 3600},
] 
 

const commandLineArgs = require('command-line-args')
const opts = commandLineArgs(optionDefinitions)
console.log("options:",opts)

if("help" in opts || !opts.key){
  console.log("Usage: --key keys/k0.json --pwd keys/pwd --bob 029.. ")
  process.exit(0)
}

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(opts.eth_provider));

var contract = web3.eth.contract(abi);

(async ()=>{

//console.log('acc',acc)

acc=await keys.getFromEncFile(opts.key,opts.pwd)
pub_key=acc.pub.toString('hex')
eth_addr=eth_util.pubToAddress(acc.pub,true).toString('hex')
bob_addr=utils.ck0x(opts.bob)

console.log('priv (debug only view)',acc.priv.toString('hex'))
console.log('pub',pub_key)
console.log('eth_addr',eth_addr)
console.log('bob_addr',bob_addr)

var tx = new Tx({
    nonce: web3.toHex(web3.eth.getTransactionCount('0x'+eth_addr)),
    gasPrice: web3.toHex(web3.eth.gasPrice),
    gasLimit: web3.toHex(4000000),
    //from: MyAddr,
    value: '0x0',
    data: contract.new.getData({data: '0x'+bin})
});
tx.sign(acc.priv);

web3.eth.sendRawTransaction('0x'+tx.serialize().toString('hex'),function (err, hash) {
	if(err)throw new Error(err)
 	console.log('sendRawTransaction',err,hash) 
 	waitForAddress(hash,function(address){
 		console.log('address',address)
 		fs.writeFileSync(addrFile,address);
 	})
})

function waitForAddress(hash,cb){

var intObj=setInterval(function(){
	var receipt = web3.eth.getTransactionReceipt(hash);
	if(receipt){
		if('contractAddress' in receipt){
			clearInterval(intObj)
      console.log('receipt',receipt)
			cb(receipt.contractAddress)
			return
		} 
	}
	console.log('waiting receipt...');
},1000);

}

})()