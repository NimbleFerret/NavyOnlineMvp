package client.scene;

import h2d.Scene;
import h3d.Engine;
import client.network.RestProtocol.JoinSectorResponse;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.gameplay.island.IslandGameplay;
import client.network.Socket;
import client.network.SocketProtocol;
import game.engine.base.BaseTypesAndClasses;
import game.engine.base.core.BaseEngine.EngineMode;
import game.engine.navy.entity.NavyCharacterEntity;

class SceneIsland extends Scene implements EventListener {
	private var instanceId:String;
	private var game:IslandGameplay;
	private var leaveCallback:Void->Void;

	public function new(width:Int, height:Int, leaveCallback:Void->Void) {
		super();
		this.leaveCallback = leaveCallback;
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);
	}

	public function start(response:JoinSectorResponse) {
		this.instanceId = response.instanceId;
		game = new IslandGameplay(this, response.islandId, response.islandOwner, response.islandTerrain, response.islandMining, function callback() {
			if (leaveCallback != null) {
				game = null;
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventGameInit, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventAddEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityInput, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityInputs, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventSync, this);
				leaveCallback();
			}
		}, Player.instance.SinglePlayer ? EngineMode.Client : EngineMode.Server);
		if (game.baseEngine.engineMode == EngineMode.Server) {
			Socket.instance.joinGame({
				playerId: Player.instance.playerId,
				instanceId: instanceId,
				entityId: Player.instance.playerEntityId
			});
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityInput, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityInputs, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
		} else {
			final playerId = Player.instance.playerId;
			final char1 = new NavyCharacterEntity(new BaseObjectEntity({
				x: 350,
				y: 290,
				minSpeed: 0,
				maxSpeed: 150,
				acceleration: 150,
				currentSpeed: 0,
				movementDelay: 0.100,
				id: 'char_' + playerId,
				ownerId: playerId,
			}));
			game.startGameSingleplayer(playerId, [char1]);
		}
	}

	public override function render(e:Engine) {
		game.waterScene.render(e);
		super.render(e);
		game.hud.render(e);
		game.debugDraw();
	}

	public function update(dt:Float, fps:Float) {
		if (game != null) {
			// final c = camera;
			// if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
			// 	c.scale(1.25, 1.25);
			// if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
			// 	c.scale(0.8, 0.8);
			game.update(dt, fps);
		}
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
				trace('Unknown socket message');
		}
	}

	public function getHud() {
		return game.hud;
	}
}
