package client;

class IslandsManager {
	public function new(s2d:h2d.Scene, terrain:String) {
		var creepyIslandCompositeTile = hxd.Res.island_green_composite.toTile().center();
		if (terrain == 'Snow') {
			creepyIslandCompositeTile = hxd.Res.island_snow_composite.toTile().center();
		} else if (terrain == 'Dark') {
			creepyIslandCompositeTile = hxd.Res.island_dark_composite.toTile().center();
		}

		creepyIslandCompositeTile = creepyIslandCompositeTile.center();

		final creepyIslandCompositeBmp = new h2d.Bitmap(creepyIslandCompositeTile, s2d);
		creepyIslandCompositeBmp.setScale(3);
		creepyIslandCompositeBmp.setPosition(1000, 400);
	}
}
