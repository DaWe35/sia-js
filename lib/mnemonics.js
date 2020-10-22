const {EnglishUniquePrefixLen, dictionary} = require('./EnglishDictionary');
var BigNumber = require('bignumber.js');

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

module.exports = {
    mnemonicToBytes
}