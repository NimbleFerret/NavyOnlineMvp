package client.scene;

import game.engine.entity.EngineShipEntity;
import h2d.Scene;
import h3d.Engine;
import client.gameplay.battle.BattleGameplay;
import client.ui.hud.DebugHud;
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
		// scaleMode = LetterBox(1920, 1080, true, Center, Center);
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);
		// debugHud = new DebugHud();
	}

	public function start() {
		game = new BattleGameplay(this, EngineMode.Client, function callback() {}, function callback() {});

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		final playerId = Player.instance.ethAddress;
		final bot1Id = 'Bot1';

		final ship1 = new EngineShipEntity(new ShipObjectEntity({
			x: 392,
			y: 207,
			minSpeed: 0,
			maxSpeed: 300,
			acceleration: 50,
			direction: GameEntityDirection.NORTH_EAST,
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
		}));

		// final ship2 = game.addShipByClient(new ShipObjectEntity({
		// 	x: 100,
		// 	y: 100,
		// 	minSpeed: 0,
		// 	maxSpeed: 300,
		// 	acceleration: 50,
		// 	direction: GameEntityDirection.EAST,
		// 	id: null,
		// 	ownerId: bot1Id,
		// 	serverShipRef: "",
		// 	free: true,
		// 	role: Role.BOT,
		// 	shipHullSize: ShipHullSize.SMALL,
		// 	shipWindows: ShipWindows.NONE,
		// 	shipCannons: ShipCannons.ONE,
		// 	cannonsRange: 500,
		// 	cannonsDamage: 1,
		// 	cannonsAngleSpread: 40,
		// 	armor: 100,
		// 	hull: 100,
		// 	accDelay: 0.500,
		// 	turnDelay: 0.500,
		// 	fireDelay: 0.500
		// }));

		// final ship2 = game.addShipByClient(Role.Boss, -200, -200, ShipHullSize.MEDIUM, ShipWindows.NONE, ShipGuns.THREE, 300, 400, 500, 500, 300, 50, 0.500,
		// 0.500, 0.500, null, null);
		// final ship3 = game.addShipByClient(Role.Bot, 100, -100, null, null);
		// final ship4 = game.addShipByClient(Role.Bot, 300, -100, null, null);
		// final ship5 = game.addShipByClient(Role.Bot, 300, -600, null, null);

		game.startGameSingleplayer(playerId, [ship1]);
		// game.startGameByClient(playerId, [ship1, ship2, ship3, ship4, ship5]);

		// camera.scale(2, 2);
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

			// islandsManager.update();
		}
	}

	public function getHud() {
		return game.hud;
	}
}
