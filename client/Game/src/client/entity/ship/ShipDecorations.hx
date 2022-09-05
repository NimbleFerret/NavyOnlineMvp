package client.entity.ship;

import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;

class ShipDecorations extends ShipVisualComponent {
	public static final CaptainPosMid:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.East => new PosOffset(-121, -44),
		GameEntityDirection.NorthEast => new PosOffset(-79, -4),
		GameEntityDirection.North => new PosOffset(-20, 54),
		GameEntityDirection.NorthWest => new PosOffset(38, 0),
		GameEntityDirection.West => new PosOffset(79, -44),
		GameEntityDirection.SouthWest => new PosOffset(33, -64),
		GameEntityDirection.South => new PosOffset(-21, -103),
		GameEntityDirection.SouthEast => new PosOffset(-81, -66)
	];

	public static final CaptainPosSmall:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.East => new PosOffset(0, 0),
		GameEntityDirection.NorthEast => new PosOffset(0, 0),
		GameEntityDirection.North => new PosOffset(0, 0),
		GameEntityDirection.NorthWest => new PosOffset(0, 0),
		GameEntityDirection.West => new PosOffset(0, 0),
		GameEntityDirection.SouthWest => new PosOffset(0, 0),
		GameEntityDirection.South => new PosOffset(0, 0),
		GameEntityDirection.SouthEast => new PosOffset(0, 0)
	];

	private var eastWheelTile:h2d.Tile;
	private var northWheelTile:h2d.Tile;
	private var northEastWheelTile:h2d.Tile;
	private var northWestWheelTile:h2d.Tile;
	private var southWheelTile:h2d.Tile;
	private var southEastWheelTile:h2d.Tile;
	private var southWestWheelTile:h2d.Tile;
	private var westWheelTile:h2d.Tile;

	private var eastCaptainTile:h2d.Tile;
	private var northCaptainTile:h2d.Tile;
	private var northEastCaptainTile:h2d.Tile;
	private var northWestCaptainTile:h2d.Tile;
	private var southCaptainTile:h2d.Tile;
	private var southEastCaptainTile:h2d.Tile;
	private var southWestCaptainTile:h2d.Tile;
	private var westCaptainTile:h2d.Tile;

	private var bmp_wheel:h2d.Bitmap;

	public static var bmp_captain:h2d.Bitmap;

	// 1 - wheel > capt
	// 2 - capt > wheel
	private var wheelAndCaptainDrawingOrder = 1;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super();

		// Wheel
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

		// Capt

		eastCaptainTile = hxd.Res.captain.captain_e.toTile();
		eastCaptainTile = eastCaptainTile.center();
		northCaptainTile = hxd.Res.captain.captain_n.toTile();
		northCaptainTile = northCaptainTile.center();
		northEastCaptainTile = hxd.Res.captain.captain_ne.toTile();
		northEastCaptainTile = northEastCaptainTile.center();
		northWestCaptainTile = hxd.Res.captain.captain_nw.toTile();
		northWestCaptainTile = northWestCaptainTile.center();
		southCaptainTile = hxd.Res.captain.captain_s.toTile();
		southCaptainTile = southCaptainTile.center();
		southEastCaptainTile = hxd.Res.captain.captain_se.toTile();
		southEastCaptainTile = southEastCaptainTile.center();
		southWestCaptainTile = hxd.Res.captain.captain_sw.toTile();
		southWestCaptainTile = southWestCaptainTile.center();
		westCaptainTile = hxd.Res.captain.captain_w.toTile();
		westCaptainTile = westCaptainTile.center();

		bmp_captain = new h2d.Bitmap(eastCaptainTile);

		final captainPos = CaptainPosMid.get(direction);
		bmp_captain.setPosition(captainPos.x, captainPos.y);

		addChild(bmp_captain);
	}

	function changeTilesDirection() {
		switch (direction) {
			case East:
				bmp_wheel.tile = eastWheelTile;
				bmp_captain.tile = eastCaptainTile;
			case NorthEast:
				bmp_wheel.tile = northEastWheelTile;
				bmp_captain.tile = northEastCaptainTile;
			case North:
				bmp_wheel.tile = northWheelTile;
				bmp_captain.tile = northCaptainTile;
			case NorthWest:
				bmp_wheel.tile = northWestWheelTile;
				bmp_captain.tile = northWestCaptainTile;
			case West:
				bmp_wheel.tile = westWheelTile;
				bmp_captain.tile = westCaptainTile;
			case SouthWest:
				bmp_wheel.tile = southWestWheelTile;
				bmp_captain.tile = southWestCaptainTile;
			case South:
				bmp_wheel.tile = southWheelTile;
				bmp_captain.tile = southCaptainTile;
			case SouthEast:
				bmp_wheel.tile = southEastWheelTile;
				bmp_captain.tile = southEastCaptainTile;
		}

		final captainPos = CaptainPosMid.get(direction);
		bmp_captain.setPosition(captainPos.x, captainPos.y);
	}

	public function changeDrawingOrder() {
		removeChild(bmp_wheel);
		removeChild(bmp_captain);

		if (wheelAndCaptainDrawingOrder == 1) {
			wheelAndCaptainDrawingOrder = 2;

			addChild(bmp_captain);
			addChild(bmp_wheel);
		} else {
			wheelAndCaptainDrawingOrder = 1;

			addChild(bmp_wheel);
			addChild(bmp_captain);
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
