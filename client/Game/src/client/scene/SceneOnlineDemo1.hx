package client.scene;

import uuid.Uuid;
import engine.GameEngine.EngineMode;
import engine.entity.EngineShipEntity;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.network.Socket;
import client.network.Protocol;
import h3d.Engine;
import h2d.Scene;

class SceneOnlineDemo1 extends Scene implements EventListener {
	private final game:Game;

	public var playerId = Uuid.short();

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
		game = new Game(this, EngineMode.Server);

		game.hud.addButton("Connect socket", function() {
			Socket.instance.joinGame({playerId: playerId});
		});

		game.hud.addButton("Retry", function() {
			Socket.instance.joinGame({playerId: playerId});
		});

		EventManager.instance.subscribe(Protocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventAddShip, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventAddShell, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventRemoveShip, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventShipMove, this);
		EventManager.instance.subscribe(Protocol.SocketServerEventShipShoot, this);
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
			case Protocol.SocketServerEventAddShell:
				trace("SocketServerMessageAddShell");
			case Protocol.SocketServerEventRemoveShip:
				trace("SocketServerMessageRemoveShip");
				game.removeShip(message);
			case Protocol.SocketServerEventUpdateWorldState:
			// if (gameState == GameState.Init) {
			// gameState = GameState.Playing;
			// TODO add all ships and init gameplay
			// }
			// trace("SocketServerMessageUpdateWorldState");
			// jsShipsToHaxe(params);
			// TODO type cast here
			case Protocol.SocketServerEventShipMove:
				trace('SocketServerMessageShipMove');
				game.shipMove(message);
			case Protocol.SocketServerEventShipShoot:
				trace('SocketServerMessageShipShoot');
				game.shipShoot(message);
			default:
				trace('Unknown socket message');
		}
	}
}
