var crypto = require('crypto')
var secp256k1 = require('secp256k1')

exports.json2buf=function(o){
	return Buffer.from(JSON.stringify(o),'utf8')
}

exports.buf2json=function(b){
	return JSON.Parse(b.toString('utf8'))
}


exports.sha256=function(m){
	return crypto.createHash('sha256').update(m, 'utf8').digest()
}

exports.sha512=function(m){
  return crypto.createHash('sha512').update(m, 'utf8').digest()
}

exports.sha256e=function(data, encoding) {
    return crypto.createHash('sha256').update(data).digest(encoding)
}
exports.sha512e=function(data, encoding) {
    return crypto.createHash('sha512').update(data).digest(encoding)
}



exports.readPassword=function(cb){
  var stdin = process.stdin,
      stdout = process.stdout;

  stdin.setRawMode(true);
  var password = "";
  stdin.on("data", function(c) {
    c = c + "";
    switch (c) {
      case "\n": case "\r": case "\u0004":
        stdin.setRawMode(false);
        stdin.pause();
        stdout.write("\n");
        //stdin.on("data",undefined);
        cb(password);
        break;
      case "\u0003":
        process.exit();
        break;
      default:
        password += c;
        break;
    }
  });
}



// https://github.com/chris-rock/node-crypto-examples/blob/master/crypto-buffer.js

/*
const algorithm = 'aes-256-ctr'

exports.aes_encrypt_buf=function(buf,pwd){
  var cipher = crypto.createCipher(algorithm,exports.sha256e(pwd))
  return Buffer.concat([cipher.update(buf),cipher.final()]);
}
 
exports.aes_decrypt_buf=function(buf,pwd){
  var decipher = crypto.createDecipher(algorithm,exports.sha256e(pwd))
  return Buffer.concat([decipher.update(buf) , decipher.final()]);
}
*/

// http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
exports.aes_encrypt_buf=function(buf,pwd){
  var iv = crypto.randomBytes(16);
  var cipher = crypto.createCipheriv('aes-256-cbc',exports.sha256e(pwd),iv)
  return Buffer.concat([iv,cipher.update(buf),cipher.final()]);
}
 
exports.aes_decrypt_buf=function(buf,pwd){
  var iv=buf.slice(0,16)
  var decipher = crypto.createDecipheriv('aes-256-cbc',exports.sha256e(pwd),iv)
  return Buffer.concat([decipher.update(buf.slice(16)) , decipher.final()]);
}


/*
exports.aes_encrypt_buf=function(text,pwd) {
 let iv = crypto.randomBytes(16);
 let cipher = crypto.createCipheriv('aes-256-cbc', exports.sha256e(pwd), iv);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return iv.toString('hex') + ':' + encrypted.toString('hex');
}
*/

exports.xor_buf=function(A,B){
  var C=crypto.randomBytes(32)
  for(var i=0;i<A.length;i++){
    C[i]=A[i]^B[i]
  }
  return C
}

exports.leftpad=function(s,n){
  if(n-s.length>0) return "0".repeat(n-s.length)+s
    else return s
}


exports.uuid=function(n){
  return crypto.randomBytes(n || 16).toString("hex")
}

exports.ck0x=function(s){
  if (s[0]=='0' && s[1]=='x') return s
  return '0x'+s  
}

exports.rm0x=function(s){
  if (s[0]=='0' && s[1]=='x') return s.substr(2)
  return s  
}