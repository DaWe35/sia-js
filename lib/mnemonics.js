const {EnglishUniquePrefixLen, dictionary} = require('./EnglishDictionary');
const BigNumber = require('bignumber.js');
const blake2b = require('blake2b')

const DICTIONARY_SIZE = 1626;

function phraseToInt (phrase) {
    let result = new BigNumber(-1);
	phrase.split(" ").forEach((word, i) => {
		let index = dictionary.findIndex(w => w.startsWith(word.substr(0, EnglishUniquePrefixLen)));
        if (index === -1) return false;
        let exp = new BigNumber(DICTIONARY_SIZE).pow(i);
        let increase = new BigNumber(index + 1).times(exp);
        result = result.plus(increase);
  })
	return result;
}

function intToBytes (i) {
    let buf = []
    while (i >= 256) {
        buf.push(i.mod(256).toNumber())
        i = i.minus(256)
        i = i.idiv(256)
    }
    buf.push(i.mod(256).toNumber())
    return Uint8Array.from(buf)
}

function mnemonicToBytes (mnemonic) {
    if (mnemonic.split(' ').length !== 28 && mnemonic.split(' ').length !== 29) return 'Invalid mnemonic length';
    
    var intEntropy = phraseToInt(mnemonic);
    if (!intEntropy) return 'Invalid mnemonic';
    
    var bytes = intToBytes(intEntropy).slice(0,32);
    return bytes

}



// SeedToString converts a wallet seed to a human friendly string. (StringToSeed() in wallet.go)
function bytesToMnemonic (bytes) {
    // console.log(typeof bytes)
    var fullChecksum = blake2b(32).update(bytes).digest()
    console.log('fullChecksum', "[" + fullChecksum.join(' ') + "]")
    var checksumSeed = Uint8Array.from([...bytes, ...fullChecksum.slice(0,6)])
    console.log('checksumSeed', "[" + checksumSeed.join(' ') + "]")
	var phrase = toPhrase(checksumSeed)
	return phrase.join(' ')
}

function toPhrase (entropy) {
	if (entropy.length == 0) {
		return false
	}
    var intEntropy = bytesToInt(entropy)
    console.log("intEntropy ", intEntropy.toFixed())
	return intToPhrase(intEntropy)
}

function bytesToInt (bs) {
    let exp = new BigNumber(1)
    let result = new BigNumber(-1)
	for (var i = 0; i < bs.length; i++) {
		var tmp = new BigNumber(bs[i])
		tmp = tmp.plus(1)
        tmp = tmp.multipliedBy(exp)
        exp = exp.multipliedBy(256)
		result = result.plus(tmp)
	}
	return result
}



// intToPhrase converts a phrase into a big.Int, working in a fashion similar
// to bytesToInt.
function intToPhrase (bi) {
    // Determine which dictionary to use based on the input
    const base = new BigNumber(DICTIONARY_SIZE)
    var result = []
	while (bi.isGreaterThanOrEqualTo(DICTIONARY_SIZE)) {
        var i = bi.modulo(DICTIONARY_SIZE)
		result.push(dictionary[parseInt(i)])
		bi = bi.minus(DICTIONARY_SIZE)
		bi = bi.dividedBy(DICTIONARY_SIZE)
	}
    result.push(dictionary[parseInt(bi)])
	return result
}



module.exports = {
    mnemonicToBytes, bytesToInt, intToBytes, bytesToMnemonic
}