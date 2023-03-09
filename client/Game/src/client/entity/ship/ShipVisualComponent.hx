package client.entity.ship;

import game.engine.base.BaseTypesAndClasses;
import game.engine.navy.NavyTypesAndClasses;

abstract class ShipVisualComponent extends h2d.Object {
	var direction:GameEntityDirection;
	var prevDirection:GameEntityDirection;

	public var side:Side;

	public function new(?direction:GameEntityDirection, ?side:Side) {
		super();

		this.direction = direction;
		this.prevDirection = direction;
		this.side = side;
	}

	public function updateDirection(direction:GameEntityDirection) {
		prevDirection = this.direction;
		this.direction = direction;
		changeTilesDirection();
	}

	abstract function changeTilesDirection():Void;

	public abstract function update():Void;
}
