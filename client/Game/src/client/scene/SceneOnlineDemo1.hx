package client.scene;

import engine.entity.EngineShipEntity;
import client.event.EventManager;
import client.event.EventManager.EventType;
import client.event.EventManager.EventListener;
import client.network.Socket;
import h3d.Engine;
import h2d.Scene;

typedef ServerShips = {
	ships:Array<ServerShip>
}

typedef ServerShip = {
	id:String,
	ownerId:String,
	x:Int,
	y:Int
}

class SceneOnlineDemo1 extends Scene implements EventListener {
	// private final fui:h2d.Flow;
	// private final gui:Gui;
	private final game:Game;

	public var playerId = 'UserId1';

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
		game = new Game(this);

		// fui = new h2d.Flow(this);
		// fui.layout = Vertical;
		// fui.verticalSpacing = 5;
		// fui.padding = 10;
		// fui.y = 10;

		// gui = new Gui(fui);

		game.hud.addButton("Connect socket", function() {
			Socket.instance.joinGame(playerId);
		});

		EventManager.instance.subscribe(EventType.SocketServerGameInit, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageAddShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageAddShell, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageRemoveShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageUpdateWorldState, this);
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
				trace("SocketServerGameInit");
			case SocketServerMessageAddShip:
				trace("SocketServerMessageAddShip");
			case SocketServerMessageAddShell:
				trace("SocketServerMessageAddShell");
			case SocketServerMessageRemoveShip:
				trace("SocketServerMessageRemoveShip");
			case SocketServerMessageUpdateWorldState:
				// if (gameState == GameState.Init) {
				// gameState = GameState.Playing;
				// TODO add all ships and init gameplay
				// }
				// trace("SocketServerMessageUpdateWorldState");
				// jsShipsToHaxe(params);
				// TODO type cast here
				trace(params);
			default:
				trace('Unknown socket message');
		}
	}

	// TODO convert into GameEngineShips
	private function jsShipsToHaxeGameEngineShips(ships:ServerShips) {
		return ships.ships.map(ship -> {
			return new EngineShipEntity(ship.x, ship.y, ship.id, ship.ownerId);
		});
	}
}
