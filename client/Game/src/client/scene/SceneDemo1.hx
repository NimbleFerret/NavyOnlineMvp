package client.scene;

import engine.entity.EngineShipEntity.Role;
import engine.GameEngine.EngineMode;
import h3d.Engine;
import h2d.Scene;

class SceneDemo1 extends Scene {
	private final game:Game;

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
		game = new Game(this, EngineMode.Client);

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
}
