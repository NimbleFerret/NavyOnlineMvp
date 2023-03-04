package client.entity.ship;

import h2d.col.Point;
import client.entity.ship.ShipTemplate;
import game.engine.entity.TypesAndClasses;

class ShipDecorations extends ShipVisualComponent {
	public static final CaptainPosMid:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.EAST => new PosOffset(-121, -44),
		GameEntityDirection.NORTH_EAST => new PosOffset(-79, -4),
		GameEntityDirection.NORTH => new PosOffset(-20, 54),
		GameEntityDirection.NORTH_WEST => new PosOffset(38, 0),
		GameEntityDirection.WEST => new PosOffset(79, -44),
		GameEntityDirection.SOUTH_WEST => new PosOffset(33, -64),
		GameEntityDirection.SOUTH => new PosOffset(-21, -103),
		GameEntityDirection.SOUTH_EAST => new PosOffset(-81, -66)
	];

	public static final CaptainPosSmall:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.EAST => new PosOffset(55, -33),
		GameEntityDirection.NORTH_EAST => new PosOffset(50, -55),
		GameEntityDirection.NORTH => new PosOffset(0, -66),
		GameEntityDirection.NORTH_WEST => new PosOffset(-44, -56),
		GameEntityDirection.WEST => new PosOffset(-50, -35),
		GameEntityDirection.SOUTH_WEST => new PosOffset(-28, -14),
		GameEntityDirection.SOUTH => new PosOffset(0, 20),
		GameEntityDirection.SOUTH_EAST => new PosOffset(25, -11)
	];

	// Config
	public static final CaptainConfigPosition = new Point(0, 0);

	// Visuals
	private final eastWheelTile:h2d.Tile;
	private final NORTHWheelTile:h2d.Tile;
	private final NORTH_EASTWheelTile:h2d.Tile;
	private final NORTH_WESTWheelTile:h2d.Tile;
	private final southWheelTile:h2d.Tile;
	private final SOUTH_EASTWheelTile:h2d.Tile;
	private final SOUTH_WESTWheelTile:h2d.Tile;
	private final westWheelTile:h2d.Tile;

	private final eastCaptainTile:h2d.Tile;
	private final NORTHCaptainTile:h2d.Tile;
	private final NORTH_EASTCaptainTile:h2d.Tile;
	private final NORTH_WESTCaptainTile:h2d.Tile;
	private final southCaptainTile:h2d.Tile;
	private final SOUTH_EASTCaptainTile:h2d.Tile;
	private final SOUTH_WESTCaptainTile:h2d.Tile;
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

		eastWheelTile = getWheelByDirectionAndSize(EAST, size).center();
		NORTHWheelTile = getWheelByDirectionAndSize(NORTH, size).center();
		NORTH_EASTWheelTile = getWheelByDirectionAndSize(NORTH_EAST, size).center();
		NORTH_WESTWheelTile = getWheelByDirectionAndSize(NORTH_WEST, size).center();
		southWheelTile = getWheelByDirectionAndSize(SOUTH, size).center();
		SOUTH_EASTWheelTile = getWheelByDirectionAndSize(SOUTH_EAST, size).center();
		SOUTH_WESTWheelTile = getWheelByDirectionAndSize(SOUTH_WEST, size).center();
		westWheelTile = getWheelByDirectionAndSize(WEST, size).center();

		eastCaptainTile = hxd.Res.captain.captain_e.toTile().center();
		NORTHCaptainTile = hxd.Res.captain.captain_n.toTile().center();
		NORTH_EASTCaptainTile = hxd.Res.captain.captain_ne.toTile().center();
		NORTH_WESTCaptainTile = hxd.Res.captain.captain_nw.toTile().center();
		southCaptainTile = hxd.Res.captain.captain_s.toTile().center();
		SOUTH_EASTCaptainTile = hxd.Res.captain.captain_se.toTile().center();
		SOUTH_WESTCaptainTile = hxd.Res.captain.captain_sw.toTile().center();
		westCaptainTile = hxd.Res.captain.captain_w.toTile().center();

		switch (direction) {
			case EAST:
				bmp_wheel = new h2d.Bitmap(eastWheelTile);
				bmp_captain = new h2d.Bitmap(eastCaptainTile);
			case NORTH_EAST:
				bmp_wheel = new h2d.Bitmap(NORTH_EASTWheelTile);
				bmp_captain = new h2d.Bitmap(NORTH_EASTCaptainTile);
			case NORTH:
				bmp_wheel = new h2d.Bitmap(NORTHWheelTile);
				bmp_captain = new h2d.Bitmap(NORTHCaptainTile);
			case NORTH_WEST:
				bmp_wheel = new h2d.Bitmap(NORTH_WESTWheelTile);
				bmp_captain = new h2d.Bitmap(NORTH_WESTCaptainTile);
			case WEST:
				bmp_wheel = new h2d.Bitmap(westWheelTile);
				bmp_captain = new h2d.Bitmap(westCaptainTile);
			case SOUTH_WEST:
				bmp_wheel = new h2d.Bitmap(SOUTH_WESTWheelTile);
				bmp_captain = new h2d.Bitmap(SOUTH_WESTCaptainTile);
			case SOUTH:
				bmp_wheel = new h2d.Bitmap(southWheelTile);
				bmp_captain = new h2d.Bitmap(southCaptainTile);
			case SOUTH_EAST:
				bmp_wheel = new h2d.Bitmap(SOUTH_EASTWheelTile);
				bmp_captain = new h2d.Bitmap(SOUTH_EASTCaptainTile);
		}

		final captainPos = size == MEDIUM ? CaptainPosMid.get(direction) : CaptainPosSmall.get(direction);
		bmp_captain.setPosition(captainPos.x, captainPos.y);
		CaptainConfigPosition.set(captainPos.x, captainPos.y);

		addChild(bmp_wheel);
		addChild(bmp_captain);
	}

	function changeTilesDirection() {
		switch (direction) {
			case EAST:
				bmp_wheel.tile = eastWheelTile;
				bmp_captain.tile = eastCaptainTile;
			case NORTH_EAST:
				bmp_wheel.tile = NORTH_EASTWheelTile;
				bmp_captain.tile = NORTH_EASTCaptainTile;
			case NORTH:
				bmp_wheel.tile = NORTHWheelTile;
				bmp_captain.tile = NORTHCaptainTile;
			case NORTH_WEST:
				bmp_wheel.tile = NORTH_WESTWheelTile;
				bmp_captain.tile = NORTH_WESTCaptainTile;
			case WEST:
				bmp_wheel.tile = westWheelTile;
				bmp_captain.tile = westCaptainTile;
			case SOUTH_WEST:
				bmp_wheel.tile = SOUTH_WESTWheelTile;
				bmp_captain.tile = SOUTH_WESTCaptainTile;
			case SOUTH:
				bmp_wheel.tile = southWheelTile;
				bmp_captain.tile = southCaptainTile;
			case SOUTH_EAST:
				bmp_wheel.tile = SOUTH_EASTWheelTile;
				bmp_captain.tile = SOUTH_EASTCaptainTile;
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

	public function update() {
		if (GameConfig.ShipConfigMode) {
			bmp_captain.setPosition(CaptainConfigPosition.x, CaptainConfigPosition.y);
		}
	}

	private function getWheelByDirectionAndSize(dir:GameEntityDirection, size:ShipHullSize) {
		switch (dir) {
			case EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel3.toTile() : hxd.Res.small_ship.Wheel.wheel_e.toTile();
			case NORTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel4.toTile() : hxd.Res.small_ship.Wheel.wheel_ne.toTile();
			case NORTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel5.toTile() : hxd.Res.small_ship.Wheel.wheel_n.toTile();
			case NORTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel6.toTile() : hxd.Res.small_ship.Wheel.wheel_nw.toTile();
			case WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel7.toTile() : hxd.Res.small_ship.Wheel.wheel_w.toTile();
			case SOUTH_WEST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel8.toTile() : hxd.Res.small_ship.Wheel.wheel_sw.toTile();
			case SOUTH:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel1.toTile() : hxd.Res.small_ship.Wheel.wheel_s.toTile();
			case SOUTH_EAST:
				return size == MEDIUM ? hxd.Res.mid_ship.Wheel.Wheel2.toTile() : hxd.Res.small_ship.Wheel.wheel_se.toTile();
		}
	}
}
