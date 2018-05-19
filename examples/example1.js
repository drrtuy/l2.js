const l2=require("../lib/l2.js")

const contract_address = "0x..."
const eth_provider = "http://localhost:8545"
const l2i=new l2('eth',{address:contract_address,provider:provider})
console.log("L2 example1")