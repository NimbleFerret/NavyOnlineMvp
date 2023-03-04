package client.entity.ship;

import game.engine.entity.TypesAndClasses;

class ShipHull extends ShipVisualComponent {
	private final bmp_hull:h2d.Bitmap;

	private final eastShipTile:h2d.Tile;
	private final NORTHShipTile:h2d.Tile;
	private final NORTH_EASTShipTile:h2d.Tile;
	private final NORTH_WESTShipTile:h2d.Tile;
	private final southShipTile:h2d.Tile;
	private final SOUTH_EASTShipTile:h2d.Tile;
	private final SOUTH_WESTShipTile:h2d.Tile;
	private final westShipTile:h2d.Tile;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction, side);

		eastShipTile = getHullByDirectionAndSize(GameEntityDirection.EAST, size).center();
		NORTHShipTile = getHullByDirectionAndSize(GameEntityDirection.NORTH, size).center();
		NORTH_EASTShipTile = getHullByDirectionAndSize(GameEntityDirection.NORTH_EAST, size).center();
		NORTH_WESTShipTile = getHullByDirectionAndSize(GameEntityDirection.NORTH_WEST, size).center();
		southShipTile = getHullByDirectionAndSize(GameEntityDirection.SOUTH, size).center();
		SOUTH_EASTShipTile = getHullByDirectionAndSize(GameEntityDirection.SOUTH_EAST, size).center();
		SOUTH_WESTShipTile = getHullByDirectionAndSize(GameEntityDirection.SOUTH_WEST, size).center();
		westShipTile = getHullByDirectionAndSize(GameEntityDirection.WEST, size).center();

		switch (direction) {
			case EAST:
				bmp_hull = new h2d.Bitmap(eastShipTile);
			case NORTH_EAST:
				bmp_hull = new h2d.Bitmap(NORTH_EASTShipTile);
			case NORTH:
				bmp_hull = new h2d.Bitmap(NORTHShipTile);
			case NORTH_WEST:
				bmp_hull = new h2d.Bitmap(NORTH_WESTShipTile);
			case WEST:
				bmp_hull = new h2d.Bitmap(westShipTile);
			case SOUTH_WEST:
				bmp_hull = new h2d.Bitmap(SOUTH_WESTShipTile);
			case SOUTH:
				bmp_hull = new h2d.Bitmap(southShipTile);
			case SOUTH_EAST:
				bmp_hull = new h2d.Bitmap(SOUTH_EASTShipTile);
		}

		addChild(bmp_hull);
	}

	function changeTilesDirection() {
		switch (this.direction) {
			case EAST:
				bmp_hull.tile = eastShipTile;
			case NORTH_EAST:
				bmp_hull.tile = NORTH_EASTShipTile;
			case NORTH:
				bmp_hull.tile = NORTHShipTile;
			case NORTH_WEST:
				bmp_hull.tile = NORTH_WESTShipTile;
			case WEST:
				bmp_hull.tile = westShipTile;
			case SOUTH_WEST:
				bmp_hull.tile = SOUTH_WESTShipTile;
			case SOUTH:
				bmp_hull.tile = southShipTile;
			case SOUTH_EAST:
				bmp_hull.tile = SOUTH_EASTShipTile;
		}
	}

	public function update() {}

	private function getHullByDirectionAndSize(dir:GameEntityDirection, size:ShipHullSize) {
		switch (dir) {
			case EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship3.toTile() : hxd.Res.small_ship.Ship.ship_e.toTile();
			case NORTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship4.toTile() : hxd.Res.small_ship.Ship.ship_ne.toTile();
			case NORTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship5.toTile() : hxd.Res.small_ship.Ship.ship_n.toTile();
			case NORTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship6.toTile() : hxd.Res.small_ship.Ship.ship_nw.toTile();
			case WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship7.toTile() : hxd.Res.small_ship.Ship.ship_w.toTile();
			case SOUTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship8.toTile() : hxd.Res.small_ship.Ship.ship_sw.toTile();
			case SOUTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship1.toTile() : hxd.Res.small_ship.Ship.ship_s.toTile();
			case SOUTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship2.toTile() : hxd.Res.small_ship.Ship.ship_se.toTile();
		}
	}
}
