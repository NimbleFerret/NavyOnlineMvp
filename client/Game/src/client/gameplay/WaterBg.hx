package client.gameplay;

import h2d.SpriteBatch.BatchElement;

class WaterBg {
	public static final DrawWaterBg = true;

	private final waterBgObject:h2d.Object;
	private final waterBgbatch:h2d.SpriteBatch;
	private final displacementTile:h2d.Tile;

	public var playerDX = 0.0;
	public var playerDY = 0.0;

	public function new(s2d:h2d.Scene, offsetX:Float, offsetY:Float, scale:Float, width:Int = 11, height:Int = 7) {
		if (DrawWaterBg) {
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
	}

	public function update(dt:Float) {
		if (DrawWaterBg) {
			displacementTile.scrollDiscrete(6 * dt, 12 * dt);
			waterBgbatch.tile.scrollDiscrete(playerDX * 0.4, -playerDY * 0.4);
		}
	}
}
