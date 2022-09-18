package client.entity;

import client.entity.ship.ShipTemplate;
import client.gameplay.battle.BattleGameplay;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;
import engine.MathUtils;

final RippleOffsetByDir:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.East => new PosOffset(-20, 0, 90),
	GameEntityDirection.North => new PosOffset(0, 59, 3.5),
	GameEntityDirection.NorthEast => new PosOffset(-31, 35, 60),
	GameEntityDirection.NorthWest => new PosOffset(30, 35, -56),
	GameEntityDirection.South => new PosOffset(5, -15, 181),
	GameEntityDirection.SouthEast => new PosOffset(-45, -20, 117),
	GameEntityDirection.SouthWest => new PosOffset(40, -10, 246),
	GameEntityDirection.West => new PosOffset(40, 0, 270),
];

class ClientShip extends ClientBaseGameEntity {
	// --------------------------------
	// Ripple anim
	// --------------------------------
	var rippleAnim:h2d.Anim;

	// Shapes config
	public var shape_angle:Float = 0;
	public var shape_x:Float = -100;
	public var shape_y:Float = -40;

	private final shipTemplate:ShipTemplate;

	public function new(s2d:h2d.Scene, engineShipEntity:EngineShipEntity) {
		super();

		engineShipEntity.speedChangeCallback = function callback(speed) {
			if (speed != 0) {
				rippleAnim.alpha = 1;
			} else {
				rippleAnim.alpha = 0;
			}
		};
		engineShipEntity.directionChangeCallbackLeft = function callback(dir) {
			shipTemplate.changeDirLeft();

			final rippleOffsetByDir = RippleOffsetByDir.get(dir);
			rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
			rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);
		};
		engineShipEntity.directionChangeCallbackRight = function callback(dir) {
			shipTemplate.changeDirRight();

			final rippleOffsetByDir = RippleOffsetByDir.get(dir);
			rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
			rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);
		};
		engineShipEntity.shootLeftCallback = function callback() {
			shipTemplate.shootLeft();
		};
		engineShipEntity.shootRightCallback = function callback() {
			shipTemplate.shootRight();
		};

		initiateEngineEntity(engineShipEntity);

		final rippleTile1 = hxd.Res.water_ripple_big_000.toTile().center();
		final rippleTile2 = hxd.Res.water_ripple_big_001.toTile().center();
		final rippleTile3 = hxd.Res.water_ripple_big_002.toTile().center();
		final rippleTile4 = hxd.Res.water_ripple_big_003.toTile().center();
		final rippleTile5 = hxd.Res.water_ripple_big_004.toTile().center();

		rippleAnim = new h2d.Anim([rippleTile1, rippleTile2, rippleTile3, rippleTile4, rippleTile5], this);

		final rippleOffsetByDir = RippleOffsetByDir.get(engineShipEntity.direction);

		rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
		rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);
		rippleAnim.scaleX = 1.5;
		rippleAnim.scaleY = 0.9;
		rippleAnim.alpha = 0;

		shipTemplate = new ShipTemplate(engineShipEntity.shipHullSize, engineShipEntity.shipWindows, engineShipEntity.shipGuns);
		addChild(shipTemplate);

		s2d.addChild(this);
	}

	public function updateHullAndArmor(currentHull:Int, currentArmor:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		shipEntity.currentHull = currentHull;
		shipEntity.currentArmor = currentArmor;
	}

	public function update(dt:Float) {
		x = hxd.Math.lerp(x, engineEntity.x, 0.1);
		y = hxd.Math.lerp(y, engineEntity.y, 0.1);
		shipTemplate.update();
	}

	public function getStats() {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return {
			hull: shipEntity.hull,
			currentHull: shipEntity.currentHull,
			armor: shipEntity.armor,
			currentArmor: shipEntity.currentArmor,
			currentSpeed: shipEntity.currentSpeed,
			maxSpeed: shipEntity.maxSpeed,
			dir: shipEntity.direction,
			allowShootLeft: shipEntity.shootAllowanceBySide(Left),
			allowShootRight: shipEntity.shootAllowanceBySide(Right),
			x: shipEntity.x,
			y: shipEntity.y
		}
	}

	public function getCanonOffsetBySideAndIndex(side:Side, index:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCanonOffsetBySideAndIndex(side, index);
	}

	public function clearDebugGraphics(s2d:h2d.Scene) {
		// if (debugRect != null) {
		// 	debugRect.clear();
		// 	leftSideCanonDebugRect1.clear();
		// 	leftSideCanonDebugRect2.clear();
		// 	leftSideCanonDebugRect3.clear();
		// 	rightSideCanonDebugRect1.clear();
		// 	rightSideCanonDebugRect2.clear();
		// 	rightSideCanonDebugRect3.clear();
		// }
	}

	function toggleDebugDraw() {
		if (BattleGameplay.DebugDraw) {
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
}
