package client;

import js.node.socketio.Client;

typedef MoveDir = {
	up:Bool,
	down:Bool,
	left:Bool,
	right:Bool,
}

class Socket {
	public static final instance:Socket = new Socket();

	private final clientSocket:Client;

	private function new() {
		clientSocket = new Client("http://localhost:3000/");
		clientSocket.on('message', function(data) {
			// Do something
		});
	}

	public function joinGame(addr:String) {
		clientSocket.emit('joinGame', {ethAddress: addr});
	}

	public function move(moveDir:MoveDir) {
		clientSocket.emit('move', moveDir);
	}

	public function shoot() {
		clientSocket.emit('shoot');
	}
}
