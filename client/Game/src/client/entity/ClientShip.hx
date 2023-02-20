package client.entity;

import utils.Utils;
import h2d.col.Point;
import client.entity.ship.ShipTemplate;
import game.engine.entity.EngineShipEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.MathUtils;

final RippleOffsetByDirSmall:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.East => new PosOffset(-20, 0, 90),
	GameEntityDirection.North => new PosOffset(0, 59, 3.5),
	GameEntityDirection.NorthEast => new PosOffset(-31, 35, 60),
	GameEntityDirection.NorthWest => new PosOffset(30, 35, -56),
	GameEntityDirection.South => new PosOffset(5, -15, 181),
	GameEntityDirection.SouthEast => new PosOffset(-45, -20, 117),
	GameEntityDirection.SouthWest => new PosOffset(40, -10, 246),
	GameEntityDirection.West => new PosOffset(40, 0, 270),
];

final RippleOffsetByDirMiddle:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.East => new PosOffset(-65, 20, 90),
	GameEntityDirection.North => new PosOffset(-20, 75, 3.5),
	GameEntityDirection.NorthEast => new PosOffset(-41, 45, 60),
	GameEntityDirection.NorthWest => new PosOffset(0, 55, -56),
	GameEntityDirection.South => new PosOffset(-20, -45, 181),
	GameEntityDirection.SouthEast => new PosOffset(-65, 0, 117),
	GameEntityDirection.SouthWest => new PosOffset(40, -10, 246),
	GameEntityDirection.West => new PosOffset(40, 20, 270),
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

	public var isMoving = false;
	public var isMovingForward = false;

	// TODO must be the same as on the backend
	public var localDirection:GameEntityDirection;
	public var currentSpeed:Float;

	// TODO cast engine entity once ?

	public function new(engineShipEntity:EngineShipEntity) {
		super();

		final direction = engineShipEntity.getDirection();
		final shipHullSize = engineShipEntity.getShipHullSize();
		final ownerId = engineShipEntity.getOwnerId();

		localDirection = direction;

		engineShipEntity.speedChangeCallback = function callback(speed) {
			if (speed != 0) {
				rippleAnim.alpha = 1;
				isMoving = true;
				currentSpeed = speed;
			} else {
				rippleAnim.alpha = 0;
				isMoving = false;
				currentSpeed = 0;
			}

			isMovingForward = speed > 0;
		};
		engineShipEntity.directionChangeCallbackLeft = function callback(dir) {
			localDirection = dir;
			shipTemplate.changeDirLeft();

			final rippleOffsetByDir = shipHullSize == SMALL ? RippleOffsetByDirSmall.get(dir) : RippleOffsetByDirMiddle.get(dir);
			rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
			rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);
		};
		engineShipEntity.directionChangeCallbackRight = function callback(dir) {
			localDirection = dir;
			shipTemplate.changeDirRight();

			final rippleOffsetByDir = shipHullSize == SMALL ? RippleOffsetByDirSmall.get(dir) : RippleOffsetByDirMiddle.get(dir);
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

		final rippleOffsetByDir = shipHullSize == SMALL ? RippleOffsetByDirSmall.get(direction) : RippleOffsetByDirMiddle.get(direction);

		rippleAnim.rotation = MathUtils.degreeToRads(rippleOffsetByDir.r);
		rippleAnim.setPosition(rippleOffsetByDir.x, rippleOffsetByDir.y);
		rippleAnim.scaleX = 1.5 * (shipHullSize == SMALL ? 1 : 1.5);
		rippleAnim.scaleY = 0.9 * (shipHullSize == SMALL ? 1 : 1.5);
		rippleAnim.alpha = 0;

		shipTemplate = new ShipTemplate(direction, shipHullSize, engineShipEntity.getShipWindows(), engineShipEntity.getShipCannons());
		addChild(shipTemplate);

		final nickname = new h2d.Text(hxd.res.DefaultFont.get(), this);
		if (engineShipEntity.role == Role.Player) {
			if (ownerId == client.Player.instance.ethAddress || ownerId == 'Player1') {
				nickname.text = 'You';
			} else {
				nickname.text = Utils.MaskEthAddress(ownerId);
			}
			nickname.textColor = 0xFBF0DD;
		} else if (engineShipEntity.role == Role.Bot) {
			nickname.text = 'Pirate';
			nickname.textColor = 0xFD7D7D;
		} else if (engineShipEntity.role == Role.Boss) {
			nickname.text = 'BOSS Pirate';
			nickname.textColor = 0xFF0000;
		}
		if (shipHullSize == ShipHullSize.SMALL) {
			nickname.setPosition(-50, -180);
		} else {
			if (engineShipEntity.role == Role.Player) {
				nickname.setPosition(-150, -220);
			} else {
				nickname.setPosition(-150, -220);
			}
		}
		nickname.setScale(4);
		nickname.dropShadow = {
			dx: 0.5,
			dy: 0.5,
			color: 0x000000,
			alpha: 0.9
		};
	}

	public function updateHullAndArmor(currentHull:Int, currentArmor:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		shipEntity.currentHull = currentHull;
		shipEntity.currentArmor = currentArmor;
	}

	public function getCannonPos() {
		// return shipTemplate.leftSideCannons[0].getAbsPos();
		return new Point();
	}

	public function getGunsPos() {
		// return shipTemplate.leftSideCannons[0].getAbsPos();
		return new Point();
	}

	public function update(dt:Float) {
		x = hxd.Math.lerp(x, engineEntity.getX(), 0.1);
		y = hxd.Math.lerp(y, engineEntity.getY(), 0.1);
		shipTemplate.update();
	}

	public function debugDraw(graphics:h2d.Graphics) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		Utils.DrawRect(graphics, shipEntity.getBodyRectangle(), GameConfig.BodyRectColor);

		if (GameConfig.DebugCannonFiringArea) {
			shipTemplate.drawCannonsFiringArea(graphics);
		}
		if (GameConfig.DebugCannonSight) {
			shipTemplate.drawCannonsFiringArea(graphics);
		}
	}

	public function getStats() {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return {
			hull: shipEntity.getHull(),
			currentHull: shipEntity.currentHull,
			armor: shipEntity.getArmor(),
			currentArmor: shipEntity.currentArmor,
			currentSpeed: shipEntity.currentSpeed,
			maxSpeed: shipEntity.getMaxSpeed(),
			dir: shipEntity.getDirection(),
			allowShootLeft: shipEntity.shootAllowanceBySide(Left),
			allowShootRight: shipEntity.shootAllowanceBySide(Right),
			x: shipEntity.getX(),
			y: shipEntity.getY()
		}
	}

	public function getCannonsFiringAreaBySide(side:Side) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCannonsFiringAreaBySide(side);
	}

	public function getCannonPositionBySideAndIndex(side:Side, index:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCannonPositionBySideAndIndex(side, index);
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
		if (GameConfig.DebugDraw) {
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
