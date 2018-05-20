
var fs = require('fs')

var utils = require('../lib/utils')
var keys = require('../lib/keys')


var contractName = 'XPaymentChannel';

var abiFile = './eth/build/contracts_sol_'+contractName+'.abi';
var binFile = './eth/build/contracts_sol_'+contractName+'.bin';
var addrFile = contractName+'.address'


var abi = JSON.parse(fs.readFileSync(abiFile).toString());
var bin = fs.readFileSync(binFile).toString()


fs.writeFileSync('./eth/ethdata.json',JSON.stringify({abi:abi,bin:bin}));


