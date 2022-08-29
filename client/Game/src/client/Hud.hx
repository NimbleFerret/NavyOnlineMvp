package client;

import client.network.Socket;
import h2d.Object;
import h2d.SpriteBatch.BatchElement;
import client.entity.ClientShip;

class HorizontalStatsBar {
	final guiObject:h2d.Object;

	final borderRect:h2d.Graphics;
	final fillRect:h2d.Graphics;
	final descriptionText:h2d.Text;
	final valueText:h2d.Text;

	final rectMaxWidth = 320;
	final rectX:Float;
	final rectY:Float;

	public function new(fui:h2d.Flow, x:Float, y:Float, desctiption:String, value:String, additionalOffsetX:Float = 0.0) {
		guiObject = new h2d.Object(fui);

		rectX = x + 100 + additionalOffsetX;
		rectY = y + 15;

		descriptionText = new h2d.Text(hxd.res.DefaultFont.get(), guiObject);
		descriptionText.text = desctiption;
		descriptionText.setScale(4);

		borderRect = new h2d.Graphics(guiObject);
		borderRect.lineStyle(3, 0xFFFFFF);
		borderRect.drawRect(rectX, rectY, rectMaxWidth, 40);
		borderRect.endFill();

		fillRect = new h2d.Graphics(guiObject);
		fillRect.beginFill(0x00FF00);
		fillRect.drawRect(rectX + 2, rectY + 2, rectMaxWidth - 4, 40 - 3);
		fillRect.endFill();

		valueText = new h2d.Text(hxd.res.DefaultFont.get(), guiObject);
		valueText.text = value + " / " + value;
		valueText.setScale(3);
		valueText.setPosition(x + 160 + additionalOffsetX, y + 9);
	}

	public function updateBar(maxValue:Float, currentValue:Float) {
		var extraZeroes = "";

		if (currentValue < 1000) {
			if (currentValue < 10) {
				extraZeroes = "000";
			} else if (currentValue < 100) {
				extraZeroes = "00";
			} else {
				extraZeroes = "0";
			}
		}

		valueText.text = extraZeroes + Std.string(currentValue) + " / " + Std.string(maxValue);

		final percentage = currentValue / maxValue * 100;
		final newFillRectWidth = rectMaxWidth / 100 * percentage;

		fillRect.clear();

		if (currentValue > 0) {
			fillRect.beginFill(0x00FF00);
			fillRect.drawRect(rectX + 2, rectY + 2, newFillRectWidth - 4, 40 - 3);
			fillRect.endFill();
		}
	}

	public function show(show:Bool) {
		guiObject.alpha = show ? 1 : 0;
	}
}

class RetryDialog {
	public function new(fui:h2d.Flow, x:Float, y:Float) {
		final guiObject = new h2d.Object(fui);

		final fillRect = new h2d.Graphics(guiObject);
		fillRect.beginFill(0x6D563D);
		fillRect.drawRect(x, y, 100, 100);
		fillRect.endFill();
	}
}

class Hud extends h2d.Scene {
	public static final DrawWaterBg = false;

	private var movementText:h2d.Text;
	private var dirText:h2d.Text;
	private var systemText:h2d.Text;
	private var latencyText:h2d.Text;

	private var leftCannonsText:h2d.Text;
	private var rightCannonsText:h2d.Text;

	var waterBgObject:h2d.Object;
	var waterBgbatch:h2d.SpriteBatch;
	var displacementTile:h2d.Tile;

	var playerDX = 0.0;
	var playerDY = 0.0;

	var fui:h2d.Flow;

	// HP bars
	final armorBar:HorizontalStatsBar;
	final hullBar:HorizontalStatsBar;

	public function new() {
		super();

		if (DrawWaterBg) {
			displacementTile = hxd.Res.normalmap.toTile();
			waterBgObject = new h2d.Object(this);

			var waterBgTile = hxd.Res.water_tile.toTile();
			waterBgTile = waterBgTile.center();

			waterBgbatch = new h2d.SpriteBatch(waterBgTile, waterBgObject);

			for (y in 0...15)
				for (x in 0...20) {
					var batchElement = new h2d.BatchElement(waterBgTile);
					batchElement.x = 48 * x;
					batchElement.y = 48 * y;
					waterBgbatch.add(batchElement);
				}
			waterBgbatch.tileWrap = true;
			waterBgbatch.setScale(4.0);
			waterBgObject.filter = new h2d.filter.Displacement(displacementTile, 4, 4);
		}

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

		armorBar = new HorizontalStatsBar(fui, 0, 0, "Armor", "1000", 65);
		hullBar = new HorizontalStatsBar(fui, 0, 0, "Hull", "1000", 65);

		movementText = addText();
		movementText.setScale(4);

		dirText = addText();
		dirText.setScale(4);

		leftCannonsText = addText("Left side cannons READY");
		leftCannonsText.setScale(4);

		rightCannonsText = addText("Right side cannons READY");
		rightCannonsText.setScale(4);

		systemText = addText();
		systemText.setScale(4);

		latencyText = addText();
		latencyText.setScale(4);

		show(false);
	}

