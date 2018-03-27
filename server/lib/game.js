const Deck      = require('./deck');
const GameState = require('./gamestate');
const Turn      = require('./turn');

class Game {
    constructor(name) {
        this.state    = GameState.NEW;
        this.name     = name; 
        this.players  = new Array(2);
        //TODO: Turn History
    }

    start(){
        this.current  = Math.round(Math.random());
        this.score    = [0, 0];  
        this.cards    = Deck.getCards();
        this.known    = new Array(this.cards.length);

        this.got      = new Array();
        this.picks    = new Array();
        this.guess    = 0;

        this.broadcast({ type: 'cards', data: Array.from(new Set(this.cards)) });
        this.switchTurn();
    }

    resume(){
        if (this.got.length > 0) 
            this.broadcast({ type: 'got', data: this.got });
        if (this.picks.length > 0) 
            this.broadcast({ type: 'picked', data: this.picks });

        this.broadcast({ type: 'pause' });
        
        this.got      = new Array();
        this.picks    = new Array();
        this.guess    = 0;
    }

    pickCard(cardIdx){
        if (this.picks[this.picks.length] === cardIdx ) return;

        if (this.known[cardIdx]) {
            this.broadcast({ type: 'picked', data: [ cardIdx ] });
        } else {
            this.broadcast({ type: 'reveal', data: [ cardIdx ], secret: [ this.cards[cardIdx] ] });
            this.known[cardIdx] = true;
        }

        this.picks.push(cardIdx);
        if(this.picks.length >= 2){
            if(this.guess == this.cards[cardIdx]){
                this.gotCard(this.guess);
            }else{
                this.direct(this.current, { type: 'miss' });
                this.broadcast({ type: 'pause' });
                setTimeout(() => this.switchTurn(), 1000);
            }
        }else{
            this.guess = this.cards[cardIdx];
        }

        if(this.score[0] + this.score[1] == this.cards.length / 2){
            this.broadcast({ type: 'gameover', data: this.score });
            setTimeout(() => this.start(), 3000);
        }
    }

    gotCard(cardId){
        this.score[this.current]++;
        this.broadcast({ type: 'matched', data: this.picks });
        this.got.push(...this.picks);
        this.picks = new Array();
    }

    switchTurn(){
        this.direct(( this.current === 0) ? this.current = 1 : this.current = 0, { type: 'turn' });
    }

    join(playerId, playerName, playerSocket){
        if(this.state == GameState.STARTED) return;

        for(let i = 0; i < this.players.length; i++){
            if(this.players[i]) continue;
            this.players[i] = { id: playerId, name: playerName, ws: playerSocket };
   
            playerSocket.send(JSON.stringify({ type: 'greet', data: [ this.name, i ] }));

            if(++this.state == GameState.STARTED) this.start();
            return;
        }
    }

    leave(playerId){
        let idx = this.players.findIndex( p => (p) ? p.id === playerId : false );
        if(idx == -1) return;

        delete this.players[idx];
        this.state--;
    }

    direct(playerIdx, json){
        if(this.players[playerIdx]) 
            this.players[playerIdx].ws.send(JSON.stringify(json));
    }

    broadcast(json){
        this.players.forEach((p) => (p) ? p.ws.send(JSON.stringify(json)) : false );
    }
  };

module.exports = Game;