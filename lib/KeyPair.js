var blake2b = require('blake2b');
var ed25519 = require('ed25519.js');

function  generateFromSeed (seed, addressIndex) {
    // generate blake2 hash 
    var output = new Uint8Array(32)
    var input = Buffer.from(seed + addressIndex);
    let blakeHash = blake2b(output.length).update(input).digest('hex');
    var privateKey = Buffer.from(blakeHash, 'hex');
    var publicKey = ed25519.derivePublicKey(privateKey)
    var keyPair = {
        publicKey,
        privateKey
    }
    // port of StandardAddress function.
    //   |    
    //   V
    // algo variable (ed25519 + 9 zero bytes)
    var Algorithm = "ed25519" + String(0x00).repeat(9);
    var buf = new Array(65).fill(0);
    // add algo variable to array
    for (var i = 0; i < Algorithm.length; i++) {
        buf[i + 1] = Algorithm.charCodeAt(i);
    }
    // add public key length to buffer
    buf[17] = keyPair.publicKey.length;
    // get public key hash as array with length 32
    var pubkeyHash = blake2b(32).update(buf).digest();

    const timelockhash = [
        0x51, 0x87, 0xb7, 0xa8, 0x02, 0x1b, 0xf4, 0xf2,
		0xc0, 0x04, 0xea, 0x3a, 0x54, 0xcf, 0xec, 0xe1,
		0x75, 0x4f, 0x11, 0xc7, 0x62, 0x4d, 0x23, 0x63,
		0xc7, 0xf4, 0xcf, 0x4f, 0xdd, 0xd1, 0x44, 0x1e
    ];
    const sigsrequiredHash = [
        0xb3, 0x60, 0x10, 0xeb, 0x28, 0x5c, 0x15, 0x4a,
		0x8c, 0xd6, 0x30, 0x84, 0xac, 0xbe, 0x7e, 0xac,
		0x0c, 0x4d, 0x62, 0x5a, 0xb4, 0xe1, 0xa7, 0x6e,
		0x62, 0x4a, 0x87, 0x98, 0xcb, 0x63, 0x49, 0x7b
    ];

    // merkle tree node prefix
    buf[0] = 0x01;
    // add timelock hash to buffer at position 1 (overwriting algo data)
    for (var i = 0; i < timelockhash.length; i++) {
        buf[i + 1] = timelockhash[i];
    }
    // fill out the rest of the buffer with the pubkey
    for (var i = 0; i < pubkeyHash.length; i++) {
        buf[i + 33] = pubkeyHash[i];
    }
    // tlpk hash as array with length 32
    var tlpkHash = blake2b(32).update(buf).digest();
    // populate buffer from posiiton 1 with tlpkhash
    for (var i = 0; i < tlpkHash.length; i++) {
        buf[i + 1] = tlpkHash[i];
    }
    // populate rest of buffer with sigsrequiredHash
    for (var i = 0; i < sigsrequiredHash.length; i++) {
        buf[i + 33] = sigsrequiredHash[i];
    }
    // encode address as array with length 32
    var address = blake2b(32).update(buf).digest();
    return address
}

module.exports =  {
    generateFromSeed
}