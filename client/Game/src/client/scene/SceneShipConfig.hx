package client.scene;

import h2d.Scene;
import hxd.Key in K;
import client.entity.ship.ShipTemplate;
import game.engine.entity.TypesAndClasses;

class SceneShipConfig extends Scene {
	private final ship:ShipTemplate;

	public function new() {
		super();

		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);

		ship = new ShipTemplate(GameEntityDirection.East, ShipHullSize.SMALL, ShipWindows.NONE, ShipCannons.ONE);
		ship.setPosition(-600, -200);

		addChild(ship);

		// mediumShip = new ShipTemplate(this, MEDIUM, ONE, FOUR);
		// mediumShip.setPosition(800, 300);

		// addCheck("Relative", function() return g.isRelative, function(v) g.isRelative = v);

		// addSlider("Capt X ", function() return ShipDecorations.bmp_captain.x, function(v) ShipDecorations.bmp_captain.x = v, -300, 300);
		// addSlider("Capt Y ", function() return ShipDecorations.bmp_captain.y, function(v) ShipDecorations.bmp_captain.y = v, -300, 300);

		// addSlider("Right gun2 X ", function() return smallShip.rightSideGun2.x, function(v) smallShip.rightSideGun2.x = v, -300, 300);
		// addSlider("Right gun2 Y ", function() return smallShip.rightSideGun2.y, function(v) smallShip.rightSideGun2.y = v, -300, 300);
		// addSlider("Right gun3 X ", function() return smallShip.rightSideGun3.x, function(v) smallShip.rightSideGun3.x = v, -300, 300);
		// addSlider("Right gun3 Y ", function() return smallShip.rightSideGun3.y, function(v) smallShip.rightSideGun3.y = v, -300, 300);

		// addSlider("Left gun1 X ", function() return smallShip.leftSideGun1.x, function(v) smallShip.leftSideGun1.x = v, -300, 300);
		// addSlider("Left gun1 Y ", function() return smallShip.leftSideGun1.y, function(v) smallShip.leftSideGun1.y = v, -300, 300);
		// addSlider("Left gun2 X ", function() return smallShip.leftSideGun2.x, function(v) smallShip.leftSideGun2.x = v, -300, 300);
		// addSlider("Left gun2 Y ", function() return smallShip.leftSideGun2.y, function(v) smallShip.leftSideGun2.y = v, -300, 300);
		// addSlider("Left gun3 X ", function() return smallShip.leftSideGun3.x, function(v) smallShip.leftSideGun3.x = v, -300, 300);
		// addSlider("Left gun3 Y ", function() return smallShip.leftSideGun3.y, function(v) smallShip.leftSideGun3.y = v, -300, 300);
	}

	public function update() {
		final c = camera;

		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP))
			c.scale(1.25, 1.25);
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN))
			c.scale(0.8, 0.8);

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
