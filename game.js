import crypto from 'crypto';
import readline from 'readline';

class Help {
    constructor(ctx) {
        this.ctx = ctx;
    }

    printTable() {
        const tbl = [];

        for (let i = 0; i < this.ctx.moves.length; i++) {
            const row = {};
            for (let j = 0; j < this.ctx.moves.length; j++) {
                row[this.ctx.moves[j]] = this.ctx.getResult(i, j);
            }
            tbl.push(row);
        }

        const res = tbl.map((obj, index) => ({
            'user\\/ ai>': this.ctx.moves[index],
            ...obj,
        }));

        console.table(res);
    }
}

class Key {
    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }
}

class Hmac {
    constructor(key, turn) {
        this.key = key;
        this.turn = turn;
    }
    
    generateHmac() {
        return crypto.createHmac('sha3-256', this.key).update(this.turn).digest('hex');
    }
}

class Game {
    constructor() {
        this.moves = process.argv.slice(2);
        this.key = (new Key()).generateKey();
        this.aiTurn =  Math.floor(Math.random() * this.moves.length);
        this.hmac = (new Hmac(this.key, this.moves[this.aiTurn])).generateHmac();
    }

    getResult(userTurn, aiTurn) {
        const tmp = (aiTurn - userTurn + this.moves.length) % this.moves.length;
        if (tmp == 0) return 'draw';
        if (tmp <= this.moves.length / 2) return 'ai wins';
        return 'user wins';
    }

    play() {
        if (this.moves.length % 2 == 0) {
            console.log('number of args must be odd');
            return;
        }
        if (this.moves.length < 1) {
            console.log('number of args must be > 1');
            return;
        }
        if (this.moves.length != new Set(this.moves).size) {
            console.log('args must be unique');
            return;
        }
        console.log(`HMAC:${this.hmac}`);
        console.log('Avaliable moves:');
        this.moves.forEach((item, index) => {
            console.log(index + 1 + ' - ' + item);
        });
        console.log('0 - exit\n? - help ');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        }); 

        repeater(this);

        function repeater(ctx) {
            rl.question('Enter your move:', move => {
                if (move == 0) {
                    console.log('bye');
                    rl.close();
                } else if (move == '?') {
                    const h = new Help(ctx).printTable();
                    repeater(ctx);
                } else if (!ctx.moves[move - 1]) {
                    console.log('incorrect value');
                    repeater(ctx);
                } else {
                    console.log(`ai move:${ctx.moves[ctx.aiTurn]}`);
                    console.log(`result: ${ctx.getResult(move - 1, ctx.aiTurn)}`);
                    console.log(`HMAC key:${ctx.key}`);
                    rl.close();
                }
            });
        }
        
    }
}

new Game().play();