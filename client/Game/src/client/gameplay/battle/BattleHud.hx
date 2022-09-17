package client.gameplay.battle;

import h2d.Bitmap;
import h2d.Object;
import client.gameplay.BaiscHud.BasicHud;
import client.ui.UiComponents;
import client.network.Socket;
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

class BattleHud extends BasicHud {
	private var movementText:h2d.Text;
	private var dirText:h2d.Text;
	private var systemText:h2d.Text;
	private var latencyText:h2d.Text;
	private var positionText:h2d.Text;

	private var leftCannonsText:h2d.Text;
	private var rightCannonsText:h2d.Text;

	// HP bars
	final armorBar:HorizontalStatsBar;
	final hullBar:HorizontalStatsBar;

	// UI Dialogs
	private var startGameDialogComp:StartGameDialogComp;

	// Compass
	private final compassEast:h2d.Tile;
	private final compassNorthEast:h2d.Tile;
	private final compassNorth:h2d.Tile;
	private final compassNorthWest:h2d.Tile;
	private final compassWest:h2d.Tile;
	private final compassSouthWest:h2d.Tile;
	private final compassSouth:h2d.Tile;
	private final compassSouthEast:h2d.Tile;
	private final compassBmp:h2d.Bitmap;

	// Water
	public final waterBg:WaterBg;

	public function new(leaveCallback:Void->Void) {
		super();

		waterBg = new WaterBg(this, 0, 0, 4);

		// Compass
		compassEast = hxd.Res.compass.compass_e.toTile();
		compassNorthEast = hxd.Res.compass.compass_ne.toTile();
		compassNorth = hxd.Res.compass.compass_n.toTile();
		compassNorthWest = hxd.Res.compass.compass_nw.toTile();
		compassWest = hxd.Res.compass.compass_w.toTile();
		compassSouthWest = hxd.Res.compass.compass_sw.toTile();
		compassSouth = hxd.Res.compass.compass_s.toTile();
		compassSouthEast = hxd.Res.compass.compass_se.toTile();

		compassBmp = new h2d.Bitmap(compassEast);
		compassBmp.setScale(0.5);
		compassBmp.setPosition(500, 500);
		compassBmp.alpha = 0;

		addChild(compassBmp);

		armorBar = new HorizontalStatsBar(fui, 0, 0, "Armor", "1000", 65);
		hullBar = new HorizontalStatsBar(fui, 0, 0, "Hull", "1000", 65);

		movementText = addText();
		movementText.setScale(4);

		dirText = addText();
		dirText.setScale(4);

		positionText = addText();
		positionText.setScale(4);

		leftCannonsText = addText("Left side cannons READY");
		leftCannonsText.setScale(4);

		rightCannonsText = addText("Right side cannons READY");
		rightCannonsText.setScale(4);

		systemText = addText();
		systemText.setScale(4);

		latencyText = addText();
		latencyText.setScale(4);

		latencyText = addText();
		latencyText.setScale(4);

		final leaveButton = addButton('Leave sector', function callback() {
			if (leaveCallback != null) {
				leaveCallback();
			}
		});
		leaveButton.setScale(3);

		show(true);
	}

	public function show(show:Bool) {
		armorBar.show(show);
		hullBar.show(show);

		movementText.alpha = show ? 1 : 0;
		dirText.alpha = show ? 1 : 0;
		leftCannonsText.alpha = show ? 1 : 0;
		rightCannonsText.alpha = show ? 1 : 0;
	}

	public function update(dt:Float) {
		waterBg.update(dt);
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

		switch (shipStats.dir) {
			case East:
				compassBmp.tile = compassEast;
			case NorthEast:
				compassBmp.tile = compassNorthEast;
			case North:
				compassBmp.tile = compassNorth;
			case NorthWest:
				compassBmp.tile = compassNorthWest;
			case West:
				compassBmp.tile = compassWest;
			case SouthWest:
				compassBmp.tile = compassSouthWest;
			case South:
				compassBmp.tile = compassSouth;
			case SouthEast:
				compassBmp.tile = compassSouthEast;
		}

		positionText.text = "Sector: " + BattleGameplay.CurrentSectorX + " / " + BattleGameplay.CurrentSectorY + ", Pos: " + Std.int(shipStats.x) + " / "
			+ Std.int(shipStats.y);

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
