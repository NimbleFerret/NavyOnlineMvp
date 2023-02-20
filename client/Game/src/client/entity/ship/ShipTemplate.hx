package client.entity.ship;

import h2d.Graphics;
import utils.ReverseIterator;
import haxe.Int32;
import h2d.Layers;
import game.engine.entity.TypesAndClasses;
import game.engine.entity.EngineShipEntityConfig;

class ShipTemplate extends h2d.Object {
	public var layers:h2d.Layers;
	public var direction:GameEntityDirection;

	// Is it possible to reuse from engine entity ?
	public final shipSize:ShipHullSize;
	public final shipWindows:ShipWindows;
	public final shipCannons:ShipCannons;

	// Cannons
	public var cannonsTotal:Int32;
	public final rightSideCannons = new Array<ShipCannon>();
	public final leftSideCannons = new Array<ShipCannon>();

	// Hull
	private final hull:ShipHull;

	// Sail and mast
	private final sailAndMast:ShipSailAndMast;

	// Decorative parts
	private final decor:ShipDecorations;

	private final rightCannonsLayer = 4;
	private final leftCannonsLayer = 5;

	// 1 - 4 > 3 > 2 > 1
	// 2 - 1 > 2 > 3 > 4
	private var cannonsDrawingOrder = 1;

	private var decorWasChanged = false;

	public function new(direction:GameEntityDirection, shipSize:ShipHullSize, shipWindows:ShipWindows, shipCannons:ShipCannons) {
		super();

		this.direction = direction;
		this.shipSize = shipSize;
		this.shipWindows = shipWindows;
		this.shipCannons = shipCannons;

		switch (shipCannons) {
			case ONE:
				cannonsTotal = 1;
			case TWO:
				cannonsTotal = 2;
			case THREE:
				cannonsTotal = 3;
			case FOUR:
				cannonsTotal = 4;
			case ZERO:
				cannonsTotal = 0;
		}

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

		final cannonsInitialPosRight = shipSize == SMALL ? EngineShipEntityConfig.RightCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirMid.get(direction);
		final cannonsInitialPosLeft = shipSize == SMALL ? EngineShipEntityConfig.LeftCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.LeftCannonsOffsetByDirMid.get(direction);

		for (i in 0...cannonsTotal) {
			final rightSideCannon = new ShipCannon(this, shipSize, direction, Right);
			rightSideCannon.setPosition(cannonsInitialPosRight.positions[i].x, cannonsInitialPosRight.positions[i].y);
			rightSideCannons.push(rightSideCannon);

			final leftSideCannon = new ShipCannon(this, shipSize, direction, Left);
			leftSideCannon.setPosition(cannonsInitialPosLeft.positions[i].x, cannonsInitialPosLeft.positions[i].y);
			leftSideCannons.push(leftSideCannon);
		}

		for (i in new ReverseIterator(cannonsTotal - 1, 0)) {
			layers.add(rightSideCannons[i], rightCannonsLayer);
			layers.add(leftSideCannons[i], leftCannonsLayer);
		}
	}

	public function update() {
		for (i in 0...cannonsTotal) {
			rightSideCannons[i].update();
			leftSideCannons[i].update();
		}
	}

	public function drawCannonsFiringArea(graphics:Graphics) {
		for (i in 0...cannonsTotal) {
			rightSideCannons[i].drawFiringArea(graphics);
			leftSideCannons[i].drawFiringArea(graphics);
		}
	}

	public function changeDirRight() {
		switch (direction) {
			case East:
				direction = SouthEast;
				changeCannonsDrawingOrder();
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
				changeCannonsDrawingOrder();
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
				changeCannonsDrawingOrder();
				decor.changeDrawingOrder();
				decorWasChanged = true;
			case SouthWest:
				direction = South;
			case South:
				direction = SouthEast;
			case SouthEast:
				direction = East;
				changeCannonsDrawingOrder();
				decor.changeDrawingOrder();
				decorWasChanged = true;
		}
		hanldeDirectionChange();
	}

	private function changeCannonsDrawingOrder() {
		var length = cannonsTotal;

		// Right side cannons
		final removedRightCannons = new Array<h2d.Object>();
		for (i in 0...length) {
			final rightCannon = layers.getChildAtLayer(0, rightCannonsLayer);
			removedRightCannons.push(rightCannon);
			layers.removeChild(rightCannon);
		}
		var i = length - 1;
		while (i >= 0) {
			layers.add(removedRightCannons[i], rightCannonsLayer);
			i--;
		}

		// Left side cannons
		final removedLeftCannons = new Array<h2d.Object>();
		for (i in 0...length) {
			final leftCannon = layers.getChildAtLayer(0, leftCannonsLayer);
			removedLeftCannons.push(leftCannon);
			layers.removeChild(leftCannon);
		}
		i = length - 1;
		while (i >= 0) {
			layers.add(removedLeftCannons[i], leftCannonsLayer);
			i--;
		}
	}

	private function hanldeDirectionChange() {
		hull.updateDirection(direction);
		sailAndMast.updateDirection(direction);
		decor.updateDirection(direction);

		final rightSideCannonsPos = shipSize == SMALL ? EngineShipEntityConfig.RightCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirMid.get(direction);
		final leftSideCannonsPos = shipSize == SMALL ? EngineShipEntityConfig.LeftCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.LeftCannonsOffsetByDirMid.get(direction);

		for (i in 0...cannonsTotal) {
			rightSideCannons[i].updateDirection(direction);
			rightSideCannons[i].setPosition(rightSideCannonsPos.positions[i].x, rightSideCannonsPos.positions[i].y);

			leftSideCannons[i].updateDirection(direction);
			leftSideCannons[i].setPosition(leftSideCannonsPos.positions[i].x, leftSideCannonsPos.positions[i].y);
		}
	}

	public function shootRight() {
		for (cannon in rightSideCannons) {
			cannon.shoot();
		}
	}

	public function shootLeft() {
		for (cannon in leftSideCannons) {
			cannon.shoot();
		}
	}
}
