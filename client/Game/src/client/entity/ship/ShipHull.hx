package client.entity.ship;

import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;

class ShipHull extends ShipVisualComponent {
	private var bmp_hull:h2d.Bitmap;

	private var eastShipTile:h2d.Tile;
	private var northShipTile:h2d.Tile;
	private var northEastShipTile:h2d.Tile;
	private var northWestShipTile:h2d.Tile;
	private var southShipTile:h2d.Tile;
	private var southEastShipTile:h2d.Tile;
	private var southWestShipTile:h2d.Tile;
	private var westShipTile:h2d.Tile;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super(direction, side);

		eastShipTile = getHullByDirectionAndSize(GameEntityDirection.East, size);
		eastShipTile = eastShipTile.center();
		northShipTile = getHullByDirectionAndSize(GameEntityDirection.North, size);
		northShipTile = northShipTile.center();
		northEastShipTile = getHullByDirectionAndSize(GameEntityDirection.NorthEast, size);
		northEastShipTile = northEastShipTile.center();
		northWestShipTile = getHullByDirectionAndSize(GameEntityDirection.NorthWest, size);
		northWestShipTile = northWestShipTile.center();
		southShipTile = getHullByDirectionAndSize(GameEntityDirection.South, size);
		southShipTile = southShipTile.center();
		southEastShipTile = getHullByDirectionAndSize(GameEntityDirection.SouthEast, size);
		southEastShipTile = southEastShipTile.center();
		southWestShipTile = getHullByDirectionAndSize(GameEntityDirection.SouthWest, size);
		southWestShipTile = southWestShipTile.center();
		westShipTile = getHullByDirectionAndSize(GameEntityDirection.West, size);
		westShipTile = westShipTile.center();

		bmp_hull = new h2d.Bitmap(eastShipTile);

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
