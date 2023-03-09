package client.entity.ship;

import h2d.Layers;
import client.entity.ship.ShipTemplate;
import game.engine.base.BaseTypesAndClasses;
import game.engine.navy.NavyTypesAndClasses;

class ShipSailAndMast extends ShipVisualComponent {
	private final bmp_sail:h2d.Bitmap;
	private final eastSailTile:h2d.Tile;
	private final NORTHSailTile:h2d.Tile;
	private final NORTH_EASTSailTile:h2d.Tile;
	private final NORTH_WESTSailTile:h2d.Tile;
	private final southSailTile:h2d.Tile;
	private final SOUTH_EASTSailTile:h2d.Tile;
	private final SOUTH_WESTSailTile:h2d.Tile;
	private final westSailTile:h2d.Tile;

	private final layers:h2d.Layers;
	// 1 - sail > mast
	// 2 - mast > sails
	private var sailAndMastDrawingOrder = 1;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction);

		layers = new Layers(this);

		eastSailTile = getSailByDirectionAndSize(EAST, size).center();
		NORTHSailTile = getSailByDirectionAndSize(NORTH, size).center();
		NORTH_EASTSailTile = getSailByDirectionAndSize(NORTH_EAST, size).center();
		NORTH_WESTSailTile = getSailByDirectionAndSize(NORTH_WEST, size).center();
		southSailTile = getSailByDirectionAndSize(SOUTH, size).center();
		SOUTH_EASTSailTile = getSailByDirectionAndSize(SOUTH_EAST, size).center();
		SOUTH_WESTSailTile = getSailByDirectionAndSize(SOUTH_WEST, size).center();
		westSailTile = getSailByDirectionAndSize(WEST, size).center();

		switch (direction) {
			case EAST:
				bmp_sail = new h2d.Bitmap(eastSailTile);
			case NORTH_EAST:
				bmp_sail = new h2d.Bitmap(NORTH_EASTSailTile);
			case NORTH:
				bmp_sail = new h2d.Bitmap(NORTHSailTile);
			case NORTH_WEST:
				bmp_sail = new h2d.Bitmap(NORTH_WESTSailTile);
			case WEST:
				bmp_sail = new h2d.Bitmap(westSailTile);
			case SOUTH_WEST:
				bmp_sail = new h2d.Bitmap(SOUTH_WESTSailTile);
			case SOUTH:
				bmp_sail = new h2d.Bitmap(southSailTile);
			case SOUTH_EAST:
				bmp_sail = new h2d.Bitmap(SOUTH_EASTSailTile);
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
			case EAST:
				bmp_sail.tile = eastSailTile;
			case NORTH_EAST:
				if (prevDirection == EAST && sailAndMastDrawingOrder == 2) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = NORTH_EASTSailTile;
			case NORTH:
				bmp_sail.tile = NORTHSailTile;
			case NORTH_WEST:
				if (prevDirection == WEST && sailAndMastDrawingOrder == 2) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = NORTH_WESTSailTile;
			case WEST:
				bmp_sail.tile = westSailTile;
			case SOUTH_WEST:
				if (prevDirection == WEST && sailAndMastDrawingOrder == 1) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = SOUTH_WESTSailTile;
			case SOUTH:
				bmp_sail.tile = southSailTile;
			case SOUTH_EAST:
				if (prevDirection == EAST && sailAndMastDrawingOrder == 1) {
					swapSailAndMastDrawOrder();
				}
				bmp_sail.tile = SOUTH_EASTSailTile;
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
			case EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail3.toTile() : hxd.Res.small_ship.Sail.sail_e.toTile();
			case NORTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail4.toTile() : hxd.Res.small_ship.Sail.sail_ne.toTile();
			case NORTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail5.toTile() : hxd.Res.small_ship.Sail.sail_n.toTile();
			case NORTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail6.toTile() : hxd.Res.small_ship.Sail.sail_nw.toTile();
			case WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail7.toTile() : hxd.Res.small_ship.Sail.sail_w.toTile();
			case SOUTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail8.toTile() : hxd.Res.small_ship.Sail.sail_sw.toTile();
			case SOUTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail1.toTile() : hxd.Res.small_ship.Sail.sail_s.toTile();
			case SOUTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Sail.Sail2.toTile() : hxd.Res.small_ship.Sail.sail_se.toTile();
		}
	}
}
