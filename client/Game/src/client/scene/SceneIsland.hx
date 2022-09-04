package client.scene;

import client.gameplay.island.IslandGameplay;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.network.Socket;
import client.network.SocketProtocol;
import h2d.Scene;

// TODO rename event listener to some socket stuff
class SceneIsland extends Scene implements EventListener {
	public var instanceId:String;

	private var game:IslandGameplay;
	private var leaveCallback:Void->Void;

	public function new(width:Int, height:Int, leaveCallback:Void->Void) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start() {
		game = new IslandGameplay(this, function callback() {});

		// TODO add socket callbacks
		Socket.instance.joinGame({playerId: Player.instance.playerData.ethAddress, instanceId: instanceId, sectorType: 3});

		EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityMove, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
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
}
