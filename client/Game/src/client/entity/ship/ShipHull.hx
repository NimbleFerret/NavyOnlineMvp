package client.entity.ship;

import engine.entity.EngineBaseGameEntity;

class ShipHull extends ShipVisualComponent {
	private var bmp_hull:h2d.Bitmap;

	private static var eastShipTile:h2d.Tile;
	private static var northShipTile:h2d.Tile;
	private static var northEastShipTile:h2d.Tile;
	private static var northWestShipTile:h2d.Tile;
	private static var southShipTile:h2d.Tile;
	private static var southEastShipTile:h2d.Tile;
	private static var southWestShipTile:h2d.Tile;
	private static var westShipTile:h2d.Tile;

	private static var tilesInitialized = false;

	public function new(direction:GameEntityDirection) {
		super(direction, side);

		if (!tilesInitialized) {
			eastShipTile = hxd.Res.mid_ship.Ship.Ship3.toTile();
			eastShipTile = eastShipTile.center();
			northShipTile = hxd.Res.mid_ship.Ship.Ship5.toTile();
			northShipTile = northShipTile.center();
			northEastShipTile = hxd.Res.mid_ship.Ship.Ship4.toTile();
			northEastShipTile = northEastShipTile.center();
			northWestShipTile = hxd.Res.mid_ship.Ship.Ship6.toTile();
			northWestShipTile = northWestShipTile.center();
			southShipTile = hxd.Res.mid_ship.Ship.Ship1.toTile();
			southShipTile = southShipTile.center();
			southEastShipTile = hxd.Res.mid_ship.Ship.Ship2.toTile();
			southEastShipTile = southEastShipTile.center();
			southWestShipTile = hxd.Res.mid_ship.Ship.Ship8.toTile();
			southWestShipTile = southWestShipTile.center();
			westShipTile = hxd.Res.mid_ship.Ship.Ship7.toTile();
			westShipTile = westShipTile.center();
		}

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
}
