package client.scene;

import client.gameplay.battle.BattleGameplay;
import engine.entity.EngineShipEntity.Role;
import engine.BaseEngine.EngineMode;
import h3d.Engine;
import h2d.Scene;

class SceneDemo1 extends Scene {
	private var game:BattleGameplay;

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
	}

	public function start() {
		game = new BattleGameplay(this, EngineMode.Client, function callback() {});

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		final playerId = 'Player1';
		final ship1 = game.addShipByClient(Role.Player, -200, 100, null, playerId);

		final ship2 = game.addShipByClient(Role.Bot, -200, -400, null, null);
		// final ship3 = game.addShipByClient(Role.Bot, 100, -100, null, null);
		// final ship4 = game.addShipByClient(Role.Bot, 300, -100, null, null);
		// final ship5 = game.addShipByClient(Role.Bot, 300, -600, null, null);

		game.startGameByClient(playerId, [ship1, ship2]);
		// game.startGameByClient(playerId, [ship1, ship2, ship3, ship4, ship5]);
	}

	public override function render(e:Engine) {
		super.render(e);
		game.hud.render(e);
		game.debugDraw();
	}

	public function update(dt:Float, fps:Float) {
		game.update(dt, fps);
	}

	public function getHud() {
		return game.hud;
	}
}
