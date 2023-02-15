package client.entity.ship;

import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;

class ShipHull extends ShipVisualComponent {
	private final bmp_hull:h2d.Bitmap;

	private final eastShipTile:h2d.Tile;
	private final northShipTile:h2d.Tile;
	private final northEastShipTile:h2d.Tile;
	private final northWestShipTile:h2d.Tile;
	private final southShipTile:h2d.Tile;
	private final southEastShipTile:h2d.Tile;
	private final southWestShipTile:h2d.Tile;
	private final westShipTile:h2d.Tile;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction, side);

		eastShipTile = getHullByDirectionAndSize(GameEntityDirection.East, size).center();
		northShipTile = getHullByDirectionAndSize(GameEntityDirection.North, size).center();
		northEastShipTile = getHullByDirectionAndSize(GameEntityDirection.NorthEast, size).center();
		northWestShipTile = getHullByDirectionAndSize(GameEntityDirection.NorthWest, size).center();
		southShipTile = getHullByDirectionAndSize(GameEntityDirection.South, size).center();
		southEastShipTile = getHullByDirectionAndSize(GameEntityDirection.SouthEast, size).center();
		southWestShipTile = getHullByDirectionAndSize(GameEntityDirection.SouthWest, size).center();
		westShipTile = getHullByDirectionAndSize(GameEntityDirection.West, size).center();

		switch (direction) {
			case East:
				bmp_hull = new h2d.Bitmap(eastShipTile);
			case NorthEast:
				bmp_hull = new h2d.Bitmap(northEastShipTile);
			case North:
				bmp_hull = new h2d.Bitmap(northShipTile);
			case NorthWest:
				bmp_hull = new h2d.Bitmap(northWestShipTile);
			case West:
				bmp_hull = new h2d.Bitmap(westShipTile);
			case SouthWest:
				bmp_hull = new h2d.Bitmap(southWestShipTile);
			case South:
				bmp_hull = new h2d.Bitmap(southShipTile);
			case SouthEast:
				bmp_hull = new h2d.Bitmap(southEastShipTile);
		}

		addChild(bmp_hull);
	}

	function changeTilesDirection() {
		switch (this.direction) {
			case East:
				bmp_hull.tile = eastShipTile;
			case NorthEast:
				bmp_hull.tile = northEastShipTile;
			case North:
				bmp_hull.tile = northShipTile;
			case NorthWest:
				bmp_hull.tile = northWestShipTile;
			case West:
				bmp_hull.tile = westShipTile;
			case SouthWest:
				bmp_hull.tile = southWestShipTile;
			case South:
				bmp_hull.tile = southShipTile;
			case SouthEast:
				bmp_hull.tile = southEastShipTile;
		}
	}

	public function update() {}

	private function getHullByDirectionAndSize(dir:GameEntityDirection, size:ShipHullSize) {
		switch (dir) {
			case East:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship3.toTile() : hxd.Res.small_ship.Ship.ship_e.toTile();
			case NorthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship4.toTile() : hxd.Res.small_ship.Ship.ship_ne.toTile();
			case North:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship5.toTile() : hxd.Res.small_ship.Ship.ship_n.toTile();
			case NorthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship6.toTile() : hxd.Res.small_ship.Ship.ship_nw.toTile();
			case West:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship7.toTile() : hxd.Res.small_ship.Ship.ship_w.toTile();
			case SouthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship8.toTile() : hxd.Res.small_ship.Ship.ship_sw.toTile();
			case South:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship1.toTile() : hxd.Res.small_ship.Ship.ship_s.toTile();
			case SouthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Ship.Ship2.toTile() : hxd.Res.small_ship.Ship.ship_se.toTile();
		}
	}
}
