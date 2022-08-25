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
		final ship1 = game.addShipByClient(Role.Player, 100, 100, null, playerId);
		final ship2 = game.addShipByClient(Role.Bot, 100, -600, null, null);
		game.startGame(playerId, [ship1, ship2]);
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
