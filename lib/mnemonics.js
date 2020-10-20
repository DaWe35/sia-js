const {EnglishUniquePrefixLen, dictionary} = require('./EnglishDictionary');
var BigNumber = require('bignumber.js')

function phraseToInt (phrase) {
    let result = new BigNumber(-1);
	phrase.split(" ").forEach((word, i) => {
		let index = dictionary.findIndex(w => w.startsWith(word.substr(0, EnglishUniquePrefixLen)));
		if (index === -1) return false;
        let increase = new BigNumber(index + 1).times(1626 ** i);
        result = result.plus(increase);
  })
	return result.toFixed();
}

function fromMnemonic (mnemonic) {
    if (mnemonic.split(' ').length !== 28) return 'Invalid mnemonic length';
    
    var intEntropy = phraseToInt(mnemonic);
    if (!intEntropy) return 'Invalid mnemonic';
    console.log(intEntropy)

}

module.exports = {
    fromMnemonic
}