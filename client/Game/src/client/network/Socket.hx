package client.network;

import js.node.socketio.Client;
import haxe.Timer;
import client.event.EventManager;
import client.network.SocketProtocol.SocketServerDailyTaskChange;

class Socket {
	public static final instance:Socket = new Socket();

	public var latency = 0.0;

	private final clientSocket:Client;
	private var lastPingTime = 0.0;

	private final connectionDelayMS = 0;

	private function new() {
		clientSocket = new Client("http://localhost:4020", {});
		// clientSocket = new Client("https://navy.online");
		clientSocket.on(SocketProtocol.SocketServerEventPong, function(data) {
			Timer.delay(function() {
				latency = Date.now().getTime() - lastPingTime;
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventGameInit, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventGameInit, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventAddEntity, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventAddEntity, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventRemoveEntity, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventRemoveEntity, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventUpdateWorldState, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventUpdateWorldState, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventEntityInput, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventEntityInput, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventEntityInputs, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventEntityInputs, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventSync, function(data) {
			Timer.delay(function() {
				EventManager.instance.notify(SocketProtocol.SocketServerEventSync, data);
			}, connectionDelayMS);
		});
		clientSocket.on(SocketProtocol.SocketServerEventDailyTaskUpdate, function(data:SocketServerDailyTaskChange) {
			Player.instance.playerData.dailyPlayersKilledCurrent = data.dailyPlayersKilledCurrent;
			Player.instance.playerData.dailyPlayersKilledMax = data.dailyPlayersKilledMax;
			Player.instance.playerData.dailyBotsKilledCurrent = data.dailyBotsKilledCurrent;
			Player.instance.playerData.dailyBotsKilledMax = data.dailyBotsKilledMax;
			Player.instance.playerData.dailyBossesKilledCurrent = data.dailyBossesKilledCurrent;
			Player.instance.playerData.dailyBossesKilledMax = data.dailyBossesKilledMax;
			EventManager.instance.notify(SocketProtocol.SocketServerEventDailyTaskUpdate, data);
		});
		clientSocket.on(SocketProtocol.SocketServerEventDailyTaskReward, function(data) {
			EventManager.instance.notify(SocketProtocol.SocketServerEventDailyTaskReward, data);
		});
		final timer = new Timer(1000);
		timer.run = function callback() {
			Timer.delay(function() {
				lastPingTime = Date.now().getTime();
				clientSocket.emit(SocketProtocol.SocketClientEventPing, {});
			}, connectionDelayMS);
		}
	}

	public function joinGame(message:SocketProtocol.SocketClientMessageJoinGame) {
		Timer.delay(function() {
			clientSocket.emit(SocketProtocol.SocketClientEventJoinGame, message);
		}, connectionDelayMS);
	}

	public function leaveGame(message:SocketProtocol.SocketClientMessageLeaveGame) {
		Timer.delay(function() {
			clientSocket.emit(SocketProtocol.SocketClientEventLeaveGame, message);
		}, connectionDelayMS);
	}

	public function input(message:SocketProtocol.SocketClientMessageInput) {
		Timer.delay(function() {
			clientSocket.emit(SocketProtocol.SocketClientEventInput, message);
		}, connectionDelayMS);
	}

	public function sync(message:SocketProtocol.SocketClientMessageSync) {
		Timer.delay(function() {
			clientSocket.emit(SocketProtocol.SocketClientEventSync, message);
		}, connectionDelayMS);
	}

	public function respawn(message:SocketProtocol.SocketClientMessageRespawn) {
		Timer.delay(function() {
			clientSocket.emit(SocketProtocol.SocketClientEventRespawn, message);
		}, connectionDelayMS);
	}
}
