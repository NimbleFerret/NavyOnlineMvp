package client.scene;

import uuid.Uuid;
import engine.GameEngine.EngineMode;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.network.Socket;
import client.network.SocketProtocol;
import h3d.Engine;
import h2d.Scene;

class SceneOnlineDemo1 extends Scene implements EventListener {
	private var game:Game;

	public var instanceId:String;

	//
	private var leaveCallback:Void->Void;

	//

	public function new(width:Int, height:Int, leaveCallback:Void->Void) {
		super();
		this.leaveCallback = leaveCallback;
		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start() {
		game = new Game(this, EngineMode.Server, function callback() {
			if (leaveCallback != null) {
				leaveCallback();
			}
		});

		Socket.instance.joinGame({playerId: Player.instance.playerData.ethAddress, instanceId: instanceId});

		// game.joinNewGameCallback = function callback() {
		// 	Socket.instance.joinGame({playerId: playerId, instanceId: ''});
		// }
		// game.joinExistingGameCallback = function callback() {}

		// game.hud.addButton("Connect socket", function() {
		// 	Socket.instance.joinGame({playerId: playerId});
		// });

		// game.hud.addButton("Retry", function() {
		// Socket.instance.joinGame({playerId: playerId});
		// });

		// Rest.instance.foo();

		EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddShip, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveShip, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventShipMove, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventShipShoot, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
	}

	public override function render(e:Engine) {
		game.hud.render(e);
		super.render(e);
		game.debugDraw();
	}

	public function onResize() {
		// game.onResize();
	}

	public function update(dt:Float, fps:Float) {
		game.update(dt, fps);
	}

	public function getHud() {
		return game.hud;
	}

	public function notify(event:String, message:Dynamic) {
		switch (event) {
			case SocketProtocol.SocketServerEventGameInit:
				game.startGame(Player.instance.playerData.ethAddress, message);
			case SocketProtocol.SocketServerEventAddShip:
				game.addShip(message);
			case SocketProtocol.SocketServerEventRemoveShip:
				game.removeShip(message);
			case SocketProtocol.SocketServerEventUpdateWorldState:
				game.updateWorldState(message);
			case SocketProtocol.SocketServerEventShipMove:
				game.shipMove(message);
			case SocketProtocol.SocketServerEventShipShoot:
				game.shipShoot(message);
			case SocketProtocol.SocketServerEventSync:
				game.sync(message);
			default:
				trace('Unknown socket message');
		}
	}
}
