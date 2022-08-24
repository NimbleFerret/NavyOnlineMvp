package client.scene;

import h3d.Engine;
import h2d.Scene;

class SceneDemo1 extends Scene {
	private final game:Game;

	public function new(width:Int, height:Int) {
		super();

		camera.setViewport(width / 2, height / 2, 0, 0);
		game = new Game(this);

		// --------------------------------------
		// Mocked client data
		// --------------------------------------

		// final newEngineShip = gameEngine.addShip(100, 100, "1");
		// final newClientShip = new ClientShip(scene, newEngineShip);
		// clientShips.set(newEngineShip.id, newClientShip);
		// playerShipId = newEngineShip.id;

		// final newEngineShip2 = gameEngine.addShip(100, -200, "2");
		// final newClientShip2 = new ClientShip(scene, newEngineShip2);
		// clientShips.set(newEngineShip2.id, newClientShip2);
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
