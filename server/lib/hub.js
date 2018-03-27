const Game      = require('./game');
const GameState = require('./gamestate');

const games = new Array();
let clientCounter = 0; 

module.exports = {
    register: () => clientCounter++,
    join: (id, ws, gameName, playerName, retry = 0) => {
        const gn = ( retry > 0 ) ? gameName+retry : gameName;

        let gameId = games.findIndex( game => game.name === gn );
        if(gameId == -1)
            gameId = games.push(new Game(gn)) -1;

        const game = games[gameId];

        if(game.state == GameState.STARTED ){
            return module.exports.join(id,ws,gameName,playerName,++retry);
        }

      game.join(id, playerName, ws);
      return game;
    },
    leave: (id) => {  }, //TODO
    reboot: () => { 
	//TODO: handle gracefully
	/*for(let game of games){
		if (game == undefined) continue;
		for(let player of game.players){
			if (player == undefined) continue;
			player.ws.terminate();
		};
	};*/
        clientCounter = 0;
        games = new Array();
    }
};
