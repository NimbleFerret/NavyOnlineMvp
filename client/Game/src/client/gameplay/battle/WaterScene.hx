package client.gameplay.battle;

import engine.entity.EngineBaseGameEntity.GameEntityDirection;

class WaterScene extends h2d.Scene {
	public final waterBg:WaterBg;

	public function new() {
		super();

		scaleMode = Stretch(1920, 1080);

		waterBg = new WaterBg(this, 0, 0, 4);
	}

	public function update(dt:Float) {
		waterBg.update(dt);
	}

	public function updatePlayerMovement(isMoving:Bool = false, isMovingForward:Bool = false, direction:GameEntityDirection = GameEntityDirection.East,
			speed:Float = 0.0) {
		speed /= 2;
		if (isMoving) {
			switch (direction) {
				case East:
					waterBg.playerDX = 0.01 * speed;
					waterBg.playerDY = 0;
				case NorthEast:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case North:
					waterBg.playerDX = 0;
					waterBg.playerDY = -0.01 * speed;
				case NorthWest:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = -(0.01 * speed) / 2;
				case West:
					waterBg.playerDX = -0.01 * speed;
					waterBg.playerDY = 0;
				case SouthWest:
					waterBg.playerDX = -(0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
				case South:
					waterBg.playerDX = 0;
					waterBg.playerDY = 0.01 * speed;
				case SouthEast:
					waterBg.playerDX = (0.01 * speed) / 2;
					waterBg.playerDY = (0.01 * speed) / 2;
			}
		} else {
			waterBg.playerDX = 0;
			waterBg.playerDY = 0;
		}
	}
}
