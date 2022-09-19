package client.scene;

import client.gameplay.battle.BattleGameplay;
import engine.entity.EngineShipEntity.Role;
import engine.entity.EngineShipEntity;
import engine.BaseEngine.EngineMode;
import h3d.Engine;
import h2d.Scene;

class SceneDemo1 extends Scene {
	private var game:BattleGameplay;
	private var islandsManager:IslandsManager;

	public function new(width:Int, height:Int) {
		super();
		scaleMode = LetterBox(1920, 1080, true, Center, Center);
		camera.setViewport(1920 / 2, 1080 / 2, 0, 0);
	}

	public function start() {
		game = new BattleGameplay(this, EngineMode.Client, function callback() {}, function callback() {});

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		// cannonsRange:Int, cannonsDamage:Int, armor:Int, hull:Int, maxSpeed:Int, acc:Int, accDelay:Float, turnDelay:Float, fireDelay:Float

		final playerId = 'Player1';
		final ship1 = game.addShipByClient(Role.Player, -200, 100, ShipHullSize.MEDIUM, ShipWindows.NONE, ShipGuns.FOUR, 300, 100, 500, 500, 300, 50, 0.500,
			0.500, 0.500, null, playerId);

		final ship2 = game.addShipByClient(Role.Boss, -200, -200, ShipHullSize.MEDIUM, ShipWindows.NONE, ShipGuns.THREE, 300, 400, 500, 500, 300, 50, 0.500,
			0.500, 0.500, null, null);
		// final ship3 = game.addShipByClient(Role.Bot, 100, -100, null, null);
		// final ship4 = game.addShipByClient(Role.Bot, 300, -100, null, null);
		// final ship5 = game.addShipByClient(Role.Bot, 300, -600, null, null);

		game.startGameByClient(playerId, [ship1, ship2]);
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
