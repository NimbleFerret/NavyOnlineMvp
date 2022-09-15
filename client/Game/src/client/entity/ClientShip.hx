package client.entity;

import client.entity.ship.ShipTemplate;
import client.gameplay.battle.BattleGameplay;
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
	// --------------------------------
	// Ripple anim
	// --------------------------------
	var rippleAnim:h2d.Anim;

	// Ripple config
	public var ripple_angle:Float = 90;
	public var ripple_x:Float = -40;
	public var ripple_y:Float = 20;

	// Shapes config
	public var shape_angle:Float = 0;
	public var shape_x:Float = -100;
	public var shape_y:Float = -40;

	private final shipTemplate:ShipTemplate;

	public function new(s2d:h2d.Scene, engineShipEntity:EngineShipEntity) {
		super();

		engineShipEntity.speedChangeCallback = function callback(speed) {
			if (speed != 0) {
				rippleAnim.alpha = 0.55;
			} else {
				rippleAnim.alpha = 0;
			}
		};
		engineShipEntity.directionChangeCallbackLeft = function callback(dir) {
			shipTemplate.direction = dir;
			shipTemplate.changeDirLeft();
		};
		engineShipEntity.directionChangeCallbackRight = function callback(dir) {
			shipTemplate.direction = dir;
			shipTemplate.changeDirRight();
		};

		shipTemplate = new ShipTemplate(s2d, engineShipEntity.shipHullSize, engineShipEntity.shipWindows, engineShipEntity.shipGuns);

		initiateEngineEntity(engineShipEntity);

		final rippleTile1 = hxd.Res.water_ripple_big_000.toTile().center();
		final rippleTile2 = hxd.Res.water_ripple_big_001.toTile().center();
		final rippleTile3 = hxd.Res.water_ripple_big_002.toTile().center();
		final rippleTile4 = hxd.Res.water_ripple_big_003.toTile().center();
		final rippleTile5 = hxd.Res.water_ripple_big_004.toTile().center();

		rippleAnim = new h2d.Anim([rippleTile1, rippleTile2, rippleTile3, rippleTile4, rippleTile5], this);
		rippleAnim.rotation = MathUtils.degreeToRads(ripple_angle);
		rippleAnim.setPosition(ripple_x, ripple_y);
		rippleAnim.scaleX = 1.5;
		rippleAnim.scaleY = 0.9;
		rippleAnim.alpha = 0.0;

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
	}

	public function getStats() {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return {
			baseHull: shipEntity.baseHull,
			currentHull: shipEntity.currentHull,
			baseArmor: shipEntity.baseArmor,
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

	//

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
