package client.gameplay.battle;

import game.engine.base.BaseTypesAndClasses;

class WaterScene extends h2d.Scene {
	private final waterBg:WaterBg;

	public function new() {
		super();
		scaleMode = Stretch(1920, 1080);
		waterBg = new WaterBg(this, 0, 0, 4);
	}

	public function update(dt:Float) {
		waterBg.update(dt);
	}

	public function updatePlayerMovement(isMoving:Bool = false, isMovingForward:Bool = false, direction:GameEntityDirection = EAST, speed:Float = 0.0) {
		speed /= 2;
		if (isMoving) {
			switch (direction) {
				case EAST:
					waterBg.playerDX = 0.01 * speed;
					waterBg.playerDY = 0;
				case NORTH_EAST:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case NORTH:
					waterBg.playerDX = 0;
					waterBg.playerDY = -0.01 * speed;
				case NORTH_WEST:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case WEST:
					waterBg.playerDX = -0.01 * speed;
					waterBg.playerDY = 0;
				case SOUTH_WEST:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
				case SOUTH:
					waterBg.playerDX = 0;
					waterBg.playerDY = 0.01 * speed;
				case SOUTH_EAST:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
			}
		} else {
			waterBg.playerDX = 0;
			waterBg.playerDY = 0;
		}
	}
}
