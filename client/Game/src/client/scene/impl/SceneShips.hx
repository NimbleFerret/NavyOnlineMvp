package client.scene.impl;

import client.gameplay.battle.BattleGameplay;
import client.network.RestProtocol.JoinSectorResponse;
import client.network.SocketProtocol;
import client.scene.base.BasicOnlineScene;
import game.engine.navy.NavyTypesAndClasses;
import game.engine.navy.entity.NavyShipEntity;
import game.engine.base.BaseTypesAndClasses;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.core.BaseEngine.EngineMode;
import h3d.Engine;

class SceneShips extends BasicOnlineScene {
	private var allowSomething = false;
	private var leaveCallback:Void->Void;
	private var diedCallback:Void->Void;

	public function new(engineMode:EngineMode, leaveCallback:Void->Void, diedCallback:Void->Void) {
		super(engineMode);
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);

		this.leaveCallback = leaveCallback;
		this.diedCallback = diedCallback;
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public override function start(?response:JoinSectorResponse) {
		instanceId = response.instanceId;

		game = new BattleGameplay(this, engineMode, function callbackLeave() {
			if (leaveCallback != null) {
				game = null;
				unsubscribeFromServerEvents();
				leaveCallback();
			}
		}, function callbackDied() {
			if (diedCallback != null) {
				diedCallback();
			}
		});

		if (game.baseEngine.engineMode == EngineMode.Server) {
			joinGame();
			subscribeToServerEvents([
				SocketProtocol.SocketServerEventDailyTaskUpdate,
				SocketProtocol.SocketServerEventDailyTaskReward
			]);
		} else {
			// Mocked client data
			final playerId = Player.instance.playerId;
			final ships = new Array<EngineBaseGameEntity>();
			ships.push(new NavyShipEntity(new ShipObjectEntity({
				x: -300,
				y: 207,
				minSpeed: 0,
				maxSpeed: 300,
				currentSpeed: 0,
				acceleration: 50,
				direction: GameEntityDirection.EAST,
				id: null,
				ownerId: playerId,
				serverShipRef: "",
				free: true,
				role: Role.PLAYER,
				shipHullSize: ShipHullSize.SMALL,
				shipWindows: ShipWindows.NONE,
				shipCannons: ShipCannons.ONE,
				cannonsRange: 1500,
				cannonsDamage: 1,
				cannonsAngleSpread: 40,
				cannonsShellSpeed: 400,
				armor: 300,
				hull: 300,
				movementDelay: 0.500,
				turnDelay: 0.500,
				fireDelay: 0.100
			})));
			var botX = 0;
			var botY = 0;
			var botIndex = 0;
			for (i in 0...0) {
				for (j in 0...0) {
					ships.push(new NavyShipEntity(new ShipObjectEntity({
						x: botX,
						y: botY,
						minSpeed: 0,
						maxSpeed: 300,
						currentSpeed: 0,
						acceleration: 50,
						direction: GameEntityDirection.EAST,
						id: 'botShip_' + botIndex,
						ownerId: 'botId_' + botIndex,
						serverShipRef: "",
						free: true,
						role: Role.BOT,
						shipHullSize: ShipHullSize.SMALL,
						shipWindows: ShipWindows.NONE,
						shipCannons: ShipCannons.ONE,
						cannonsRange: 1500,
						cannonsDamage: 1,
						cannonsAngleSpread: 40,
						cannonsShellSpeed: 400,
						armor: 100,
						hull: 100,
						movementDelay: 0.500,
						turnDelay: 0.500,
						fireDelay: 0.500
					})));
					botX += 200;
					botIndex++;
				}
				botX = 0;
				botY += 300;
				botIndex++;
			}
			game.startGameSingleplayer(playerId, ships);
		}
	}

	public function processCustomServerEvent(event:String, message:Dynamic) {
		switch (event) {
			case SocketProtocol.SocketServerEventDailyTaskUpdate:
				getBattleGameplay().updateDailyTasks();
			case SocketProtocol.SocketServerEventDailyTaskReward:
				getBattleGameplay().dailyTaskComplete(message);
			default:
				trace('Unknown socket message');
		}
	}

	public function getInputScene() {
		return getBattleGameplay().hud;
	}

	// --------------------------------------
	// General
	// --------------------------------------

	public override function render(e:Engine) {
		getBattleGameplay().waterScene.render(e);
		super.render(e);
		getBattleGameplay().hud.render(e);
		getBattleGameplay().debugDraw();
	}

	public function getHud() {
		return getBattleGameplay().hud;
	}

	private function getBattleGameplay() {
		return cast(game, BattleGameplay);
	}
}
