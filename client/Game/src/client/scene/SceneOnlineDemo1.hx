package client.scene;

import uuid.Uuid;
import engine.GameEngine.EngineMode;
import engine.entity.EngineShipEntity;
import client.event.EventManager;
import client.event.EventManager.EventType;
import client.event.EventManager.EventListener;
import client.network.Socket;
import h3d.Engine;
import h2d.Scene;

typedef ServerShips = {
	ships:Array<ServerShipParams>
}

typedef ServerShip = {
	ship:ServerShipParams
}

typedef ServerShipParams = {
	id:String,
	ownerId:String,
	x:Int,
	y:Int
}

typedef RemoveShip = {
	shipId:String
}

class SceneOnlineDemo1 extends Scene implements EventListener {
	private final game:Game;

	public var playerId = Uuid.short();

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
		game = new Game(this, EngineMode.Server);

		game.hud.addButton("Connect socket", function() {
			Socket.instance.joinGame(playerId);
		});

		game.hud.addButton("Retry", function() {
			// Socket.instance.joinGame(playerId);
			Socket.instance.joinGame(playerId);
		});

		EventManager.instance.subscribe(EventType.SocketServerGameInit, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageAddShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageAddShell, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageRemoveShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageUpdateWorldState, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageShipMove, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageShipShoot, this);
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

	public function notify(eventType:EventType, params:Dynamic) {
		switch (eventType) {
			case SocketServerGameInit:
				game.startGame(playerId, jsShipsToHaxeGameEngineShips(params));
			case SocketServerMessageAddShip:
				game.addShip(jsShipToHaxeGameEngineShip(params));
			case SocketServerMessageAddShell:
				trace("SocketServerMessageAddShell");
			case SocketServerMessageRemoveShip:
				trace("SocketServerMessageRemoveShip");
				game.removeShip(params);
			case SocketServerMessageUpdateWorldState:
			// if (gameState == GameState.Init) {
			// gameState = GameState.Playing;
			// TODO add all ships and init gameplay
			// }
			// trace("SocketServerMessageUpdateWorldState");
			// jsShipsToHaxe(params);
			// TODO type cast here
			case SocketServerMessageShipMove:
				trace('SocketServerMessageShipMove');
				game.shipMove(params.shipId, params.up, params.down, params.left, params.right);
			case SocketServerMessageShipShoot:
				trace('SocketServerMessageShipShoot');
				game.shipShoot(params);
			default:
				trace('Unknown socket message');
		}
	}

	// TODO convert into GameEngineShips
	private function jsShipToHaxeGameEngineShip(message:ServerShip) {
		return new EngineShipEntity(message.ship.x, message.ship.y, message.ship.id, message.ship.ownerId);
	}

	private function jsShipsToHaxeGameEngineShips(message:ServerShips) {
		return message.ships.map(ship -> {
			return new EngineShipEntity(ship.x, ship.y, ship.id, ship.ownerId);
		});
	}
}
