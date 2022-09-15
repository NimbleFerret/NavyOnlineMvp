package client.scene;

import h3d.Engine;
import engine.BaseEngine.EngineMode;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.gameplay.island.IslandGameplay;
import client.network.Socket;
import client.network.SocketProtocol;
import h2d.Scene;

class SceneIsland extends Scene implements EventListener {
	public var instanceId:String;

	private var game:IslandGameplay;
	private var leaveCallback:Void->Void;

	public function new(width:Int, height:Int, leaveCallback:Void->Void) {
		super();
		this.leaveCallback = leaveCallback;
		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start() {
		game = new IslandGameplay(this, function callback() {
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
		}, EngineMode.Client);

		if (game.baseEngine.engineMode == EngineMode.Server) {
			Socket.instance.joinGame({playerId: Player.instance.playerData.ethAddress, instanceId: instanceId, sectorType: 3});

			EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityMove, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
			EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
		} else {
			// TODO implement client init
		}
	}

	public override function render(e:Engine) {
		game.hud.render(e);
		super.render(e);
	}

	public function update(dt:Float, fps:Float) {
		final c = camera;

		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
			c.scale(1.25, 1.25);
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
			c.scale(0.8, 0.8);

		game.update(dt, fps);
	}

	public function notify(event:String, message:Dynamic) {
		switch (event) {
			case SocketProtocol.SocketServerEventGameInit:
				game.startGame(Player.instance.playerData.ethAddress, message);
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