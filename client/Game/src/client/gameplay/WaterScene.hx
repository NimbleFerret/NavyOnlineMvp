package client.gameplay;

import game.engine.base.BaseTypesAndClasses;
import h2d.SpriteBatch.BatchElement;

private class WaterBg {
	private final waterBgObject:h2d.Object;
	private final waterBgbatch:h2d.SpriteBatch;
	private final displacementTile:h2d.Tile;

	public var playerDX = 0.0;
	public var playerDY = 0.0;

	public function new(s2d:h2d.Scene, offsetX:Float, offsetY:Float, scale:Float, width:Int = 11, height:Int = 7) {
		displacementTile = hxd.Res.normalmap.toTile();
		waterBgObject = new h2d.Object(s2d);
		final waterBgTile = hxd.Res.water_tile.toTile().center();
		waterBgbatch = new h2d.SpriteBatch(waterBgTile, waterBgObject);
		for (y in 0...height) // 8
			for (x in 0...width) { // 15
				final batchElement = new h2d.BatchElement(waterBgTile);
				batchElement.x = 48 * x;
				batchElement.y = 48 * y;
				waterBgbatch.add(batchElement);
			}
		waterBgbatch.tileWrap = true;
		waterBgbatch.setScale(scale);
		waterBgbatch.setPosition(offsetX, offsetY);
		waterBgObject.filter = new h2d.filter.Displacement(displacementTile, 4, 4);
	}

	public function update(dt:Float) {
		waterBgObject.visible = GameConfig.ShowWaterBackground;
		if (waterBgObject.visible) {
			displacementTile.scrollDiscrete(6 * dt, 12 * dt);
			waterBgbatch.tile.scrollDiscrete(playerDX * 0.4, -playerDY * 0.4);
		}
	}
}

class WaterScene extends h2d.Scene {
	private final waterBg:WaterBg;

	public function new(stretch:Bool, offsetX:Float = 0, offsetY:Float = 0, scale:Float = 4, width:Int = 11, height:Int = 7) {
		super();

		if (stretch) {
			scaleMode = Stretch(1920, 1080);
		} else {
			camera.setViewport(1920, 1080, 0, 0);
			camera.setScale(2, 2);
		}

		waterBg = new WaterBg(this, offsetX, offsetY, scale, width, height);
	}

	public function update(dt:Float) {
		waterBg.update(dt);
	}

	public function updatePlayerMovement(isMoving:Bool = false, isMovingForward:Bool = false, direction:GameEntityDirection = EAST, speed:Float = 0.0) {
		speed /= 2;
		if (isMoving) {
			switch (direction) {
				case EAST:
					waterBg.playerDX = 0.01 * speed;
					waterBg.playerDY = 0;
				case NORTH_EAST:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case NORTH:
					waterBg.playerDX = 0;
					waterBg.playerDY = -0.01 * speed;
				case NORTH_WEST:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case WEST:
					waterBg.playerDX = -0.01 * speed;
					waterBg.playerDY = 0;
				case SOUTH_WEST:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
				case SOUTH:
					waterBg.playerDX = 0;
					waterBg.playerDY = 0.01 * speed;
				case SOUTH_EAST:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
			}
		} else {
			waterBg.playerDX = 0;
			waterBg.playerDY = 0;
		}
	}
}
