package client.entity;

import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;
import engine.MathUtils;

final RippleOffsetByDir:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.East => new PosOffset(90, -40, 20),
	GameEntityDirection.North => new PosOffset(3.5, -10, 59),
	GameEntityDirection.NorthEast => new PosOffset(60, -31, 44),
	GameEntityDirection.NorthWest => new PosOffset(-56, 15, 52),
	GameEntityDirection.South => new PosOffset(181, -6, -15),
	GameEntityDirection.SouthEast => new PosOffset(117, -57, 6),
	GameEntityDirection.SouthWest => new PosOffset(246, 48, 10),
	GameEntityDirection.West => new PosOffset(261, 40, 15),
];

class ClientShip extends ClientBaseGameEntity {
	// Graphics
	public var leftCanon1:h2d.Bitmap;
	public var leftCanon2:h2d.Bitmap;
	public var leftCanon3:h2d.Bitmap;

	public var rightCanon1:h2d.Bitmap;
	public var rightCanon2:h2d.Bitmap;
	public var rightCanon3:h2d.Bitmap;

	var leftRotationsPerformed = 0;
	var rightRotationsPerformed = 0;

	var eastShipTile:h2d.Tile;
	var northShipTile:h2d.Tile;
	var northEastShipTile:h2d.Tile;
	var northWestShipTile:h2d.Tile;
	var southShipTile:h2d.Tile;
	var southEastShipTile:h2d.Tile;
	var southWestShipTile:h2d.Tile;
	var westShipTile:h2d.Tile;

	var rippleAnim:h2d.Anim;

	// Ripple config
	public var ripple_angle:Float = 90;
	public var ripple_x:Float = -40;
	public var ripple_y:Float = 20;

	// Shapes config
	public var shape_angle:Float = 0;
	public var shape_x:Float = -100;
	public var shape_y:Float = -40;

	// Canons config
	public var left_canon_1_x:Float = -65;
	public var left_canon_1_y:Float = -50;
	public var left_canon_2_x:Float = -25;
	public var left_canon_2_y:Float = -50;
	public var left_canon_3_x:Float = 15;
	public var left_canon_3_y:Float = -50;
	public var right_canon_1_x:Float = -65;
	public var right_canon_1_y:Float = 71;
	public var right_canon_2_x:Float = -25;
	public var right_canon_2_y:Float = 71;
	public var right_canon_3_x:Float = 15;
	public var right_canon_3_y:Float = 71;
	// Canons debug shit code
	public var serverSideLeftCanonDebugRect1:h2d.Graphics;
	public var serverSideLeftCanonDebugRect2:h2d.Graphics;
	public var serverSideLeftCanonDebugRect3:h2d.Graphics;

	public var serverSideRightCanonDebugRect1:h2d.Graphics;
	public var serverSideRightCanonDebugRect2:h2d.Graphics;
	public var serverSideRightCanonDebugRect3:h2d.Graphics;

	public function new(s2d:h2d.Scene, engineShipEntity:EngineShipEntity) {
		super();

		// This approach is more usefull for client side stuff
		engineShipEntity.speedChangeCallback = function callback(speed) {
			if (speed != 0) {
				rippleAnim.alpha = 0.55;
			} else {
				rippleAnim.alpha = 0;
			}
		};
		engineShipEntity.directionChangeCallback = function callback(dir) {
			updateShipTileBasedByDirection(dir);
		};

		initiateEngineEntity(engineShipEntity);

		eastShipTile = hxd.Res.east.toTile();
		eastShipTile = eastShipTile.center();
		northShipTile = hxd.Res.north.toTile();
		northShipTile = northShipTile.center();
		northEastShipTile = hxd.Res.northEast.toTile();
		northEastShipTile = northEastShipTile.center();
		northWestShipTile = hxd.Res.northWest.toTile();
		northWestShipTile = northWestShipTile.center();
		southShipTile = hxd.Res.south.toTile();
		southShipTile = southShipTile.center();
		southEastShipTile = hxd.Res.southEast.toTile();
		southEastShipTile = southEastShipTile.center();
		southWestShipTile = hxd.Res.southWest.toTile();
		southWestShipTile = southWestShipTile.center();
		westShipTile = hxd.Res.west.toTile();
		westShipTile = westShipTile.center();

		bmp = new h2d.Bitmap(eastShipTile);

		var gunTile = h2d.Tile.fromColor(0xFFFF00, 10, 10);
		gunTile = gunTile.center();

		leftCanon1 = new h2d.Bitmap(gunTile, bmp);
		leftCanon2 = new h2d.Bitmap(gunTile, bmp);
		leftCanon3 = new h2d.Bitmap(gunTile, bmp);

		rightCanon1 = new h2d.Bitmap(gunTile, bmp);
		rightCanon2 = new h2d.Bitmap(gunTile, bmp);
		rightCanon3 = new h2d.Bitmap(gunTile, bmp);

		leftCanon1.setPosition(left_canon_1_x, left_canon_1_y);
		leftCanon2.setPosition(left_canon_2_x, left_canon_2_y);
		leftCanon3.setPosition(left_canon_3_x, left_canon_3_y);

		rightCanon1.setPosition(right_canon_1_x, right_canon_1_y);
		rightCanon2.setPosition(right_canon_2_x, right_canon_2_y);
		rightCanon3.setPosition(right_canon_3_x, right_canon_3_y);

		var rippleTile1 = hxd.Res.water_ripple_big_000.toTile();
		rippleTile1 = rippleTile1.center();
		var rippleTile2 = hxd.Res.water_ripple_big_001.toTile();
		rippleTile2 = rippleTile2.center();
		var rippleTile3 = hxd.Res.water_ripple_big_002.toTile();
		rippleTile3 = rippleTile3.center();
		var rippleTile4 = hxd.Res.water_ripple_big_003.toTile();
		rippleTile4 = rippleTile4.center();
		var rippleTile5 = hxd.Res.water_ripple_big_004.toTile();
		rippleTile5 = rippleTile5.center();

		rippleAnim = new h2d.Anim([rippleTile1, rippleTile2, rippleTile3, rippleTile4, rippleTile5], this);
		rippleAnim.rotation = MathUtils.degreeToRads(ripple_angle);
		rippleAnim.setPosition(ripple_x, ripple_y);
		rippleAnim.scaleX = 1.5;
		rippleAnim.scaleY = 0.9;
		rippleAnim.alpha = 0.0;

		layers.add(rippleAnim, 0);
		layers.add(bmp, 1);

		s2d.addChild(this);
	}

