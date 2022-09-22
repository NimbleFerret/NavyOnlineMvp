package client.scene;

import client.entity.ship.ShipDecorations;
import client.entity.ship.ShipTemplate;
import h2d.Scene;
import hxd.Key in K;

class SceneShipsDemo extends Scene {
	var smallShip:ShipTemplate;
	var mediumShip:ShipTemplate;

	var fui:h2d.Flow;

	public function new() {
		super();

		// smallShip = new ShipTemplate(MEDIUM, NONE, THREE);
		// smallShip.setPosition(400, 300);

		// addChild(smallShip);

		// mediumShip = new ShipTemplate(this, MEDIUM, ONE, FOUR);
		// mediumShip.setPosition(800, 300);

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

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
			smallShip.changeDirLeft();
			// mediumShip.changeDirLeft();
		}

		final right = K.isPressed(K.RIGHT);
		if (right) {
			smallShip.changeDirRight();
			// mediumShip.changeDirRight();
		}

		final e = K.isPressed(K.E);
		if (e) {
			smallShip.shootRight();
			// mediumShip.shootRight();
		}

		final q = K.isPressed(K.Q);
		if (q) {
			smallShip.shootLeft();
			mediumShip.shootLeft();
		}

		smallShip.update();
		// mediumShip.update();
	}

	private function getFont() {
		return hxd.res.DefaultFont.get();
	}

	private function addSlider(label:String, get:Void->Float, set:Float->Void, min:Float = 0., max:Float = 1.) {
		var f = new h2d.Flow(fui);
		f.horizontalSpacing = 5;
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		tf.maxWidth = 70;
		tf.textAlign = Right;
		var sli = new h2d.Slider(100, 10, f);
		sli.minValue = min;
		sli.maxValue = max;
		sli.value = get();
		var tf = new h2d.TextInput(getFont(), f);
		tf.text = "" + hxd.Math.fmt(sli.value);
		sli.onChange = function() {
			set(sli.value);
			tf.text = "" + hxd.Math.fmt(sli.value);
			f.needReflow = true;
		};
		tf.onChange = function() {
			var v = Std.parseFloat(tf.text);
			if (Math.isNaN(v))
				return;
			sli.value = v;
			set(v);
		};
		return sli;
	}
}
