package client.network;

import client.event.EventManager;
import js.node.socketio.Client;

typedef MoveDir = {
	up:Bool,
	down:Bool,
	left:Bool,
	right:Bool,
}

class Socket {
	// Server events
	private static final SocketServerGameInit = 'SocketServerGameInit';
	private static final SocketServerMessageAddShip = 'SocketServerMessageAddShip';
	private static final SocketServerMessageAddShell = 'SocketServerMessageAddShell';
	private static final SocketServerMessageRemoveShip = 'SocketServerMessageRemoveShip';
	private static final SocketServerMessageUpdateWorldState = "SocketServerMessageUpdateWorldState";

	// Client events
	private static final SocketClientMessageJoinGame = 'SocketClientMessageJoinGame';
	private static final SocketClientMessageMove = 'SocketClientMessageMove';
	private static final SocketClientMessageShoot = 'SocketClientMessageShoot';

	public static final instance:Socket = new Socket();

	private final clientSocket:Client;

	private function new() {
		clientSocket = new Client("http://localhost:3000/");

		clientSocket.on(SocketServerGameInit, function(data) {
			EventManager.instance.notify(EventType.SocketServerGameInit, data);
		});
		clientSocket.on(SocketServerMessageAddShip, function(data) {
			EventManager.instance.notify(EventType.SocketServerMessageAddShip, data);
		});
		clientSocket.on(SocketServerMessageAddShell, function(data) {
			EventManager.instance.notify(EventType.SocketServerMessageAddShell, data);
		});
		clientSocket.on(SocketServerMessageRemoveShip, function(data) {
			EventManager.instance.notify(EventType.SocketServerMessageRemoveShip, data);
		});
		clientSocket.on(SocketServerMessageUpdateWorldState, function(data) {
			EventManager.instance.notify(EventType.SocketServerMessageUpdateWorldState, data);
		});
	}

	public function joinGame(addr:String) {
		clientSocket.emit(SocketClientMessageJoinGame, {ethAddress: addr});
	}

	public function move(moveDir:MoveDir) {
		clientSocket.emit(SocketClientMessageMove, moveDir);
	}

	public function shoot() {
		clientSocket.emit(SocketClientMessageShoot, {});
	}
}