	function toggleDebugDraw() {
		if (Game.DebugDraw) {
			// leftCanon1.alpha = 1;
			// leftCanon2.alpha = 1;
			// leftCanon3.alpha = 1;
			// rightCanon1.alpha = 1;
			// rightCanon2.alpha = 1;
			// rightCanon3.alpha = 1;
		} else {
			// leftCanon1.alpha = 0;
			// leftCanon2.alpha = 0;
			// leftCanon3.alpha = 0;
			// rightCanon1.alpha = 0;
			// rightCanon2.alpha = 0;
			// rightCanon3.alpha = 0;
		}
	}

	function updateShipTileBasedByDirection(direction:GameEntityDirection) {
		final rippleOffsetByDir = RippleOffsetByDir.get(direction);
		rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
		rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);

		final leftCanonsOffsetByDir = EngineShipEntity.LeftCanonsOffsetByDir.get(direction);
		leftCanon1.setPosition(leftCanonsOffsetByDir.one.x, leftCanonsOffsetByDir.one.y);
		leftCanon2.setPosition(leftCanonsOffsetByDir.two.x, leftCanonsOffsetByDir.two.y);
		leftCanon3.setPosition(leftCanonsOffsetByDir.three.x, leftCanonsOffsetByDir.three.y);

		final rightCanonsOffsetByDir = EngineShipEntity.RightCanonsOffsetByDir.get(direction);
		rightCanon1.setPosition(rightCanonsOffsetByDir.one.x, rightCanonsOffsetByDir.one.y);
		rightCanon2.setPosition(rightCanonsOffsetByDir.two.x, rightCanonsOffsetByDir.two.y);
		rightCanon3.setPosition(rightCanonsOffsetByDir.three.x, rightCanonsOffsetByDir.three.y);

		switch (direction) {
			case East:
				bmp.tile = eastShipTile;
			case NorthEast:
				bmp.tile = northEastShipTile;
			case North:
				bmp.tile = northShipTile;
			case NorthWest:
				bmp.tile = northWestShipTile;
			case West:
				bmp.tile = westShipTile;
			case SouthWest:
				bmp.tile = southWestShipTile;
			case South:
				bmp.tile = southShipTile;
			case SouthEast:
				bmp.tile = southEastShipTile;
		}
	}

	public function updateHullAndArmor(currentHull:Int, currentArmor:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		shipEntity.currentHull = currentHull;
		shipEntity.currentArmor = currentArmor;
	}

	public function update(dt:Float) {
		x = hxd.Math.lerp(x, engineEntity.x, 0.1);
		y = hxd.Math.lerp(y, engineEntity.y, 0.1);
	}

	public function getHullAndArmor() {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return {
			baseHull: shipEntity.baseHull,
			currentHull: shipEntity.currentHull,
			baseArmor: shipEntity.baseArmor,
			currentArmor: shipEntity.currentArmor,
		}
	}

	public function getCanonOffsetBySideAndIndex(side:Side, index:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCanonOffsetBySideAndIndex(side, index);
	}
}
