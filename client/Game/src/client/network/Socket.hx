package client.network;

import client.event.EventManager;
import js.node.socketio.Client;

class Socket {
	public static final instance:Socket = new Socket();

	private final clientSocket:Client;

	private function new() {
		// clientSocket = new Client("http://23.111.202.19:3000/");
		clientSocket = new Client("http://localhost:3000/");

		clientSocket.on(Protocol.SocketServerEventGameInit, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventGameInit, data);
		});
		clientSocket.on(Protocol.SocketServerEventAddShip, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventAddShip, data);
		});
		clientSocket.on(Protocol.SocketServerEventAddShell, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventAddShell, data);
		});
		clientSocket.on(Protocol.SocketServerEventRemoveShip, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventRemoveShip, data);
		});
		clientSocket.on(Protocol.SocketServerEventUpdateWorldState, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventUpdateWorldState, data);
		});
		clientSocket.on(Protocol.SocketServerEventShipMove, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventShipMove, data);
		});
		clientSocket.on(Protocol.SocketServerEventShipShoot, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventShipShoot, data);
		});
	}

	public function joinGame(message:Protocol.SocketClientMessageJoinGame) {
		clientSocket.emit(Protocol.SocketClientEventJoinGame, message);
	}

	public function move(message:Protocol.SocketClientMessageMove) {
		clientSocket.emit(Protocol.SocketClientEventMove, message);
	}

	public function shoot(message:Protocol.SocketClientMessageShoot) {
		clientSocket.emit(Protocol.SocketClientEventShoot, message);
	}
}
