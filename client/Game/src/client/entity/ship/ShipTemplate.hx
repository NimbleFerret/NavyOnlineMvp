package client.entity.ship;

import h2d.Layers;
import engine.entity.EngineBaseGameEntity;

enum ShipHullSize {
	SMALL;
	MEDIUM;
}

enum ShipWindows {
	ONE;
	TWO;
	NONE;
}

enum ShipGuns {
	ONE;
	TWO;
	THREE;
	FOUR;
}

class ShipTemplate extends h2d.Object {
	// Small size
	public static final RightCanonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-28, 26), new PosOffset(0, 26), new PosOffset(28, 26)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(17, 31), new PosOffset(36, 21), new PosOffset(55, 13)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(50, 10), new PosOffset(50, -13), new PosOffset(50, 33)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(50, -16), new PosOffset(28, -26), new PosOffset(7, -33)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(50, -50), new PosOffset(21, -50), new PosOffset(-8, -50)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(-10, -41), new PosOffset(-27, -34), new PosOffset(-41, -27)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(-50, -31), new PosOffset(-50, -11), new PosOffset(-50, 10)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(-70, 10), new PosOffset(-50, 19), new PosOffset(-28, 29)),
	];

	public static final LeftCanonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-28, -51), new PosOffset(0, -51), new PosOffset(28, -51)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(-55, -16), new PosOffset(-35, -24), new PosOffset(-16, -32)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(-50, 10), new PosOffset(-50, -13), new PosOffset(-50, 33)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(-13, 32), new PosOffset(-32, 22), new PosOffset(-52, 11)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(50, 27), new PosOffset(21, 27), new PosOffset(-8, 27)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(70, 5), new PosOffset(50, 15), new PosOffset(31, 25)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(50, -31), new PosOffset(50, -11), new PosOffset(50, 10)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(11, -32), new PosOffset(27, -25), new PosOffset(46, -15)),
	];

	// Mid size
	public static final RightCanonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-49, 54), new PosOffset(-19, 54), new PosOffset(11, 54), new PosOffset(41, 54)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(21, 51), new PosOffset(47, 38), new PosOffset(72, 25), new PosOffset(96, 12)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(47, 8), new PosOffset(47, -13), new PosOffset(47, -34), new PosOffset(47, -55)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(27, -17), new PosOffset(5, -28), new PosOffset(-19, -40), new PosOffset(-42, -51)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, -59), new PosOffset(-24, -59), new PosOffset(-51, -59), new PosOffset(-78, -59)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(-61, -28), new PosOffset(-82, -17), new PosOffset(-103, -6), new PosOffset(-125, 5)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(-87, -10), new PosOffset(-87, 10), new PosOffset(-87, 30), new PosOffset(-87, 50)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(-82, 33), new PosOffset(-60, 44), new PosOffset(-39, 54), new PosOffset(-18, 64)),
	];

	public static final LeftCanonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-43, -59), new PosOffset(-15, -59), new PosOffset(13, -59), new PosOffset(41, -59)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(-63, -20), new PosOffset(-43, -30), new PosOffset(-23, -40), new PosOffset(-3, -50)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(-87, 8), new PosOffset(-87, -13), new PosOffset(-87, -34), new PosOffset(-87, -55)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(-60, 48), new PosOffset(-81, 38), new PosOffset(-102, 28), new PosOffset(-123, 18)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, 54), new PosOffset(-24, 54), new PosOffset(-51, 54), new PosOffset(-78, 54)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(42, 36), new PosOffset(24, 44), new PosOffset(-3, 59), new PosOffset(-26, 70)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(48, -10), new PosOffset(48, 10), new PosOffset(48, 30), new PosOffset(48, 50)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(25, -26), new PosOffset(47, -16), new PosOffset(70, -4), new PosOffset(93, 6)),
	];

	public var layers:h2d.Layers;

	public var direction = GameEntityDirection.East;

	public final shipSize:ShipHullSize;
	public final shipWindows:ShipWindows;
	public final shipGuns:ShipGuns;

	// Hull
	private final hull:ShipHull;

	// Sail and mast
	private final sailAndMast:ShipSailAndMast;

	// Decorative parts
	private final decor:ShipDecorations;

	// Guns
	public final rightSideGun1:ShipGun;
	public final rightSideGun2:ShipGun;
	public final rightSideGun3:ShipGun;
	public final rightSideGun4:ShipGun;

	public final leftSideGun1:ShipGun;
	public final leftSideGun2:ShipGun;
	public final leftSideGun3:ShipGun;
	public final leftSideGun4:ShipGun;

	// 1 - 4 > 3 > 2 > 1
	// 2 - 1 > 2 > 3 > 4
	private var gunsDrawingOrder = 1;

	public function new(s2d:h2d.Scene, shipSize:ShipHullSize, shipWindows:ShipWindows, shipGuns:ShipGuns) {
		super();

		this.shipSize = shipSize;
		this.shipWindows = shipWindows;
		this.shipGuns = shipGuns;

		layers = new Layers(this);

		// Hull init
		hull = new ShipHull(direction, shipSize);
		layers.add(hull, 0);

		// Decor
		decor = new ShipDecorations(direction, shipSize);
		layers.add(decor, 6);

		// Sail and mast
		sailAndMast = new ShipSailAndMast(direction, shipSize);
		layers.add(sailAndMast, 10);

		// Right side guns

		final canonsInitialPosRight = shipSize == SMALL ? RightCanonsOffsetByDirSm.get(direction) : RightCanonsOffsetByDirMid.get(direction);

		rightSideGun1 = new ShipGun(direction, Right);
		rightSideGun1.setPosition(canonsInitialPosRight.one.x, canonsInitialPosRight.one.y);

		if (shipGuns == TWO || shipGuns == THREE || shipGuns == FOUR) {
			rightSideGun2 = new ShipGun(direction, Right);
			rightSideGun2.setPosition(canonsInitialPosRight.two.x, canonsInitialPosRight.two.y);
		}

		if (shipGuns == THREE || shipGuns == FOUR) {
			rightSideGun3 = new ShipGun(direction, Right);
			rightSideGun3.setPosition(canonsInitialPosRight.three.x, canonsInitialPosRight.three.y);
		}

		if (shipGuns == FOUR) {
			rightSideGun4 = new ShipGun(direction, Right);
			rightSideGun4.setPosition(canonsInitialPosRight.four.x, canonsInitialPosRight.four.y);
		}

		// Left side guns
		final canonsInitialPosLeft = shipSize == SMALL ? LeftCanonsOffsetByDirSm.get(direction) : LeftCanonsOffsetByDirMid.get(direction);

		leftSideGun1 = new ShipGun(direction, Left);
		leftSideGun1.setPosition(canonsInitialPosLeft.one.x, canonsInitialPosLeft.one.y);

		if (shipGuns == TWO || shipGuns == THREE || shipGuns == FOUR) {
			leftSideGun2 = new ShipGun(direction, Left);
			leftSideGun2.setPosition(canonsInitialPosLeft.two.x, canonsInitialPosLeft.two.y);
		}

		if (shipGuns == THREE || shipGuns == FOUR) {
			leftSideGun3 = new ShipGun(direction, Left);
			leftSideGun3.setPosition(canonsInitialPosLeft.three.x, canonsInitialPosLeft.three.y);
		}

		if (shipGuns == FOUR) {
			leftSideGun4 = new ShipGun(direction, Left);
			leftSideGun4.setPosition(canonsInitialPosLeft.four.x, canonsInitialPosLeft.four.y);
		}

		if (rightSideGun4 != null)
			layers.add(rightSideGun4, 4);
		if (rightSideGun3 != null)
			layers.add(rightSideGun3, 4);
		if (rightSideGun2 != null)
			layers.add(rightSideGun2, 4);
		layers.add(rightSideGun1, 4);

		if (leftSideGun4 != null)
			layers.add(leftSideGun4, 5);
		if (leftSideGun3 != null)
			layers.add(leftSideGun3, 5);
		if (leftSideGun2 != null)
			layers.add(leftSideGun2, 5);
		layers.add(leftSideGun1, 5);

		s2d.addChild(this);
	}

	public function update() {
		rightSideGun1.update();
		if (leftSideGun2 != null)
			rightSideGun2.update();
		if (rightSideGun3 != null)
			rightSideGun3.update();
		if (rightSideGun4 != null)
			rightSideGun4.update();

		leftSideGun1.update();
		if (leftSideGun2 != null)
			leftSideGun2.update();
		if (leftSideGun3 != null)
			leftSideGun3.update();
		if (leftSideGun4 != null)
			leftSideGun4.update();
	}

	public function changeDirRight() {
		switch (direction) {
			case East:
				direction = SouthEast;
				changeGunsDrawingOrder();
			case SouthEast:
				direction = South;
			case South:
				direction = SouthWest;
			case SouthWest:
				direction = West;
			case West:
				direction = NorthWest;
			case NorthWest:
				direction = North;
			case North:
				direction = NorthEast;
				changeGunsDrawingOrder();
			case NorthEast:
				direction = East;
		}
		hanldeDirectionChange();
	}

	public function changeDirLeft() {
		switch (direction) {
			case East:
				direction = NorthEast;
			case NorthEast:
				direction = North;
			case North:
				direction = NorthWest;
			case NorthWest:
				direction = West;
			case West:
				direction = SouthWest;
				changeGunsDrawingOrder();
				decor.changeDrawingOrder();
			case SouthWest:
				direction = South;
			case South:
				direction = SouthEast;
			case SouthEast:
				direction = East;
				changeGunsDrawingOrder();
				decor.changeDrawingOrder();
		}
		hanldeDirectionChange();
	}

	private function changeGunsDrawingOrder() {
		if (gunsDrawingOrder == 1) {
			gunsDrawingOrder = 2;

			// Right side guns

			final rightGun4 = layers.getChildAtLayer(0, 4);
			final rightGun3 = layers.getChildAtLayer(1, 4);
			final rightGun2 = layers.getChildAtLayer(2, 4);
			final rightGun1 = layers.getChildAtLayer(3, 4);

			if (rightSideGun4 != null)
				layers.removeChild(rightGun4);
			if (rightSideGun3 != null)
				layers.removeChild(rightGun3);
			if (rightSideGun2 != null)
				layers.removeChild(rightGun2);
			layers.removeChild(rightGun1);

			layers.add(rightSideGun1, 4);
			if (rightSideGun2 != null)
				layers.add(rightSideGun2, 4);
			if (rightSideGun3 != null)
				layers.add(rightSideGun3, 4);
			if (rightSideGun4 != null)
				layers.add(rightSideGun4, 4);

			// Left side guns
			final leftGun4 = layers.getChildAtLayer(0, 5);
			final leftGun3 = layers.getChildAtLayer(1, 5);
			final leftGun2 = layers.getChildAtLayer(2, 5);
			final leftGun1 = layers.getChildAtLayer(3, 5);

			if (leftSideGun4 != null)
				layers.removeChild(leftGun4);
			if (leftSideGun3 != null)
				layers.removeChild(leftGun3);
			if (leftSideGun2 != null)
				layers.removeChild(leftGun2);
			layers.removeChild(leftGun1);

			layers.add(leftSideGun1, 5);
			if (leftSideGun2 != null)
				layers.add(leftSideGun2, 5);
			if (leftSideGun3 != null)
				layers.add(leftSideGun3, 5);
			if (leftSideGun4 != null)
				layers.add(leftSideGun4, 5);
		} else {
			gunsDrawingOrder = 1;

			// Right side guns
			final rightGun1 = layers.getChildAtLayer(0, 4);
			final rightGun2 = layers.getChildAtLayer(1, 4);
			final rightGun3 = layers.getChildAtLayer(2, 4);
			final rightGun4 = layers.getChildAtLayer(3, 4);

			layers.removeChild(rightGun1);
			if (rightSideGun2 != null)
				layers.removeChild(rightGun2);
			if (rightSideGun3 != null)
				layers.removeChild(rightGun3);
			if (rightSideGun4 != null)
				layers.removeChild(rightGun4);

			if (rightSideGun4 != null)
				layers.add(rightSideGun4, 4);
			if (rightSideGun3 != null)
				layers.add(rightSideGun3, 4);
			if (rightSideGun2 != null)
				layers.add(rightSideGun2, 4);
			layers.add(rightSideGun1, 4);

			// Left side guns
			final leftGun1 = layers.getChildAtLayer(0, 5);
			final leftGun2 = layers.getChildAtLayer(1, 5);
			final leftGun3 = layers.getChildAtLayer(2, 5);
			final leftGun4 = layers.getChildAtLayer(3, 5);

			layers.removeChild(leftGun1);
			if (leftSideGun2 != null)
				layers.removeChild(leftGun2);
			if (leftSideGun3 != null)
				layers.removeChild(leftGun3);
			if (leftSideGun4 != null)
				layers.removeChild(leftGun4);

			if (leftSideGun4 != null)
				layers.add(leftSideGun4, 5);
			if (leftSideGun3 != null)
				layers.add(leftSideGun3, 5);
			if (leftSideGun2 != null)
				layers.add(leftSideGun2, 5);
			layers.add(leftSideGun1, 5);
		}
	}

	private function hanldeDirectionChange() {
		hull.updateDirection(direction);
		sailAndMast.updateDirection(direction);
		decor.updateDirection(direction);

		// Handle right side guns
		final rightSideGunsPos = shipSize == SMALL ? RightCanonsOffsetByDirSm.get(direction) : RightCanonsOffsetByDirMid.get(direction);

		rightSideGun1.updateDirection(direction);
		rightSideGun1.setPosition(rightSideGunsPos.one.x, rightSideGunsPos.one.y);

		if (rightSideGun2 != null) {
			rightSideGun2.updateDirection(direction);
			rightSideGun2.setPosition(rightSideGunsPos.two.x, rightSideGunsPos.two.y);
		}
		if (rightSideGun3 != null) {
			rightSideGun3.updateDirection(direction);
			rightSideGun3.setPosition(rightSideGunsPos.three.x, rightSideGunsPos.three.y);
		}
		if (rightSideGun4 != null) {
			rightSideGun4.updateDirection(direction);
			rightSideGun4.setPosition(rightSideGunsPos.four.x, rightSideGunsPos.four.y);
		}

		// Handle left side guns
		final leftSideGunsPos = shipSize == SMALL ? LeftCanonsOffsetByDirSm.get(direction) : LeftCanonsOffsetByDirMid.get(direction);

		leftSideGun1.updateDirection(direction);
		leftSideGun1.setPosition(leftSideGunsPos.one.x, leftSideGunsPos.one.y);

		if (leftSideGun2 != null) {
			leftSideGun2.updateDirection(direction);
			leftSideGun2.setPosition(leftSideGunsPos.two.x, leftSideGunsPos.two.y);
		}
		if (leftSideGun3 != null) {
			leftSideGun3.updateDirection(direction);
			leftSideGun3.setPosition(leftSideGunsPos.three.x, leftSideGunsPos.three.y);
		}
		if (rightSideGun4 != null) {
			leftSideGun4.updateDirection(direction);
			leftSideGun4.setPosition(leftSideGunsPos.four.x, leftSideGunsPos.four.y);
		}
	}

	public function shootRight() {
		rightSideGun1.shoot();
		if (rightSideGun2 != null)
			rightSideGun2.shoot();
		if (rightSideGun3 != null)
			rightSideGun3.shoot();
		if (rightSideGun4 != null)
			rightSideGun4.shoot();
	}

	public function shootLeft() {
		leftSideGun1.shoot();
		if (leftSideGun2 != null)
			leftSideGun2.shoot();
		if (leftSideGun3 != null)
			leftSideGun3.shoot();
		if (leftSideGun4 != null)
			leftSideGun4.shoot();
	}
}
