var sia = require('../lib');
var fetch = require('node-fetch');
var util = require('util');

var inputs_from_api = [
    {
        "output": "e4974950a58def66bb5e7b51b5208ec665bce07684e006d9e4b451c4956790e7",
        "hastings": "2941735000000000000000000000",
        "sf": null
    }
]

var fee = 0.1;

var senders_address = '3a0118104939d2f550e7e3b50840473f53494648eaaf01f8b89bba57ae9f12f41e4c67e2ab9b';

var senders_private_key = 'a97eea803e67310785b96f865fa1482664a24a3ccd90eda6c72b777b55f328252002dfde51fdf9fae9ec62f8fff5f7cb1af430f92626691e73ecbf343a4a8a6b';

var send_amount = 10;

var receivers_address = 'df1b42c80b5f7a67331893fde0923a5071d6d7dff4c78baec547cf5ca4d314a1d78b6b1c8d42';

var transaction = sia.transction.encodeTransaction(inputs_from_api, fee, senders_address, send_amount, receivers_address, senders_private_key, (res) => {
    console.log(res)
    fetch('http://escher-walrus.libtechnologies.io/broadcast', {
        method: 'POST',
        body: JSON.stringify([res])
    }).then(remoteRes => remoteRes.jdon()).then(json => console.log(json))
});