package client.scene;

import client.event.EventManager;
import client.event.EventManager.EventType;
import client.event.EventManager.EventListener;
import client.network.Socket;
import h2d.Scene;

enum GameState {
	Init;
	Playing;
}

typedef ServerShips = {
	ships:Array<ServerShip>
}

typedef ServerShip = {
	id:String,
	ownerId:String
}

class SceneOnlineDemo1 extends Scene implements EventListener {
	private final fui:h2d.Flow;
	private final gui:Gui;

	private var gameState = GameState.Init;

	public function new() {
		super();

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

		gui = new Gui(fui);

		gui.addButton("Connect socket", function() {
			Socket.instance.joinGame("UserId1");
		});

		EventManager.instance.subscribe(EventType.SocketServerMessageAddShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageAddShell, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageRemoveShip, this);
		EventManager.instance.subscribe(EventType.SocketServerMessageUpdateWorldState, this);
	}

	public function update(eventType:EventType, params:Dynamic) {
		switch (eventType) {
			case SocketServerMessageAddShip:
				trace("SocketServerMessageAddShip");
			case SocketServerMessageAddShell:
				trace("SocketServerMessageAddShell");
			case SocketServerMessageRemoveShip:
				trace("SocketServerMessageRemoveShip");
			case SocketServerMessageUpdateWorldState:
				if (gameState == GameState.Init) {
					gameState = GameState.Playing;
					// TODO add all ships and init gameplay
				}
				trace("SocketServerMessageUpdateWorldState");
				jsShipsToHaxe(params);
				// TODO type cast here
				trace(params);
			default:
				trace('Unknown socket message');
		}
	}

	private function jsShipsToHaxe(ships:ServerShips) {
		for (ship in ships.ships) {
			trace(ship);
		}
	}
}
