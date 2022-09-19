package client.scene;

import client.network.RestProtocol.JoinSectorResponse;
import engine.BaseEngine.EngineMode;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.gameplay.island.IslandGameplay;
import client.network.Socket;
import client.network.SocketProtocol;
import h2d.Scene;
import h3d.Engine;

class SceneIsland extends Scene implements EventListener {
	public var instanceId:String;

	private var game:IslandGameplay;
	private var leaveCallback:Void->Void;

	public function new(width:Int, height:Int, leaveCallback:Void->Void) {
		super();
		this.leaveCallback = leaveCallback;
		scaleMode = LetterBox(1920, 1080);
		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start(response:JoinSectorResponse) {
		trace(response);
		game = new IslandGameplay(this, response.islandId, response.islandOwner, response.islandTerrain, response.islandMining, function callback() {
			if (leaveCallback != null) {
				game = null;
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventGameInit, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventAddEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityMove, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventSync, this);
				leaveCallback();
			}
		}, EngineMode.Server);

		if (game.baseEngine.engineMode == EngineMode.Server) {
			Socket.instance.joinGame({playerId: Player.instance.playerData.ethAddress, instanceId: instanceId, sectorType: 3});

			EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityMove, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
		} else {
			final char1 = game.addCharacterByClient(350, 290, '123', '0x87400A03678dd03c8BF536404B5B14C609a23b79');
			game.startGameByClient('0x87400A03678dd03c8BF536404B5B14C609a23b79', [char1]);
		}
	}

	public override function render(e:Engine) {
		super.render(e);
		game.hud.render(e);
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
				game.startGame(Player.instance.playerData.ethAddress.toLowerCase(), message);
			case SocketProtocol.SocketServerEventAddEntity:
				game.addEntity(message);
			case SocketProtocol.SocketServerEventRemoveEntity:
				game.removeEntity(message);
			case SocketProtocol.SocketServerEventUpdateWorldState:
				game.updateWorldState(message);
			case SocketProtocol.SocketServerEventEntityMove:
				game.entityMove(message);
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
