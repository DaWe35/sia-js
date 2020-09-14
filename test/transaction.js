var sia = require('../lib');

var inputs_from_api = [
    {
        "output": "c67c0f52c9ae5a3003a62bcb86354bedfb7037065143a590489c654dde2ce091",
        "hastings": "2961935000000000000000000000",
        "sf": null
    }
]

var fee = 0.1;

var senders_public_key = '8408ad8d5e7f605995bdf9ab13e5c0d84fbe1fc610c141e0578c7d26d5cfee75';

var senders_address = '5ac6af95fe284b4bbb0110ef51d3c90f3e9ea37586352ec83bad569230bad7f37a452c0a2a2f';

var send_amount = 10;

var receivers_address = 'df1b42c80b5f7a67331893fde0923a5071d6d7dff4c78baec547cf5ca4d314a1d78b6b1c8d42';

var transaction = sia.transction.encodeTransaction(inputs_from_api, fee, senders_public_key, senders_address, send_amount, receivers_address, (res) => {
    console.log(res)
});