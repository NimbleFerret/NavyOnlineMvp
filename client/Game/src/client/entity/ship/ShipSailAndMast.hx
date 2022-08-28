package client.entity.ship;

import h2d.Layers;
import engine.entity.EngineBaseGameEntity;

class ShipSailAndMast extends ShipVisualComponent {
	private var bmp_sail:h2d.Bitmap;

	private static var eastSailTile:h2d.Tile;
	private static var northSailTile:h2d.Tile;
	private static var northEastSailTile:h2d.Tile;
	private static var northWestSailTile:h2d.Tile;
	private static var southSailTile:h2d.Tile;
	private static var southEastSailTile:h2d.Tile;
	private static var southWestSailTile:h2d.Tile;
	private static var westSailTile:h2d.Tile;

	private static var tilesInitialized = false;

	private final layers:h2d.Layers;
	// 1 - sail > mast
	// 2 - mast > sails
	private var sailAndMastDrawingOrder = 1;

	public function new(direction:GameEntityDirection) {
		super(direction);

		layers = new Layers(this);

		if (!tilesInitialized) {
			eastSailTile = hxd.Res.mid_ship.Sail.Sail3.toTile();
			eastSailTile = eastSailTile.center();
			northSailTile = hxd.Res.mid_ship.Sail.Sail5.toTile();
			northSailTile = northSailTile.center();
			northEastSailTile = hxd.Res.mid_ship.Sail.Sail4.toTile();
			northEastSailTile = northEastSailTile.center();
			northWestSailTile = hxd.Res.mid_ship.Sail.Sail6.toTile();
			northWestSailTile = northWestSailTile.center();
			southSailTile = hxd.Res.mid_ship.Sail.Sail1.toTile();
			southSailTile = southSailTile.center();
			southEastSailTile = hxd.Res.mid_ship.Sail.Sail2.toTile();
			southEastSailTile = southEastSailTile.center();
			southWestSailTile = hxd.Res.mid_ship.Sail.Sail8.toTile();
			southWestSailTile = southWestSailTile.center();
			westSailTile = hxd.Res.mid_ship.Sail.Sail7.toTile();
			westSailTile = westSailTile.center();
		}

		bmp_sail = new h2d.Bitmap(eastSailTile);

		var mastTile = hxd.Res.mid_ship.Mast.Mast1.toTile();
		mastTile = mastTile.center();
		final bmp_mast = new h2d.Bitmap(mastTile);

		var flagTile = hxd.Res.mid_ship.Flag.Flag1.toTile();
		flagTile = flagTile.center();
		final bmp_flag = new h2d.Bitmap(flagTile);

		layers.add(bmp_sail, 0);
		layers.add(bmp_mast, 1);
		layers.add(bmp_flag, 2);
	}

	public function changeTilesDirection() {
		switch (this.direction) {
			case East:
				bmp_sail.tile = eastSailTile;
			case NorthEast:
				if (prevDirection == East && sailAndMastDrawingOrder == 2) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = northEastSailTile;
			case North:
				bmp_sail.tile = northSailTile;
			case NorthWest:
				if (prevDirection == West && sailAndMastDrawingOrder == 2) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = northWestSailTile;
			case West:
				bmp_sail.tile = westSailTile;
			case SouthWest:
				if (prevDirection == West && sailAndMastDrawingOrder == 1) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = southWestSailTile;
			case South:
				bmp_sail.tile = southSailTile;
			case SouthEast:
				if (prevDirection == East && sailAndMastDrawingOrder == 1) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = southEastSailTile;
		}
	}

	public function update() {}

	private function swapSailAndMastDrawOrder() {
		if (sailAndMastDrawingOrder == 1) {
			sailAndMastDrawingOrder = 2;

			final sail = layers.getChildAtLayer(0, 0);
			final mast = layers.getChildAtLayer(0, 1);

			layers.removeChild(sail);
			layers.removeChild(mast);

			layers.add(sail, 1);
			layers.add(mast, 0);
		} else {
			sailAndMastDrawingOrder = 1;

			final sail = layers.getChildAtLayer(0, 1);
			final mast = layers.getChildAtLayer(0, 0);

			layers.removeChild(sail);
			layers.removeChild(mast);

			layers.add(sail, 0);
			layers.add(mast, 1);
		}
	}
}
