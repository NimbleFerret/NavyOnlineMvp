package client.scene;

import client.entity.ship.MidShip;
import h2d.Scene;
import hxd.Key in K;

class SceneShipsDemo extends Scene {
	var ship:MidShip;

	public function new() {
		super();

		ship = new MidShip(this, ONE, FOUR);
		ship.setPosition(700, 400);
	}

	public function update() {
		final left = K.isPressed(K.LEFT);
		if (left) {
			ship.changeDirLeft();
		}

		final right = K.isPressed(K.RIGHT);
		if (right) {
			ship.changeDirRight();
		}

		final e = K.isPressed(K.E);
		if (e) {
			ship.shootRight();
		}

		final q = K.isPressed(K.Q);
		if (q) {
			ship.shootLeft();
		}

		ship.update();
	}
}
