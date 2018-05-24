
const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'key', type: String, defaultValue: "./keys/Alice.hex"},
  { name: 'provider', type: String, defaultValue: "http://localhost:8545"},
  { name: 'value', type: Number, defaultValue: 2.0},
  { name: 'gaz_limit', type: Number, defaultValue: 1.0},
  { name: 'ttl', type: Number, defaultValue: 3600},
  { name: 'contract', type: String, defaultValue: '0xbeef'},
  { name: 'Bob', type: String, defaultValue: 'ceaa875bac4fadac1c74543c9926d767b3f9c4dd096d49aa50e11cd94681910e'},
  { name: 'bob_address', type: String, defaultValue: '0xed78c89ac96c13b28c0d40e06fe1884ef68cdac9'},
  { name: 'Alice', type: String, defaultValue: '636dd68e3788e5d935d3787cb3356ba30ef668a50c0777457be39a0aebefb451'}
]

const commandLineArgs = require('command-line-args')
const opts = commandLineArgs(optionDefinitions, {partial: true});


const l2=require("../lib/l2.js");
const Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(opts.provider))

const l2i=new l2('eth',{address:opts.contract,provider:opts.provider, web3: web3});

console.log("L2 example1");

// channel_open returns promice, so switch to then
l2i.channel_open(opts.value,
    opts.bob_address,
    opts.ttl,
    opts.gaz_limit,
    {sk: opts.Alice}
).then( contractAddr => {
    console.log(contractAddr);
    l2i.channel_deposit(contractAddr, opts.value,{sk: opts.Alice});
}).then(function() {
    // make offline trx
}).then(x => {
    // try to close
});





