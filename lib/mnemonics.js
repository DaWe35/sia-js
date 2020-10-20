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
	return result.toString(16);
}

function fromMnemonic (mnemonic) {
    if (mnemonic.split(' ').length !== 28) return 'Invalid mnemonic length';
    
    var intEntropy = phraseToInt(mnemonic);
    if (!intEntropy) return 'Invalid mnemonic';
    var buf = Buffer.from(intEntropy, 'hex');
    return Uint8Array.from(buf).reverse();

}

module.exports = {
    fromMnemonic
}