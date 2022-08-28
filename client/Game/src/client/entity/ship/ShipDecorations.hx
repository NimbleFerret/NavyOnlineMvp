package client.entity.ship;

import engine.entity.EngineBaseGameEntity;

class ShipDecorations extends ShipVisualComponent {
	// TODO implement windows
	private static var eastWheelTile:h2d.Tile;
	private static var northWheelTile:h2d.Tile;
	private static var northEastWheelTile:h2d.Tile;
	private static var northWestWheelTile:h2d.Tile;
	private static var southWheelTile:h2d.Tile;
	private static var southEastWheelTile:h2d.Tile;
	private static var southWestWheelTile:h2d.Tile;
	private static var westWheelTile:h2d.Tile;

	private static var tilesInitialized = false;

	private var bmp_wheel:h2d.Bitmap;

	public function new(direction:GameEntityDirection) {
		super();

		if (!tilesInitialized) {
			eastWheelTile = hxd.Res.mid_ship.Wheel.Wheel3.toTile();
			eastWheelTile = eastWheelTile.center();
			northWheelTile = hxd.Res.mid_ship.Wheel.Wheel5.toTile();
			northWheelTile = northWheelTile.center();
			northEastWheelTile = hxd.Res.mid_ship.Wheel.Wheel4.toTile();
			northEastWheelTile = northEastWheelTile.center();
			northWestWheelTile = hxd.Res.mid_ship.Wheel.Wheel6.toTile();
			northWestWheelTile = northWestWheelTile.center();
			southWheelTile = hxd.Res.mid_ship.Wheel.Wheel1.toTile();
			southWheelTile = southWheelTile.center();
			southEastWheelTile = hxd.Res.mid_ship.Wheel.Wheel2.toTile();
			southEastWheelTile = southEastWheelTile.center();
			southWestWheelTile = hxd.Res.mid_ship.Wheel.Wheel8.toTile();
			southWestWheelTile = southWestWheelTile.center();
			westWheelTile = hxd.Res.mid_ship.Wheel.Wheel7.toTile();
			westWheelTile = westWheelTile.center();
		}

		bmp_wheel = new h2d.Bitmap(eastWheelTile);

		addChild(bmp_wheel);
	}

	function changeTilesDirection() {
		switch (this.direction) {
			case East:
				bmp_wheel.tile = eastWheelTile;
			case NorthEast:
				bmp_wheel.tile = northEastWheelTile;
			case North:
				bmp_wheel.tile = northWheelTile;
			case NorthWest:
				bmp_wheel.tile = northWestWheelTile;
			case West:
				bmp_wheel.tile = westWheelTile;
			case SouthWest:
				bmp_wheel.tile = southWestWheelTile;
			case South:
				bmp_wheel.tile = southWheelTile;
			case SouthEast:
				bmp_wheel.tile = southEastWheelTile;
		}
	}

	public function update() {}
}
// Windows, ankor, barrels, boxes etc
// var eastOneWindowTile:h2d.Tile;
// var northOneWindowTile:h2d.Tile;
// var northEastOneWindowTile:h2d.Tile;
// var northWestOneWindowTile:h2d.Tile;
// var southOneWindowTile:h2d.Tile;
// var southEastOneWindowTile:h2d.Tile;
// var southWestOneWindowTile:h2d.Tile;
// var westOneWindowTile:h2d.Tile;
//
// eastOneWindowTile = hxd.Res.mid_ship.Windows.one_windows3.toTile();
// eastOneWindowTile = eastOneWindowTile.center();
// northOneWindowTile = hxd.Res.mid_ship.Windows.one_windows5.toTile();
// northOneWindowTile = northOneWindowTile.center();
// northEastOneWindowTile = hxd.Res.mid_ship.Windows.one_windows4.toTile();
// northEastOneWindowTile = northEastOneWindowTile.center();
// northWestOneWindowTile = hxd.Res.mid_ship.Windows.one_windows6.toTile();
// northWestOneWindowTile = northWestOneWindowTile.center();
// southOneWindowTile = hxd.Res.mid_ship.Windows.one_windows1.toTile();
// southOneWindowTile = southOneWindowTile.center();
// southEastOneWindowTile = hxd.Res.mid_ship.Windows.one_windows2.toTile();
// southEastOneWindowTile = southEastOneWindowTile.center();
// southWestOneWindowTile = hxd.Res.mid_ship.Windows.one_windows8.toTile();
// southWestOneWindowTile = southWestOneWindowTile.center();
// westOneWindowTile = hxd.Res.mid_ship.Windows.one_windows7.toTile();
// westOneWindowTile = westOneWindowTile.center();
