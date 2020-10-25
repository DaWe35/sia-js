var sia = require('../lib')

// define tx inputs
var inputs_from_api = [
  {
    output: 'e4974950a58def66bb5e7b51b5208ec665bce07684e006d9e4b451c4956790e7',
    hastings: '2941735000000000000000000000',
    sf: null
  }
]

var fee = 0.1

var senders_address = '3a0118104939d2f550e7e3b50840473f53494648eaaf01f8b89bba57ae9f12f41e4c67e2ab9b'

var senders_private_key = 'a97eea803e67310785b96f865fa1482664a24a3ccd90eda6c72b777b55f328252002dfde51fdf9fae9ec62f8fff5f7cb1af430f92626691e73ecbf343a4a8a6b'

var send_amount = 10

var receivers_address = 'df1b42c80b5f7a67331893fde0923a5071d6d7dff4c78baec547cf5ca4d314a1d78b6b1c8d42'

it('Transaction encoding', () => {
    sia.transction.encodeTransaction(inputs_from_api, fee, senders_address, send_amount, receivers_address, senders_private_key, (res) => {
        // success
    })
})

describe('keypairs', () => {
    var initial_keypair = {};
    it('generate from seed', () => {
        initial_keypair = sia.keyPair.generateFromSeed('this is a seed ...');
    });
    it('address from private key', () => {
        var new_address = sia.keyPair.deriveAddress(initial_keypair.privateKey);
        expect(new_address).toEqual(initial_keypair.address);
    });
    it('generate random seed syncronously', () => {
        var random = sia.keyPair.generateRandomData()
        var randomLength = random.length
        expect(randomLength).toBe(32);
    });
    it('generate random seed asyncronously', () => {
        sia.keyPair.generateRandomData(randomCallback)
        function randomCallback(random) {
            randomLength = random.length
            expect(randomLength).toBe(32)
        }
    });
    it('generate address from phase', () => {
        var key = sia.keyPair.generateFromMnemonic('dogs addicted irony total licks logic rumble soil hectare pipeline yodel absorb tsunami donuts bacon axis bovine selfish fizzle wayside waking veteran vague cease foggy tucks welders pairing aching', [0,0,0,0,0,0,0,0])
        expect(key.address).toEqual('e31cdb8fd42538d7d6bd8325795d44041921e8773bc48810c6571af6e7247ce60f5ba50cdce7');
        expect(key.publicKey).toEqual('6f7b78880967be0d15d3c29cf5735b71174e99c80d0c11b5a947a6ba666d4025');
        expect(key.privateKey).toEqual('c2fc9b345dc3696317af23b311e67941313ce0964506ea948248311be360c7bf6f7b78880967be0d15d3c29cf5735b71174e99c80d0c11b5a947a6ba666d4025');
    });
    it('BytesToInt and IntToBytes', () => {
        var bytes = [161,18,137,160,49,247,67,12,60,145,168,97,224,157,81,20,230,212,72,43,172,143,101,210,188,37,90,155,96,21,142,28];
        var int = sia.mnemonics.bytesToInt(bytes)
        var reconvertedBytes = sia.mnemonics.intToBytes(int)
        expect(bytes).toEqual(reconvertedBytes);
    });
    
    
})