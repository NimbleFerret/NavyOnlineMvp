package client.network;

import haxe.Timer;
import client.event.EventManager;
import js.node.socketio.Client;

class Socket {
	public static final instance:Socket = new Socket();

	public var latency = 0.0;

	private final clientSocket:Client;
	private var lastPingTime = 0.0;

	private function new() {
		// clientSocket = new Client("http://23.111.202.19:3000/");
		clientSocket = new Client("http://localhost:3000/");

		clientSocket.on(SocketProtocol.SocketServerEventPong, function(data) {
			latency = Date.now().getTime() - lastPingTime;
			trace('Latency:' + latency);
		});
		clientSocket.on(SocketProtocol.SocketServerEventGameInit, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventGameInit, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventAddShip, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventAddShip, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventRemoveShip, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventRemoveShip, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventUpdateWorldState, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventUpdateWorldState, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventShipMove, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventShipMove, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventShipShoot, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventShipShoot, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventSync, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventSync, data);
		});

		final timer = new Timer(1000);
		timer.run = function callback() {
			lastPingTime = Date.now().getTime();
			clientSocket.emit(SocketProtocol.SocketClientEventPing, {});
		}
	}

	public function joinGame(message:SocketProtocol.SocketClientMessageJoinGame) {
		clientSocket.emit(SocketProtocol.SocketClientEventJoinGame, message);
	}

	public function leaveGame(message:SocketProtocol.SocketClientMessageLeaveGame) {
		clientSocket.emit(SocketProtocol.SocketClientEventLeaveGame, message);
	}

	public function move(message:SocketProtocol.SocketClientMessageMove) {
		clientSocket.emit(SocketProtocol.SocketClientEventMove, message);
	}

	public function shoot(message:SocketProtocol.SocketClientMessageShoot) {
		clientSocket.emit(SocketProtocol.SocketClientEventShoot, message);
	}

	public function sync(message:SocketProtocol.SocketClientMessageSync) {
		clientSocket.emit(SocketProtocol.SocketClientEventSync, message);
	}

	public function respawn(message:SocketProtocol.SocketClientMessageRespawn) {
		clientSocket.emit(SocketProtocol.SocketClientEventRespawn, message);
	}
}
