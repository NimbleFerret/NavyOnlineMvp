package client.entity.ship;

import h2d.Layers;
import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;

class ShipSailAndMast extends ShipVisualComponent {
	private final bmp_sail:h2d.Bitmap;
	private final eastSailTile:h2d.Tile;
	private final northSailTile:h2d.Tile;
	private final northEastSailTile:h2d.Tile;
	private final northWestSailTile:h2d.Tile;
	private final southSailTile:h2d.Tile;
	private final southEastSailTile:h2d.Tile;
	private final southWestSailTile:h2d.Tile;
	private final westSailTile:h2d.Tile;

	private final layers:h2d.Layers;
	// 1 - sail > mast
	// 2 - mast > sails
	private var sailAndMastDrawingOrder = 1;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction);

		layers = new Layers(this);

		eastSailTile = getSailByDirectionAndSize(East, size).center();
		northSailTile = getSailByDirectionAndSize(North, size).center();
		northEastSailTile = getSailByDirectionAndSize(NorthEast, size).center();
		northWestSailTile = getSailByDirectionAndSize(NorthWest, size).center();
		southSailTile = getSailByDirectionAndSize(South, size).center();
		southEastSailTile = getSailByDirectionAndSize(SouthEast, size).center();
		southWestSailTile = getSailByDirectionAndSize(SouthWest, size).center();
		westSailTile = getSailByDirectionAndSize(West, size).center();

		switch (direction) {
			case East:
				bmp_sail = new h2d.Bitmap(eastSailTile);
			case NorthEast:
				bmp_sail = new h2d.Bitmap(northEastSailTile);
			case North:
				bmp_sail = new h2d.Bitmap(northSailTile);
			case NorthWest:
				bmp_sail = new h2d.Bitmap(northWestSailTile);
			case West:
				bmp_sail = new h2d.Bitmap(westSailTile);
			case SouthWest:
				bmp_sail = new h2d.Bitmap(southWestSailTile);
			case South:
				bmp_sail = new h2d.Bitmap(southSailTile);
			case SouthEast:
				bmp_sail = new h2d.Bitmap(southEastSailTile);
		}

		final mastTile = getMastByDirectionAndSize(size).center();
		final bmp_mast = new h2d.Bitmap(mastTile);

		final flagTile = getFlagByDirectionAndSize(size).center();
		final bmp_flag = new h2d.Bitmap(flagTile);

		// bmp_sail.alpha = 0.5;
		// bmp_mast.alpha = 0.5;
		// bmp_flag.alpha = 0.5;

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

	private function getFlagByDirectionAndSize(size:ShipHullSize) {
		return size == MEDIUM ? hxd.Res.mid_ship.Flag.Flag1.toTile() : hxd.Res.small_ship.Flag.flag_e.toTile();
	}

	private function getMastByDirectionAndSize(size:ShipHullSize) {
		return size == MEDIUM ? hxd.Res.mid_ship.Mast.Mast1.toTile() : hxd.Res.small_ship.Mast.mast_e.toTile();
	}

	private function getSailByDirectionAndSize(dir:GameEntityDirection, size:ShipHullSize) {
		switch (dir) {
			case East:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail3.toTile() : hxd.Res.small_ship.Sail.sail_e.toTile();
			case NorthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail4.toTile() : hxd.Res.small_ship.Sail.sail_ne.toTile();
			case North:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail5.toTile() : hxd.Res.small_ship.Sail.sail_n.toTile();
			case NorthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail6.toTile() : hxd.Res.small_ship.Sail.sail_nw.toTile();
			case West:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail7.toTile() : hxd.Res.small_ship.Sail.sail_w.toTile();
			case SouthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail8.toTile() : hxd.Res.small_ship.Sail.sail_sw.toTile();
			case South:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail1.toTile() : hxd.Res.small_ship.Sail.sail_s.toTile();
			case SouthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail2.toTile() : hxd.Res.small_ship.Sail.sail_se.toTile();
		}
	}
}
