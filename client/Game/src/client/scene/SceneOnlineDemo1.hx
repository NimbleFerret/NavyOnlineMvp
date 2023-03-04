package client.scene;

import h2d.Scene;
import h3d.Engine;
import client.gameplay.battle.BattleGameplay;
import client.event.EventManager;
import client.event.EventManager.EventListener;
import client.network.Socket;
import client.network.SocketProtocol;
import game.engine.BaseEngine.EngineMode;

class SceneOnlineDemo1 extends Scene implements EventListener {
	private var instanceId:String;
	private var game:BattleGameplay;
	private var leaveCallback:Void->Void;
	private var diedCallback:Void->Void;

	public function new(leaveCallback:Void->Void, diedCallback:Void->Void) {
		super();

		this.leaveCallback = leaveCallback;
		this.diedCallback = diedCallback;
		scaleMode = LetterBox(1920, 1080, true, Center, Center);
		camera.setViewport(1920 / 2, 1080 / 2, 0, 0);
	}

	public function start(instanceId:String) {
		this.instanceId = instanceId;

		game = new BattleGameplay(this, EngineMode.Server, function callbackLeave() {
			if (leaveCallback != null) {
				game = null;
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventGameInit, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventAddEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityInput, this);
				// EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventEntityMove, this);
				// EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventShipShoot, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventSync, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventDailyTaskUpdate, this);
				EventManager.instance.unsubscribe(SocketProtocol.SocketServerEventDailyTaskReward, this);
				leaveCallback();
			}
		}, function callbackDied() {
			if (diedCallback != null) {
				diedCallback();
			}
		});

		Socket.instance.joinGame({
			playerId: Player.instance.ethAddress,
			instanceId: instanceId,
			sectorType: 1,
			entityId: Player.instance.currentShipId
		});

		EventManager.instance.subscribe(SocketProtocol.SocketServerEventGameInit, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventAddEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventRemoveEntity, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventUpdateWorldState, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityInput, this);
		// EventManager.instance.subscribe(SocketProtocol.SocketServerEventEntityMove, this);
		// EventManager.instance.subscribe(SocketProtocol.SocketServerEventShipShoot, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventSync, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventDailyTaskUpdate, this);
		EventManager.instance.subscribe(SocketProtocol.SocketServerEventDailyTaskReward, this);
	}

	public override function render(e:Engine) {
		game.waterScene.render(e);
		super.render(e);
		game.hud.render(e);
		game.debugDraw();
	}

	public function onResize() {
		// game.onResize();
	}

	public function update(dt:Float, fps:Float) {
		final c = camera;

		// if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
		// 	c.scale(1.25, 1.25);
		// if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
		// 	c.scale(0.8, 0.8);

		game.update(dt, fps);
	}

	public function getHud() {
		return game.hud;
	}

	public function notify(event:String, message:Dynamic) {
		switch (event) {
			case SocketProtocol.SocketServerEventGameInit:
				game.startGameMultiplayer(Player.instance.ethAddress.toLowerCase(), message);
			case SocketProtocol.SocketServerEventAddEntity:
				game.addEntity(message);
			case SocketProtocol.SocketServerEventRemoveEntity:
				game.removeEntity(message);
			case SocketProtocol.SocketServerEventUpdateWorldState:
				game.updateWorldState(message);
			case SocketProtocol.SocketServerEventEntityInput:
				game.entityInput(message);
			// case SocketProtocol.SocketServerEventEntityMove:
			// 	game.entityMove(message);
			// case SocketProtocol.SocketServerEventShipShoot:
			// 	game.shipShoot(message);
			case SocketProtocol.SocketServerEventSync:
				game.sync(message);
			case SocketProtocol.SocketServerEventDailyTaskUpdate:
				game.updateDailyTasks();
			case SocketProtocol.SocketServerEventDailyTaskReward:
				game.dailyTaskComplete(message);
			default:
				trace('Unknown socket message');
		}
	}
}
