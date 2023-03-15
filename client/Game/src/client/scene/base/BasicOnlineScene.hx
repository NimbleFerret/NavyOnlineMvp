package client.scene.base;

import game.engine.base.core.BaseEngine.EngineMode;
import client.network.RestProtocol.JoinSectorResponse;
import client.event.EventManager;
import client.network.Socket;
import client.gameplay.BasicGameplay;
import client.event.EventManager.EventListener;
import client.network.SocketProtocol;

abstract class BasicOnlineScene extends BasicScene implements EventListener {
	var game:BasicGameplay;
	var instanceId:String;

	private var customServerEvents = new Array<String>();

	private final engineMode:EngineMode;

	public function new(engineMode:EngineMode) {
		super();
		this.engineMode = engineMode;
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public function start(?joinSectorResponse:JoinSectorResponse) {}

	public function update(dt:Float, fps:Float) {
		game.update(dt, fps);
	}

	public function notify(event:String, message:Dynamic) {
		switch (event) {
			case SocketProtocol.SocketServerEventGameInit:
				game.startGameMultiplayer(Player.instance.playerId.toLowerCase(), message);
			case SocketProtocol.SocketServerEventAddEntity:
				game.addEntity(message);
			case SocketProtocol.SocketServerEventRemoveEntity:
				game.removeEntity(message);
			case SocketProtocol.SocketServerEventUpdateWorldState:
				game.updateWorldState(message);
			case SocketProtocol.SocketServerEventEntityInputs:
				game.entityInputs(message);
			case SocketProtocol.SocketServerEventEntityInput:
				game.entityInput(message);
			case SocketProtocol.SocketServerEventSync:
				game.sync(message);
			default:
				processCustomServerEvent(event, message);
		}
	}

	// --------------------------------------
	// General
	// --------------------------------------

	function joinGame() {
		Socket.instance.joinGame({
			playerId: Player.instance.playerId,
			instanceId: instanceId,
			entityId: Player.instance.playerEntityId
		});
	}

	function subscribeToServerEvents(?customServerEvents:Array<String>) {
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityInput, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityInputs, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);

		if (customServerEvents != null && customServerEvents.length > 0) {
			this.customServerEvents = customServerEvents;
			for (event in this.customServerEvents) {
				EventManager.instance.subscribe(event, this);
			}
		}
	}

	function unsubscribeFromServerEvents() {
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventGameInit, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventAddEntity, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityInput, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityInputs, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventSync, this);

		if (customServerEvents != null && customServerEvents.length > 0) {
			for (event in this.customServerEvents) {
				EventManager.instance.unsubscribe(event, this);
			}
			this.customServerEvents = [];
		}
	}

	// --------------------------------------
	// Abs
	// --------------------------------------

	public abstract function processCustomServerEvent(event:String, message:Dynamic):Void;
}
