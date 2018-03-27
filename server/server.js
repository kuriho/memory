const WebSocketServer = require('uws').Server;
const hub = require('./lib/hub');

process.on('uncaughtException', (e) => console.log(e.stack));

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
	const id   = hub.register();
	let   game = undefined; 

	ws.on('message', (message) => {
			const json = JSON.parse(message);

			switch (json.action) {
				case "join":		
						game = hub.join(id, ws, ...json.data);
						break;
		
				case "pick":
						game.pickCard(json.data);
						break;
		
				case "resume":
						game.resume();
						break;
		
				default:
						console.log(json);
		}
	});

	ws.on('close', () => (game) ? game.leave(id) : false);
});

