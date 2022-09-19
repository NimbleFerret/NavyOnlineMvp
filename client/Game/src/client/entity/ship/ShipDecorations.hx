package client.entity.ship;

import client.entity.ship.ShipTemplate;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;

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
		GameEntityDirection.East => new PosOffset(55, -33),
		GameEntityDirection.NorthEast => new PosOffset(50, -55),
		GameEntityDirection.North => new PosOffset(0, -66),
		GameEntityDirection.NorthWest => new PosOffset(-44, -56),
		GameEntityDirection.West => new PosOffset(-50, -35),
		GameEntityDirection.SouthWest => new PosOffset(-28, -14),
		GameEntityDirection.South => new PosOffset(0, 20),
		GameEntityDirection.SouthEast => new PosOffset(25, -11)
	];

	private final eastWheelTile:h2d.Tile;
	private final northWheelTile:h2d.Tile;
	private final northEastWheelTile:h2d.Tile;
	private final northWestWheelTile:h2d.Tile;
	private final southWheelTile:h2d.Tile;
	private final southEastWheelTile:h2d.Tile;
	private final southWestWheelTile:h2d.Tile;
	private final westWheelTile:h2d.Tile;

	private final eastCaptainTile:h2d.Tile;
	private final northCaptainTile:h2d.Tile;
	private final northEastCaptainTile:h2d.Tile;
	private final northWestCaptainTile:h2d.Tile;
	private final southCaptainTile:h2d.Tile;
	private final southEastCaptainTile:h2d.Tile;
	private final southWestCaptainTile:h2d.Tile;
	private final westCaptainTile:h2d.Tile;

	private final bmp_wheel:h2d.Bitmap;
	private final bmp_captain:h2d.Bitmap;

	private final size:ShipHullSize;

	// 1 - wheel > capt
	// 2 - capt > wheel
	private var wheelAndCaptainDrawingOrder = 1;

	public function new(direction:GameEntityDirection, size:ShipHullSize) {
		super();

		this.size = size;

		// Wheel
		eastWheelTile = getWheelByDirectionAndSize(East, size).center();
		northWheelTile = getWheelByDirectionAndSize(North, size).center();
		northEastWheelTile = getWheelByDirectionAndSize(NorthEast, size).center();
		northWestWheelTile = getWheelByDirectionAndSize(NorthWest, size).center();
		southWheelTile = getWheelByDirectionAndSize(South, size).center();
		southEastWheelTile = getWheelByDirectionAndSize(SouthEast, size).center();
		southWestWheelTile = getWheelByDirectionAndSize(SouthWest, size).center();
		westWheelTile = getWheelByDirectionAndSize(West, size).center();

		bmp_wheel = new h2d.Bitmap(eastWheelTile);

		addChild(bmp_wheel);

		// Capt

		eastCaptainTile = hxd.Res.captain.captain_e.toTile().center();
		northCaptainTile = hxd.Res.captain.captain_n.toTile().center();
		northEastCaptainTile = hxd.Res.captain.captain_ne.toTile().center();
		northWestCaptainTile = hxd.Res.captain.captain_nw.toTile().center();
		southCaptainTile = hxd.Res.captain.captain_s.toTile().center();
		southEastCaptainTile = hxd.Res.captain.captain_se.toTile().center();
		southWestCaptainTile = hxd.Res.captain.captain_sw.toTile().center();
		westCaptainTile = hxd.Res.captain.captain_w.toTile().center();

		bmp_captain = new h2d.Bitmap(eastCaptainTile);

		final captainPos = size == MEDIUM ? CaptainPosMid.get(direction) : CaptainPosSmall.get(direction);
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

		final captainPos = size == MEDIUM ? CaptainPosMid.get(direction) : CaptainPosSmall.get(direction);
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
