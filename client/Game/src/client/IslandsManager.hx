package client;

class IslandsManager {
	public function new(s2d:h2d.Scene) {
		if (BattleGameplay.ShowIslands) {
			var creepyIslandCompositeTile = hxd.Res.composite.toTile();
			creepyIslandCompositeTile = creepyIslandCompositeTile.center();

			final creepyIslandCompositeBmp = new h2d.Bitmap(creepyIslandCompositeTile, s2d);
			creepyIslandCompositeBmp.setScale(3);
			creepyIslandCompositeBmp.setPosition(1000, 400);
		}
	}
}
