package client.ui;

import h2d.SpriteBatch.BatchElement;

enum IslandTerrainType {
	DARK;
	GREEN;
	SNOW;
}

class UiIsland extends h2d.Object {
	public function new(islandTerrainType:IslandTerrainType) {
		super();

		var bgTile = hxd.Res.island.green.green_island_tileset.toTile();
		var mineTile = hxd.Res.island.green.green_island_items.toTile();

		if (islandTerrainType == IslandTerrainType.DARK) {
			bgTile = hxd.Res.island.dark.dark_island_ground.toTile();
			mineTile = hxd.Res.island.dark.tileset_dark_island_items.toTile();
		} else if (islandTerrainType == IslandTerrainType.SNOW) {
			bgTile = hxd.Res.island.snow.snow_island_tileset.toTile();
			mineTile = hxd.Res.island.snow.snow_island_items.toTile();
		}

		final bgTile = bgTile.sub(24, 0, 24, 24);
		final bgBatch = new h2d.SpriteBatch(bgTile, this);

		for (y in 0...5)
			for (x in 0...5) {
				var batchElement = new h2d.BatchElement(bgTile);
				batchElement.x = 24 * x;
				batchElement.y = 24 * y;
				bgBatch.add(batchElement);
			}
		bgBatch.setScale(3.5);

		mineTile = mineTile.sub(50, 100, 68, 68);
		final mineBmp = new h2d.Bitmap(mineTile);

		mineBmp.setPosition(32, 44);
		mineBmp.setScale(5);

		addChild(mineBmp);
	}
}
