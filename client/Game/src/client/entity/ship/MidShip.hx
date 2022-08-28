package client.entity.ship;

import h2d.Layers;
import engine.entity.EngineBaseGameEntity;

enum ShipWindows {
	ONE;
	TWO;
	NONE;
}

enum ShipGuns {
	THREE;
	FOUR;
}

class MidShip extends h2d.Object {
	public static final RightCanonsOffsetByDir:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-49, 54), new PosOffset(-19, 54), new PosOffset(11, 54), new PosOffset(41, 54)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(21, 51), new PosOffset(47, 38), new PosOffset(72, 25), new PosOffset(96, 12)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(47, 8), new PosOffset(47, -13), new PosOffset(47, -34), new PosOffset(47, -55)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(27, -17), new PosOffset(5, -28), new PosOffset(-19, -40), new PosOffset(-42, -51)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, -59), new PosOffset(-24, -59), new PosOffset(-51, -59), new PosOffset(-78, -59)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(-61, -28), new PosOffset(-82, -17), new PosOffset(-103, -6), new PosOffset(-125, 5)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(-87, -10), new PosOffset(-87, 10), new PosOffset(-87, 30), new PosOffset(-87, 50)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(-82, 33), new PosOffset(-60, 44), new PosOffset(-39, 54), new PosOffset(-18, 64)),
	];

	public static final LeftCanonsOffsetByDir:Map<GameEntityDirection, PosOffsetArray> = [
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

	final shipWindows:ShipWindows;
	final shipGuns:ShipGuns;

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

	public function new(s2d:h2d.Scene, shipWindows:ShipWindows, shipGuns:ShipGuns) {
		super();

		this.shipWindows = shipWindows;
		this.shipGuns = shipGuns;

		layers = new Layers(this);

		// Hull init
		hull = new ShipHull(direction);
		layers.add(hull, 0);

		// Sail and mast
		sailAndMast = new ShipSailAndMast(direction);
		layers.add(sailAndMast, 6);

		// Decor
		decor = new ShipDecorations(direction);
		layers.add(decor, 10);

		// Sail and mast

		// Right side guns
		final canonsInitialPosRight = RightCanonsOffsetByDir.get(direction);

		rightSideGun1 = new ShipGun(direction, Right);
		rightSideGun1.setPosition(canonsInitialPosRight.one.x, canonsInitialPosRight.one.y);

		rightSideGun2 = new ShipGun(direction, Right);
		rightSideGun2.setPosition(canonsInitialPosRight.two.x, canonsInitialPosRight.two.y);

		rightSideGun3 = new ShipGun(direction, Right);
		rightSideGun3.setPosition(canonsInitialPosRight.three.x, canonsInitialPosRight.three.y);

		rightSideGun4 = new ShipGun(direction, Right);
		rightSideGun4.setPosition(canonsInitialPosRight.four.x, canonsInitialPosRight.four.y);

		// Left side guns
		final canonsInitialPosLeft = LeftCanonsOffsetByDir.get(direction);

		leftSideGun1 = new ShipGun(direction, Left);
		leftSideGun1.setPosition(canonsInitialPosLeft.one.x, canonsInitialPosLeft.one.y);

		leftSideGun2 = new ShipGun(direction, Left);
		leftSideGun2.setPosition(canonsInitialPosLeft.two.x, canonsInitialPosLeft.two.y);

		leftSideGun3 = new ShipGun(direction, Left);
		leftSideGun3.setPosition(canonsInitialPosLeft.three.x, canonsInitialPosLeft.three.y);

		leftSideGun4 = new ShipGun(direction, Left);
		leftSideGun4.setPosition(canonsInitialPosLeft.four.x, canonsInitialPosLeft.four.y);

		// Implement different order depending on current side and direction
		layers.add(rightSideGun4, 4);
		layers.add(rightSideGun3, 4);
		layers.add(rightSideGun2, 4);
		layers.add(rightSideGun1, 4);

		layers.add(leftSideGun4, 5);
		layers.add(leftSideGun3, 5);
		layers.add(leftSideGun2, 5);
		layers.add(leftSideGun1, 5);

		s2d.addChild(this);
	}

	public function update() {
		rightSideGun1.update();
		rightSideGun2.update();
		rightSideGun3.update();
		rightSideGun4.update();

		leftSideGun1.update();
		leftSideGun2.update();
		leftSideGun3.update();
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
			case SouthWest:
				direction = South;
			case South:
				direction = SouthEast;
			case SouthEast:
				changeGunsDrawingOrder();
				direction = East;
		}
		hanldeDirectionChange();
	}

	// TODO refactor boilerplate code
	private function changeGunsDrawingOrder() {
		if (gunsDrawingOrder == 1) {
			gunsDrawingOrder = 2;

			// Right side guns
			final rightGun4 = layers.getChildAtLayer(0, 4);
			final rightGun3 = layers.getChildAtLayer(1, 4);
			final rightGun2 = layers.getChildAtLayer(2, 4);
			final rightGun1 = layers.getChildAtLayer(3, 4);

			layers.removeChild(rightGun4);
			layers.removeChild(rightGun3);
			layers.removeChild(rightGun2);
			layers.removeChild(rightGun1);

			layers.add(rightSideGun1, 4);
			layers.add(rightSideGun2, 4);
			layers.add(rightSideGun3, 4);
			layers.add(rightSideGun4, 4);

			// Left side guns
			final leftGun4 = layers.getChildAtLayer(0, 5);
			final leftGun3 = layers.getChildAtLayer(1, 5);
			final leftGun2 = layers.getChildAtLayer(2, 5);
			final leftGun1 = layers.getChildAtLayer(3, 5);

			layers.removeChild(leftGun4);
			layers.removeChild(leftGun3);
			layers.removeChild(leftGun2);
			layers.removeChild(leftGun1);

			layers.add(leftSideGun1, 5);
			layers.add(leftSideGun2, 5);
			layers.add(leftSideGun3, 5);
			layers.add(leftSideGun4, 5);
		} else {
			gunsDrawingOrder = 1;

			// Right side guns
			final rightGun1 = layers.getChildAtLayer(0, 4);
			final rightGun2 = layers.getChildAtLayer(1, 4);
			final rightGun3 = layers.getChildAtLayer(2, 4);
			final rightGun4 = layers.getChildAtLayer(3, 4);

			layers.removeChild(rightGun1);
			layers.removeChild(rightGun2);
			layers.removeChild(rightGun3);
			layers.removeChild(rightGun4);

			layers.add(rightSideGun4, 4);
			layers.add(rightSideGun3, 4);
			layers.add(rightSideGun2, 4);
			layers.add(rightSideGun1, 4);

			// Left side guns
			final leftGun1 = layers.getChildAtLayer(0, 5);
			final leftGun2 = layers.getChildAtLayer(1, 5);
			final leftGun3 = layers.getChildAtLayer(2, 5);
			final leftGun4 = layers.getChildAtLayer(3, 5);

			layers.removeChild(leftGun1);
			layers.removeChild(leftGun2);
			layers.removeChild(leftGun3);
			layers.removeChild(leftGun4);

			layers.add(leftSideGun4, 5);
			layers.add(leftSideGun3, 5);
			layers.add(leftSideGun2, 5);
			layers.add(leftSideGun1, 5);
		}
	}

	private function hanldeDirectionChange() {
		hull.updateDirection(direction);
		sailAndMast.updateDirection(direction);
		decor.updateDirection(direction);

		// Handle right side guns
		rightSideGun1.updateDirection(direction);
		rightSideGun2.updateDirection(direction);
		rightSideGun3.updateDirection(direction);
		rightSideGun4.updateDirection(direction);

		final rightSideGunsPos = RightCanonsOffsetByDir.get(direction);
		rightSideGun1.setPosition(rightSideGunsPos.one.x, rightSideGunsPos.one.y);
		rightSideGun2.setPosition(rightSideGunsPos.two.x, rightSideGunsPos.two.y);
		rightSideGun3.setPosition(rightSideGunsPos.three.x, rightSideGunsPos.three.y);
		rightSideGun4.setPosition(rightSideGunsPos.four.x, rightSideGunsPos.four.y);

		// Handle left side guns
		leftSideGun1.updateDirection(direction);
		leftSideGun2.updateDirection(direction);
		leftSideGun3.updateDirection(direction);
		leftSideGun4.updateDirection(direction);

		final leftSideGunsPos = LeftCanonsOffsetByDir.get(direction);
		leftSideGun1.setPosition(leftSideGunsPos.one.x, leftSideGunsPos.one.y);
		leftSideGun2.setPosition(leftSideGunsPos.two.x, leftSideGunsPos.two.y);
		leftSideGun3.setPosition(leftSideGunsPos.three.x, leftSideGunsPos.three.y);
		leftSideGun4.setPosition(leftSideGunsPos.four.x, leftSideGunsPos.four.y);
	}

	public function shootRight() {
		rightSideGun1.shoot();
		rightSideGun2.shoot();
		rightSideGun3.shoot();
		rightSideGun4.shoot();
	}

	public function shootLeft() {
		leftSideGun1.shoot();
		leftSideGun2.shoot();
		leftSideGun3.shoot();
		leftSideGun4.shoot();
	}
}
