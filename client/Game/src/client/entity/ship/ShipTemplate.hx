package client.entity.ship;

import h2d.Layers;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;

class ShipTemplate extends h2d.Object {
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

	public function new(shipSize:ShipHullSize, shipWindows:ShipWindows, shipGuns:ShipGuns) {
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

		final canonsInitialPosRight = shipSize == SMALL ? EngineShipEntity.RightCanonsOffsetByDirSm.get(direction) : EngineShipEntity.RightCanonsOffsetByDirMid.get(direction);

		rightSideGun1 = new ShipGun(shipSize, direction, Right);
		rightSideGun1.setPosition(canonsInitialPosRight.one.x, canonsInitialPosRight.one.y);

		if (shipGuns == TWO || shipGuns == THREE || shipGuns == FOUR) {
			rightSideGun2 = new ShipGun(shipSize, direction, Right);
			rightSideGun2.setPosition(canonsInitialPosRight.two.x, canonsInitialPosRight.two.y);
		}

		if (shipGuns == THREE || shipGuns == FOUR) {
			rightSideGun3 = new ShipGun(shipSize, direction, Right);
			rightSideGun3.setPosition(canonsInitialPosRight.three.x, canonsInitialPosRight.three.y);
		}

		// TODO qfix
		if (shipGuns == FOUR && shipSize != SMALL) {
			rightSideGun4 = new ShipGun(shipSize, direction, Right);
			rightSideGun4.setPosition(canonsInitialPosRight.four.x, canonsInitialPosRight.four.y);
		}

		// Left side guns
		final canonsInitialPosLeft = shipSize == SMALL ? EngineShipEntity.LeftCanonsOffsetByDirSm.get(direction) : EngineShipEntity.LeftCanonsOffsetByDirMid.get(direction);

		leftSideGun1 = new ShipGun(shipSize, direction, Left);
		leftSideGun1.setPosition(canonsInitialPosLeft.one.x, canonsInitialPosLeft.one.y);

		if (shipGuns == TWO || shipGuns == THREE || shipGuns == FOUR) {
			leftSideGun2 = new ShipGun(shipSize, direction, Left);
			leftSideGun2.setPosition(canonsInitialPosLeft.two.x, canonsInitialPosLeft.two.y);
		}

		if (shipGuns == THREE || shipGuns == FOUR) {
			leftSideGun3 = new ShipGun(shipSize, direction, Left);
			leftSideGun3.setPosition(canonsInitialPosLeft.three.x, canonsInitialPosLeft.three.y);
		}

		// TODO qfix
		if (shipGuns == FOUR && shipSize != SMALL) {
			leftSideGun4 = new ShipGun(shipSize, direction, Left);
			leftSideGun4.setPosition(canonsInitialPosLeft.four.x, canonsInitialPosLeft.four.y);
		}

		// TODO qfix
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
		// Right side guns
		var length = shipGuns == ShipGuns.THREE ? 3 : 4;
		final removedRightGuns = new Array<h2d.Object>();
		for (i in 0...length) {
			final rightGun = layers.getChildAtLayer(0, 4);
			removedRightGuns.push(rightGun);
			layers.removeChild(rightGun);
		}
		var i = length - 1;
		while (i >= 0) {
			layers.add(removedRightGuns[i], 4);
			i--;
		}

		// Left side guns
		length = shipGuns == ShipGuns.THREE ? 3 : 4;
		final removedLeftGuns = new Array<h2d.Object>();
		for (i in 0...length) {
			final leftGun = layers.getChildAtLayer(0, 5);
			removedLeftGuns.push(leftGun);
			layers.removeChild(leftGun);
		}
		i = length - 1;
		while (i >= 0) {
			layers.add(removedLeftGuns[i], 5);
			i--;
		}
	}

	private function hanldeDirectionChange() {
		hull.updateDirection(direction);
		sailAndMast.updateDirection(direction);
		decor.updateDirection(direction);

		// Handle right side guns
		final rightSideGunsPos = shipSize == SMALL ? EngineShipEntity.RightCanonsOffsetByDirSm.get(direction) : EngineShipEntity.RightCanonsOffsetByDirMid.get(direction);

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
		final leftSideGunsPos = shipSize == SMALL ? EngineShipEntity.LeftCanonsOffsetByDirSm.get(direction) : EngineShipEntity.LeftCanonsOffsetByDirMid.get(direction);

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
