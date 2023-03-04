package client.entity;

import h2d.col.Point;
import utils.Utils;
import client.entity.ship.ShipTemplate;
import game.engine.MathUtils;
import game.engine.entity.EngineShipEntity;
import game.engine.entity.TypesAndClasses;

final RippleOffsetByDirSmall:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.EAST => new PosOffset(-20, 0, 90),
	GameEntityDirection.NORTH => new PosOffset(0, 59, 3.5),
	GameEntityDirection.NORTH_EAST => new PosOffset(-31, 35, 60),
	GameEntityDirection.NORTH_WEST => new PosOffset(30, 35, -56),
	GameEntityDirection.SOUTH => new PosOffset(5, -15, 181),
	GameEntityDirection.SOUTH_EAST => new PosOffset(-45, -20, 117),
	GameEntityDirection.SOUTH_WEST => new PosOffset(40, -10, 246),
	GameEntityDirection.WEST => new PosOffset(40, 0, 270),
];

final RippleOffsetByDirMiddle:Map<GameEntityDirection, PosOffset> = [
	GameEntityDirection.EAST => new PosOffset(-65, 20, 90),
	GameEntityDirection.NORTH => new PosOffset(-20, 75, 3.5),
	GameEntityDirection.NORTH_EAST => new PosOffset(-41, 45, 60),
	GameEntityDirection.NORTH_WEST => new PosOffset(0, 55, -56),
	GameEntityDirection.SOUTH => new PosOffset(-20, -45, 181),
	GameEntityDirection.SOUTH_EAST => new PosOffset(-65, 0, 117),
	GameEntityDirection.SOUTH_WEST => new PosOffset(40, -10, 246),
	GameEntityDirection.WEST => new PosOffset(40, 20, 270),
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

	public final shipTemplate:ShipTemplate;

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
		if (engineShipEntity.role == Role.PLAYER) {
			if (ownerId == client.Player.instance.ethAddress || ownerId == 'Player1') {
				nickname.text = 'You';
			} else {
				nickname.text = Utils.MaskEthAddress(ownerId);
			}
			nickname.textColor = 0xFBF0DD;
		} else if (engineShipEntity.role == Role.BOT) {
			nickname.text = 'Pirate';
			nickname.textColor = 0xFD7D7D;
		} else if (engineShipEntity.role == Role.BOSS) {
			nickname.text = 'BOSS Pirate';
			nickname.textColor = 0xFF0000;
		}
		if (shipHullSize == ShipHullSize.SMALL) {
			nickname.setPosition(-50, -180);
		} else {
			if (engineShipEntity.role == Role.PLAYER) {
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

	public function update(dt:Float) {
		x = hxd.Math.lerp(x, engineEntity.getX(), 0.1);
		y = hxd.Math.lerp(y, engineEntity.getY(), 0.1);
		shipTemplate.update();
	}

	public function debugDraw(graphics:h2d.Graphics) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		Utils.DrawRect(graphics, shipEntity.getBodyRectangle(), GameConfig.GreenColor);

		if (GameConfig.DebugCannonFiringArea) {
			for (firingRange in shipEntity.getCannonsFiringAreaBySide(LEFT)) {
				final origin = Utils.EngineToClientPoint(firingRange.origin);
				final left = Utils.EngineToClientPoint(firingRange.origin);
				final right = Utils.EngineToClientPoint(firingRange.origin);
				Utils.DrawLine(graphics, origin, left, GameConfig.YellowColor);
				Utils.DrawLine(graphics, origin, right, GameConfig.YellowColor);
			}
			for (firingRange in shipEntity.getCannonsFiringAreaBySide(RIGHT)) {
				final origin = Utils.EngineToClientPoint(firingRange.origin);
				final left = Utils.EngineToClientPoint(firingRange.origin);
				final right = Utils.EngineToClientPoint(firingRange.origin);
				Utils.DrawLine(graphics, origin, left, GameConfig.YellowColor);
				Utils.DrawLine(graphics, origin, right, GameConfig.YellowColor);
			}
		}
	}

	public function updateCannonsSight(graphics:h2d.Graphics, mouseSide:Side, mousePos:Point) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		var index = 0;
		for (cannonFiringArea in shipEntity.getCannonsFiringAreaBySide(mouseSide)) {
			final origin = cannonFiringArea.origin;
			final left = cannonFiringArea.left;
			final right = cannonFiringArea.right;

			final adjustedMousePos = Utils.ClientToEnginePoint(mousePos);

			if (index > 0) {
				adjustedMousePos.x += 28;
			}

			final cannonAndMouse = MathUtils.angleBetweenPoints(origin, adjustedMousePos);
			final cannonAndLeftArea = MathUtils.angleBetweenPoints(origin, left);
			final cannonAndRightArea = MathUtils.angleBetweenPoints(origin, right);

			if (GameConfig.DrawCannonsSight) {
				Utils.DrawLine(graphics, Utils.EngineToClientPoint(origin), shipTemplate.getCannonSightPos(mouseSide, index), GameConfig.YellowColor);
			}

			if (cannonAndMouse < cannonAndLeftArea && cannonAndMouse > cannonAndRightArea) {
				final lineLength = origin.x + shipEntity.getCannonsRange();
				final lineEndPoint = Utils.EngineToClientPoint(MathUtils.rotatePointAroundCenter(lineLength, origin.y, origin.x, origin.y, cannonAndMouse));
				shipTemplate.updateCannonSightPos(mouseSide, index, lineEndPoint);
				shipTemplate.updateCannonFiringAreaAngle(mouseSide, index, cannonAndMouse);
			}

			index++;
		}
	}

	public function getCannonFiringAreaAngle(side:Side, index:Int) {
		return shipTemplate.getCannonFiringAreaAngle(side, index);
	}

	public function getCannonsFiringAreaBySide(side:Side) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCannonsFiringAreaBySide(side);
	}

	public function getCannonPositionBySideAndIndex(side:Side, index:Int) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.getCannonPositionBySideAndIndex(side, index);
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
			allowShootLeft: shipEntity.shootAllowanceBySide(LEFT),
			allowShootRight: shipEntity.shootAllowanceBySide(RIGHT),
			x: shipEntity.getX(),
			y: shipEntity.getY()
		}
	}

	public function getBodyShape() {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		return shipEntity.shape;
	}

	public function updateBodyShape(x:Float, y:Float, angle:Float) {
		final shipEntity = cast(engineEntity, EngineShipEntity);
		shipEntity.shape.rectOffsetX = x;
		shipEntity.shape.rectOffsetY = y;
		shipEntity.shape.angle = angle;
	}
}
