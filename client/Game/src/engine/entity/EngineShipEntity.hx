package engine.entity;

import engine.entity.EngineBaseGameEntity.GameEntityType;

enum ShipSize {
	Small;
	Medium;
	Large;
}

class EngineShipEntity extends EngineBaseGameEntity {
	public final shipSize:ShipSize;

	public function new(x:Float, y:Float, shipSize:ShipSize, ?id:String) {
		super(GameEntityType.Ship, x, y, 0, id);

		this.shipSize = shipSize;
	}

	// -----------------------
	// Movement
	// -----------------------

	public function accelerate() {
		currentSpeed += speedStep;
		if (currentSpeed > maxSpeed)
			currentSpeed = maxSpeed;
	}

	public function decelerate() {
		currentSpeed -= speedStep;
		if (currentSpeed < minSpeed)
			currentSpeed = minSpeed;
	}

	public function rotateLeft() {
		rotation -= MathUtils.degreeToRads(45);
	}

	public function rotateRight() {
		rotation += MathUtils.degreeToRads(45);
	}

	public function customUpdate(dt:Float) {}

	public function onCollision() {}
}
