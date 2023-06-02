import crypto from 'crypto';

const key = crypto.randomBytes(32).toString('hex');

console.log(key);

function Hmac(key, turn) {
    return crypto.createHmac('sha3-256', key).update(turn).digest('hex');
}

for(let i = 0; i<5;i++) console.log(Hmac(key, i.toString()));

class Help {

}

class Rules {

}

class Key {

}

class Hmac {
    
}