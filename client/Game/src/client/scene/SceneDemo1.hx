package client.scene;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.EngineShipEntity;
import h2d.Scene;
import h3d.Engine;
import client.gameplay.battle.BattleGameplay;
import client.manager.IslandsManager;
import game.engine.entity.TypesAndClasses;
import game.engine.BaseEngine.EngineMode;

class SceneDemo1 extends Scene {
	private var game:BattleGameplay;
	private var islandsManager:IslandsManager;

	// UI parts
	// public final debugHud:DebugHud;
	private var allowSomething = false;

	public function new(width:Int, height:Int) {
		super();
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);
	}

	public function start() {
		game = new BattleGameplay(this, EngineMode.Server, function callback() {}, function callback() {});

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		final playerId = Player.instance.playerId;

		final ships = new Array<EngineBaseGameEntity>();

		ships.push(new EngineShipEntity(new ShipObjectEntity({
			x: 100,
			y: 207,
			minSpeed: 0,
			maxSpeed: 300,
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
			cannonsRange: 500,
			cannonsDamage: 1,
			cannonsAngleSpread: 40,
			armor: 300,
			hull: 300,
			accDelay: 0.500,
			turnDelay: 0.500,
			fireDelay: 0.500
		})));

		var botX = 0;
		var botY = 0;
		var botIndex = 0;

		for (i in 0...2) {
			for (j in 0...2) {
				ships.push(new EngineShipEntity(new ShipObjectEntity({
					x: botX,
					y: botY,
					minSpeed: 0,
					maxSpeed: 300,
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
					cannonsRange: 500,
					cannonsDamage: 1,
					cannonsAngleSpread: 40,
					armor: 100,
					hull: 100,
					accDelay: 0.500,
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

	public override function render(e:Engine) {
		game.waterScene.render(e);
		super.render(e);
		game.hud.render(e);
		game.debugDraw();
	}

	public function update(dt:Float, fps:Float) {
		if (game != null) {
			final c = camera;

			if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
				c.scale(1.25, 1.25);
			if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
				c.scale(0.8, 0.8);

			game.update(dt, fps);
		}
	}

	public function getHud() {
		return game.hud;
	}
}
