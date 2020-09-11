function encodeTransaction (inputs, outputs, fee) {
    var encodedInputs = encodeInputs(inputs);
}

function encodeInputs (inputArr) {
    var inputLength = encodeInt(inputArr.length);
    // loop through each input
    inputArr.forEach(input => {
        var parentId = Buffer.from(input.parentID, 'hex');
        // unlock conditions
        var pubKeyArrayLength = encodeInt(input.unlockConditions.publicKeys.length);
        var algo = input.unlockConditions.publicKeys[0].slice(0, input.unlockConditions.publicKeys[0].indexOf(':'));
        var algo_padded = algo + '0'.repeat(16 - algo.length);
        var hexDecoded
    })
}

function encodeInt(n) {
    var buf = Buffer.alloc(8);
    buf.writeInt32LE(n);
    return buf;
  }
  

module.exports = {
    encodeTransaction
}

/*function encodeInt(n) {
    var buf = Buffer.alloc(8);
    buf.writeInt32LE(n);
    return buf;
  }
  
  function encodeCurrency(c) {
    var hex = BigInt(c).toString(16);
    if (hex === "0") {
      hex = ""
    } else if (hex.length % 2 != 0) {
      hex = "0" + hex
    }
    return Buffer.concat([
      encodeInt(hex.length / 2),
      Buffer.from(hex, 'hex')
    ])
  }
  
  function encodePublicKey(pk) {
    var [alg, key] = pk.split(':');
    var algBuf = Buffer.alloc(16);
    algBuf.write(alg);
    return Buffer.concat([
      algBuf,
      encodeInt(key.length / 2),
      Buffer.from(key, 'hex')
    ]);
  }
  
  function encodeUnlockConditions(uc) {
    return Buffer.concat([
      encodeInt(uc.timelock),
      encodeInt(uc.publicKeys.length),
      ...uc.publicKeys.map(encodePublicKey),
      encodeInt(uc.signaturesRequired)
    ])
  };
  
  function encodeInput(input) {
    return Buffer.concat([
      Buffer.alloc(1), // ASIC hardfork replay protection prefix
      Buffer.from(input.parentID, 'hex'),
      encodeUnlockConditions(input.unlockConditions)
    ]);
  }
  
  function encodeOutput(output) {
    return Buffer.concat([
      encodeCurrency(output.value),
      Buffer.from(output.unlockHash, 'hex').slice(0, 32)
    ]);
  }
  
  function sigHash(txn, parentID, keyIndex, timelock) {
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
    ])).digest('hex')
  }
  
  var txn = {
    "siacoinInputs": [
      {
        "parentID": "b8c63a8f435bfff7bf8c1f6c7ece0066599fa4e08cb74ab5929e84b014e408c8",
        "unlockConditions": {
          "publicKeys": [ "ed25519:8408ad8d5e7f605995bdf9ab13e5c0d84fbe1fc610c141e0578c7d26d5cfee75" ],
          "signaturesRequired": 1
        }
      }
    ],
    "siacoinOutputs": [
      {
        "value": "10000000000000000000000000000",
        "unlockHash": "5ac6af95fe284b4bbb0110ef51d3c90f3e9ea37586352ec83bad569230bad7f37a452c0a2a2f"
      },
      {
        "value": "100000000000000000000000000000",
        "unlockHash": "df1b42c80b5f7a67331893fde0923a5071d6d7dff4c78baec547cf5ca4d314a1d78b6b1c8d42"
      }
    ],
    "minerFees": [ "13000000000000000000000000000" ]
  }
  
  var parentID = "b8c63a8f435bfff7bf8c1f6c7ece0066599fa4e08cb74ab5929e84b014e408c8"
  var keyIndex = 0
  var timelock = 0
  
  console.log("txnsig", sigHash(txn, parentID, keyIndex, timelock))*/