	public function show(show:Bool) {
		armorBar.show(show);
		hullBar.show(show);

		movementText.alpha = show ? 1 : 0;
		dirText.alpha = show ? 1 : 0;
		leftCannonsText.alpha = show ? 1 : 0;
		rightCannonsText.alpha = show ? 1 : 0;
	}

	// TODO reuse GUI class

	public function getFont() {
		return hxd.res.DefaultFont.get();
	}

	public function addButton(label:String, onClick:Void->Void) {
		var f = new h2d.Flow(fui);
		f.padding = 5;
		f.paddingBottom = 7;
		f.backgroundTile = h2d.Tile.fromColor(0x404040);
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		f.enableInteractive = true;
		f.interactive.cursor = Button;
		f.interactive.onClick = function(_) onClick();
		f.interactive.onOver = function(_) f.backgroundTile = h2d.Tile.fromColor(0x606060);
		f.interactive.onOut = function(_) f.backgroundTile = h2d.Tile.fromColor(0x404040);
		return f;
	}

	public function addSlider(label:String, get:Void->Float, set:Float->Void, min:Float = 0., max:Float = 1.) {
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

	public function addCheck(label:String, get:Void->Bool, set:Bool->Void) {
		var f = new h2d.Flow(fui);
		f.horizontalSpacing = 5;
		var tf = new h2d.Text(getFont(), f);
		tf.text = label;
		tf.maxWidth = 70;
		tf.textAlign = Right;
		var size = 10;
		var b = new h2d.Graphics(f);
		function redraw() {
			b.clear();
			b.beginFill(0x808080);
			b.drawRect(0, 0, size, size);
			b.beginFill(0);
			b.drawRect(1, 1, size - 2, size - 2);
			if (get()) {
				b.beginFill(0xC0C0C0);
				b.drawRect(2, 2, size - 4, size - 4);
			}
		}
		var i = new h2d.Interactive(size, size, b);
		i.onClick = function(_) {
			set(!get());
			redraw();
		};
		redraw();
		return i;
	}

	public function addChoice(text, choices, callb:Int->Void, value = 0) {
		var font = getFont();
		var i = new h2d.Interactive(110, font.lineHeight, fui);
		i.backgroundColor = 0xFF808080;
		fui.getProperties(i).paddingLeft = 20;
		var t = new h2d.Text(font, i);
		t.maxWidth = i.width;
		t.text = text + ":" + choices[value];
		t.textAlign = Center;
		i.onClick = function(_) {
			value++;
			value %= choices.length;
			callb(value);
			t.text = text + ":" + choices[value];
		};
		i.onOver = function(_) {
			t.textColor = 0xFFFFFF;
		};
		i.onOut = function(_) {
			t.textColor = 0xEEEEEE;
		};
		i.onOut(null);
		return i;
	}

	public function addText(text = "") {
		var tf = new h2d.Text(getFont(), fui);
		tf.text = text;
		return tf;
	}

	// UPDATES

	public function update(dt:Float) {
		if (DrawWaterBg) {
			displacementTile.scrollDiscrete(6 * dt, 12 * dt);
			waterBgbatch.tile.scrollDiscrete(playerDX * 0.4, -playerDY * 0.4);
		}
		latencyText.text = "Latency:" + Socket.instance.latency;
	}

	public function updateSystemInfo(fps:Float) {
		systemText.text = "FPS: " + fps;
	}

	public function updatePlayerParams(playerShip:ClientShip) {
		final shipStats = playerShip.getStats();

		armorBar.updateBar(shipStats.baseArmor, shipStats.currentArmor);
		hullBar.updateBar(shipStats.baseHull, shipStats.currentHull);

		movementText.text = "Speed: " + shipStats.currentSpeed + " / " + shipStats.maxSpeed;
		dirText.text = "Direction: " + shipStats.dir;

		if (shipStats.allowShootLeft) {
			leftCannonsText.text = "Left side cannons READY!";
		} else {
			leftCannonsText.text = "Left side cannons RELOADING...";
		}

		if (shipStats.allowShootRight) {
			rightCannonsText.text = "Right side cannons READY!";
		} else {
			rightCannonsText.text = "Right side cannons RELOADING...";
		}
	}
}
