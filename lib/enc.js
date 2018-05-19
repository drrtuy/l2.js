var crypto = require('crypto')
var scrypt = require('scryptsy');
//var uuid = require('uuid');
var ethUtil = require('ethereumjs-util')
var uuidv4 = require('uuid/v4')
//var Buffer = require('safe-buffer').Buffer

var assert=function (val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed')
  }
}

exports.toV3 = function (password, text, opts) {
  assert(typeof password === 'string')

  var pwd=Buffer.from(password)

  opts = opts || {}
  var salt = opts.salt || crypto.randomBytes(32)
  var iv = opts.iv || crypto.randomBytes(16)

  var derivedKey
  var kdf = opts.kdf || 'scrypt'
  var kdfparams = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }

  if (kdf === 'pbkdf2') {
    kdfparams.c = opts.c || 262144
    kdfparams.prf = 'hmac-sha256'
    derivedKey = crypto.pbkdf2Sync(pwd, salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else if (kdf === 'scrypt') {
    // FIXME: support progress reporting callback
    kdfparams.n = opts.n || 262144
    kdfparams.r = opts.r || 8
    kdfparams.p = opts.p || 1
    derivedKey = scrypt(pwd, salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf')
  }

  var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  var ciphertext = Buffer.concat([ cipher.update(text), cipher.final() ])

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex') ]))

  return {
    version: 3,
    id: uuidv4({ random: opts.uuid || crypto.randomBytes(16) }),
//    address: this.getAddress().toString('hex'),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: opts.cipher || 'aes-128-ctr',
      kdf: kdf,
      kdfparams: kdfparams,
      mac: mac.toString('hex')
    }
  }
}

exports.fromV3 = function (input, password, nonStrict) {
  assert(typeof password === 'string')
  var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)

  if (json.version !== 3) {
    throw new Error('Not a V3 wallet')
  }

  var derivedKey
  var kdfparams
  if (json.crypto.kdf === 'scrypt') {
    kdfparams = json.crypto.kdfparams

    // FIXME: support progress reporting callback
    derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else if (json.crypto.kdf === 'pbkdf2') {
    kdfparams = json.crypto.kdfparams

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2')
    }

    derivedKey = crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
  } else {
    throw new Error('Unsupported key derivation scheme')
  }

  var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), ciphertext ]))
  if (mac.toString('hex') !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'))
  var text=Buffer.concat([decipher.update(ciphertext), decipher.final()])   

  return text
}

