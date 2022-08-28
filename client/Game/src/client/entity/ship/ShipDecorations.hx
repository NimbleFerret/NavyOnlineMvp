package client.entity.ship;

import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;

class ShipDecorations extends ShipVisualComponent {
	private var eastWheelTile:h2d.Tile;
	private var northWheelTile:h2d.Tile;
	private var northEastWheelTile:h2d.Tile;
	private var northWestWheelTile:h2d.Tile;
	private var southWheelTile:h2d.Tile;
	private var southEastWheelTile:h2d.Tile;
	private var southWestWheelTile:h2d.Tile;
	private var westWheelTile:h2d.Tile;

	private var bmp_wheel:h2d.Bitmap;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super();

		eastWheelTile = getWheelByDirectionAndSize(East, size);
		eastWheelTile = eastWheelTile.center();
		northWheelTile = getWheelByDirectionAndSize(North, size);
		northWheelTile = northWheelTile.center();
		northEastWheelTile = getWheelByDirectionAndSize(NorthEast, size);
		northEastWheelTile = northEastWheelTile.center();
		northWestWheelTile = getWheelByDirectionAndSize(NorthWest, size);
		northWestWheelTile = northWestWheelTile.center();
		southWheelTile = getWheelByDirectionAndSize(South, size);
		southWheelTile = southWheelTile.center();
		southEastWheelTile = getWheelByDirectionAndSize(SouthEast, size);
		southEastWheelTile = southEastWheelTile.center();
		southWestWheelTile = getWheelByDirectionAndSize(SouthWest, size);
		southWestWheelTile = southWestWheelTile.center();
		westWheelTile = getWheelByDirectionAndSize(West, size);
		westWheelTile = westWheelTile.center();

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

	private function getWheelByDirectionAndSize(dir:GameEntityDirection, size:ShipHullSize) {
		switch (dir) {
			case East:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel3.toTile() : hxd.Res.small_ship.Wheel.wheel_e.toTile();
			case NorthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel4.toTile() : hxd.Res.small_ship.Wheel.wheel_ne.toTile();
			case North:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel5.toTile() : hxd.Res.small_ship.Wheel.wheel_n.toTile();
			case NorthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel6.toTile() : hxd.Res.small_ship.Wheel.wheel_nw.toTile();
			case West:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel7.toTile() : hxd.Res.small_ship.Wheel.wheel_w.toTile();
			case SouthWest:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel8.toTile() : hxd.Res.small_ship.Wheel.wheel_sw.toTile();
			case South:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel1.toTile() : hxd.Res.small_ship.Wheel.wheel_s.toTile();
			case SouthEast:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel2.toTile() : hxd.Res.small_ship.Wheel.wheel_se.toTile();
		}
	}
}
