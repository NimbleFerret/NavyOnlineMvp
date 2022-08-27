package client.network;

import hxd.System;
import haxe.Timer;
import client.event.EventManager;
import js.node.socketio.Client;

class Socket {
	public static final instance:Socket = new Socket();

	public var latency = 0.0;

	private final clientSocket:Client;
	private var lastPingTime = 0.0;

	private function new() {
		clientSocket = new Client("http://23.111.202.19:3000/");
		// clientSocket = new Client("http://localhost:3000/");

		clientSocket.on(Protocol.SocketServerEventPong, function(data) {
			latency = Date.now().getTime() - lastPingTime;
			trace('Latency:' + latency);
		});
		clientSocket.on(Protocol.SocketServerEventGameInit, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventGameInit, data);
		});
		clientSocket.on(Protocol.SocketServerEventAddShip, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventAddShip, data);
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
		clientSocket.on(Protocol.SocketServerEventSync, function(data) {
			EventManager.instance.notify(Protocol.SocketServerEventSync, data);
		});

		final timer = new Timer(1000);
		timer.run = function callback() {
			lastPingTime = Date.now().getTime();
			clientSocket.emit(Protocol.SocketClientEventPing, {});
		}
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

	public function sync(message:Protocol.SocketClientMessageSync) {
		clientSocket.emit(Protocol.SocketClientEventSync, message);
	}

	public function respawn(message:Protocol.SocketClientMessageRespawn) {
		clientSocket.emit(Protocol.SocketClientEventRespawn, message);
	}
}
