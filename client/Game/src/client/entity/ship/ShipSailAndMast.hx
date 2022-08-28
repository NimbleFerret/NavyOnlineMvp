package client.entity.ship;

import h2d.Layers;
import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;

class ShipSailAndMast extends ShipVisualComponent {
	private var bmp_sail:h2d.Bitmap;
	private var eastSailTile:h2d.Tile;
	private var northSailTile:h2d.Tile;
	private var northEastSailTile:h2d.Tile;
	private var northWestSailTile:h2d.Tile;
	private var southSailTile:h2d.Tile;
	private var southEastSailTile:h2d.Tile;
	private var southWestSailTile:h2d.Tile;
	private var westSailTile:h2d.Tile;

	private final layers:h2d.Layers;
	// 1 - sail > mast
	// 2 - mast > sails
	private var sailAndMastDrawingOrder = 1;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction);

		layers = new Layers(this);

		eastSailTile = getSailByDirectionAndSize(East, size);
		eastSailTile = eastSailTile.center();
		northSailTile = getSailByDirectionAndSize(North, size);
		northSailTile = northSailTile.center();
		northEastSailTile = getSailByDirectionAndSize(NorthEast, size);
		northEastSailTile = northEastSailTile.center();
		northWestSailTile = getSailByDirectionAndSize(NorthWest, size);
		northWestSailTile = northWestSailTile.center();
		southSailTile = getSailByDirectionAndSize(South, size);
		southSailTile = southSailTile.center();
		southEastSailTile = getSailByDirectionAndSize(SouthEast, size);
		southEastSailTile = southEastSailTile.center();
		southWestSailTile = getSailByDirectionAndSize(SouthWest, size);
		southWestSailTile = southWestSailTile.center();
		westSailTile = getSailByDirectionAndSize(West, size);
		westSailTile = westSailTile.center();

		bmp_sail = new h2d.Bitmap(eastSailTile);

		var mastTile = getMastByDirectionAndSize(size);
		mastTile = mastTile.center();
		final bmp_mast = new h2d.Bitmap(mastTile);

		var flagTile = getFlagByDirectionAndSize(size);
		flagTile = flagTile.center();
		final bmp_flag = new h2d.Bitmap(flagTile);

		bmp_sail.alpha = 0.5;
		bmp_mast.alpha = 0.5;
		bmp_flag.alpha = 0.5;

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
