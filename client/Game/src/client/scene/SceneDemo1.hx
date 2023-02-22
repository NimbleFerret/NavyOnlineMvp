package client.scene;

import client.gameplay.battle.BattleGameplay;
import client.gameplay.battle.DebugHud;
import client.manager.IslandsManager;
import game.engine.entity.TypesAndClasses;
import game.engine.BaseEngine.EngineMode;
import h3d.Engine;
import h2d.Scene;

class SceneDemo1 extends Scene {
	private var game:BattleGameplay;
	private var islandsManager:IslandsManager;

	// UI parts
	public final debugHud:DebugHud;

	private var allowSomething = false;

	public function new(width:Int, height:Int) {
		super();
		// scaleMode = LetterBox(1920, 1080, true, Center, Center);
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);
		debugHud = new DebugHud();
	}

	public function start() {
		game = new BattleGameplay(this, EngineMode.Client, function callback() {}, function callback() {});

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		final playerId = 'Player1';

		final ship1 = game.addShipByClient({
			x: 300,
			y: 300,
			minSpeed: 0,
			maxSpeed: 300,
			acceleration: 50,
			direction: GameEntityDirection.East,
			id: null,
			ownerId: playerId,
			serverShipRef: "",
			free: true,
			role: Role.Player,
			shipHullSize: ShipHullSize.SMALL,
			shipWindows: ShipWindows.NONE,
			shipCannons: ShipCannons.ONE,
			cannonsRange: 500,
			cannonsDamage: 50,
			cannonsAngleSpread: 40,
			armor: 100,
			hull: 100,
			accDelay: 0.500,
			turnDelay: 0.500,
			fireDelay: 0.500
		});

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
		debugHud.render(e);
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
