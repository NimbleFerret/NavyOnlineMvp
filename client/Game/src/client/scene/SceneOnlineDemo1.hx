package client.scene;

import uuid.Uuid;
import engine.GameEngine.EngineMode;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.network.Socket;
import client.network.Protocol;
import h3d.Engine;
import h2d.Scene;

class SceneOnlineDemo1 extends Scene implements EventListener {
	private var game:Game;

	public var playerId = Uuid.short();

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start() {
		game = new Game(this, EngineMode.Server);

		game.joinNewGameCallback = function callback() {
			Socket.instance.joinGame({playerId: playerId});
		}
		game.joinExistingGameCallback = function callback() {}

		// game.hud.addButton("Connect socket", function() {
		// 	Socket.instance.joinGame({playerId: playerId});
		// });

		// game.hud.addButton("Retry", function() {
		// Socket.instance.joinGame({playerId: playerId});
		// });

		EventManager.instance.subscribe(Protocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventAddShip, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventRemoveShip, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventShipMove, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventShipShoot, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventSync, this);
	}

	public override function render(e:Engine) {
		game.hud.render(e);
		super.render(e);
		game.debugDraw();
	}

	public function update(dt:Float, fps:Float) {
		game.update(dt, fps);
	}

	public function getHud() {
		return game.hud;
	}

	public function notify(event:String, message:Dynamic) {
		switch (event) {
			case Protocol.SocketServerEventGameInit:
				game.startGame(playerId, message);
			case Protocol.SocketServerEventAddShip:
				game.addShip(message);
			case Protocol.SocketServerEventRemoveShip:
				game.removeShip(message);
			case Protocol.SocketServerEventUpdateWorldState:
				game.updateWorldState(message);
			case Protocol.SocketServerEventShipMove:
				game.shipMove(message);
			case Protocol.SocketServerEventShipShoot:
				game.shipShoot(message);
			case Protocol.SocketServerEventSync:
				game.sync(message);
			default:
				trace('Unknown socket message');
		}
	}
}
