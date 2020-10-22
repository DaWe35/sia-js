# sia-js
nodejs lib for siacoin functions

## Usage
### Import Lib
```js
var Sia = require('sia-js');
```
### Key Derivation
#### Generate secure random seed
```js
var randomData = sia.keyPair.generateRandomData()
```
#### From Seed
```js
var keyPair = Sia.keyPair.generateFromSeed('seed string');
```
#### From Private Key
```js
var keyPair = Sia.keyPair.deriveAddress('cbfaced5375c679a1181be27b7530a1c77dcf6a2b2c0c14ac9c62ce5d7fdf5e6e60400f316b823195c6f4f996cfa04827499b2d3d48e0bf8b711a32c653f59a0');
```
#### Example response:
```
{
  address: '91948070704e646adb8ce40655df31e9a0a157cffaabd3776a67c6ebedb00c6e5144bb726fda',
  publicKey: 'e60400f316b823195c6f4f996cfa04827499b2d3d48e0bf8b711a32c653f59a0',
  privateKey: 'cbfaced5375c679a1181be27b7530a1c77dcf6a2b2c0c14ac9c62ce5d7fdf5e6e60400f316b823195c6f4f996cfa04827499b2d3d48e0bf8b711a32c653f59a0'
}
```

### Build Transaction (Siacoin transfer)
```js
var transaction = Sia.transaction.encodeTransaction(inputs, fee, changeAddress, sendAmount, destinationAddress, privateKey, (transaction) => {
  // returns json object as an encoded transaction
  // send transaction using walrus endpoint (https://escher-walrus.libtechnologies.io/broadcast)
  // TODO Change domain to escher subdomain
})
```
#### Inputs
| Name                | Type             | Example                                                                   |
| ------------------- | ---------------- | ------------------------------------------------------------------------- |
| inputs              | Array            | https://siastats.info:3500/navigator-api/unspent_outputs/changeAddress    |
| fee                 | Number (Siacoin) | 0.0001 (In Siacoins not hastings)                                         |
| changeAddress       | String           | Siacoin Address                                                           |
| sendAmount          | Number (Siacoin) | 10 (In Siacoins not hastings)                                             |
| destinationAddress  | String           | Siacoin Address                                                           |
| privateKey          | String           | Siacoin Private Key                                                       |

#### Example response
```
{
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
  "minerFees": [ "13000000000000000000000000000" ],
  "transactionSignatures": [
    {
      "parentID": "b8c63a8f435bfff7bf8c1f6c7ece0066599fa4e08cb74ab5929e84b014e408c8",
      "publicKeyIndex": 0,
      "coveredFields": { "wholeTransaction": true },
      "signature": "rFtBFv9oeScpO3mhp6O2liMwBKYXn05SaOmzhhjQtIkOwAClaJTpLEKn3U26zYis2AG2tH2idWSJNZXNSVa8DQ=="
    }
  ]
}
```
## TODO
- function to verify a valid sia address
- function to verify a valid sia private key
- function to verify a valid sia public key
