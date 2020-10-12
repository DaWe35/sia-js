var blake2b = require('blake2b')
var nacl = require('tweetnacl')
var { publicKeyFromPrivateKey } = require('./KeyPair')
var BigNumber = require('bignumber.js')

const HASTINGS_TO_SC = '1000000000000000000000000'

function encodeTransaction (inputs_from_api, fee, senders_address, send_amount, receipient_address, private_key, callback) {
  var fee = (new BigNumber(fee * 10).times('100000000000000000000000')).toFixed()
  // init empty tx
  var transaction = { siacoinInputs: new Array(), siacoinOutputs: new Array(), minerFees: new Array(), transactionSignatures: new Array() }
  // get sum of input values
  var totalInputAmount = new BigNumber(0)
  // format inputs from siastats.info
  for (var i = 0; i < inputs_from_api.length; i++) {
    transaction.siacoinInputs.push({
      parentID: inputs_from_api[i].output,
      unlockConditions: {
        publicKeys: [`ed25519:${publicKeyFromPrivateKey(private_key)}`],
        signaturesRequired: 1
      }
    })
    // update total input value
    totalInputAmount = new BigNumber(totalInputAmount).plus(inputs_from_api[i].hastings)
    console.log(totalInputAmount.toFixed())
  }
  // add recipient output
  transaction.siacoinOutputs.push({
    value: (new BigNumber(send_amount).times(HASTINGS_TO_SC)).toFixed(),
    unlockHash: receipient_address
  })
  // add change output
  transaction.siacoinOutputs.push({
    // value: ().toString(),
    value: ((totalInputAmount.minus(new BigNumber(send_amount).times(HASTINGS_TO_SC)).minus(fee))).toFixed(),
    unlockHash: senders_address
  })
  // add miner fees
  transaction.minerFees.push(fee)
  // get keypair
  var keypair = nacl.sign.keyPair.fromSecretKey(Buffer.from(private_key, 'hex'))
  // add signatures
  for (var i = 0; i < inputs_from_api.length; i++) {
    transaction.transactionSignatures.push({
      parentID: inputs_from_api[i].output,
      publicKeyIndex: 0,
      coveredFields: { wholeTransaction: true },
      signature: Buffer.from(nacl.sign.detached(sigHash(transaction, inputs_from_api[i].output, 0, 0), keypair.secretKey)).toString('base64')
    })
  }

  callback(transaction)
}

function sigHash (txn, parentID, keyIndex, timelock) {
  return blake2b(32).update(Buffer.concat([
    encodeInt(txn.siacoinInputs.length),
    ...txn.siacoinInputs.map(encodeInput),
    encodeInt(txn.siacoinOutputs.length),
    ...txn.siacoinOutputs.map(encodeOutput),
    encodeInt(0), // fileContracts
    encodeInt(0), // fileContractRevisions
    encodeInt(0), // storageProofs
    encodeInt(0), // siafundInputs
    encodeInt(0), // siafundOutputs
    encodeInt(txn.minerFees.length),
    ...txn.minerFees.map(encodeCurrency),
    encodeInt(0), // arbitraryData

    // signature metadata
    Buffer.from(parentID, 'hex'),
    encodeInt(keyIndex),
    encodeInt(timelock)
  ])).digest()
}

function encodeOutput (output) {
  return Buffer.concat([
    encodeCurrency(output.value),
    Buffer.from(output.unlockHash, 'hex').slice(0, 32)
  ])
}

function encodeInput (input) {
  return Buffer.concat([
    Buffer.alloc(1), // ASIC hardfork replay protection prefix
    Buffer.from(input.parentID, 'hex'),
    encodeUnlockConditions(input.unlockConditions)
  ])
}

function encodeUnlockConditions (uc) {
  return Buffer.concat([
    encodeInt(uc.timelock),
    encodeInt(uc.publicKeys.length),
    ...uc.publicKeys.map(encodePublicKey),
    encodeInt(uc.signaturesRequired)
  ])
};

function encodePublicKey (pk) {
  var [alg, key] = pk.split(':')
  var algBuf = Buffer.alloc(16)
  algBuf.write(alg)
  return Buffer.concat([
    algBuf,
    encodeInt(key.length / 2),
    Buffer.from(key, 'hex')
  ])
}

function encodeCurrency (c) {
  var hex = new BigNumber(c).toString(16)
  if (hex === '0') {
    hex = ''
  } else if (hex.length % 2 != 0) {
    hex = '0' + hex
  }
  return Buffer.concat([
    encodeInt(hex.length / 2),
    Buffer.from(hex, 'hex')
  ])
}

function encodeInt (n) {
  var buf = Buffer.alloc(8)
  buf.writeInt32LE(n)
  return buf
}

module.exports = {
  encodeTransaction
}
