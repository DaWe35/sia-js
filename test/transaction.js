var sia = require('../lib');

var inputs = [
    {
        parentID: 'b8c63a8f435bfff7bf8c1f6c7ece0066599fa4e08cb74ab5929e84b014e408c8',
        unlockConditions: {
            publicKeys: [ 'ed25519:8408ad8d5e7f605995bdf9ab13e5c0d84fbe1fc610c141e0578c7d26d5cfee75' ],
            signaturesRequired: 1
        }
    }
]

var outputs = [
    // destination
    {
        value: 100000,
        unlockHash: '5ac6af95fe284b4bbb0110ef51d3c90f3e9ea37586352ec83bad569230bad7f37a452c0a2a2f'
    },
    // change (users address)
    {
        value: 100000,
        unlockHash: 'df1b42c80b5f7a67331893fde0923a5071d6d7dff4c78baec547cf5ca4d314a1d78b6b1c8d42'
    }
]

var fee = 13000;

var transaction = sia.transction.encodeTransaction(inputs, outputs, fee);