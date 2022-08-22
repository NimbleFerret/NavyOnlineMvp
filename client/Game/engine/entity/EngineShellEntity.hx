package engine.entity;

import engine.entity.EngineBaseGameEntity;

enum DieEffect {
	Splash;
	Explosion;
}

class EngineShellEntity extends EngineBaseGameEntity {
	public final side:Side;
	public final pos:Int;
	public final baseDamage = 50;
	public var dieEffect = DieEffect.Splash;

	final maxTravelDistance = 600;
	var distanceTraveled = 0.0;

	public function new(side:Side, pos:Int, x:Float, y:Float, rotation:Float, ownerId:String) {
		super(GameEntityType.Shell, x, y, rotation, null, ownerId);
		this.side = side;
		this.pos = pos;
		currentSpeed = 380;
		currentSpeed += Std.random(30);
		final rndDir = Std.random(2);
		final rndAngle = Std.random(7);
		this.rotation += MathUtils.degreeToRads(rndDir == 1 ? rndAngle : -rndAngle);
	}

	public function customUpdate(dt:Float) {
		distanceTraveled += Math.abs(dx) + Math.abs(dy);
		if (distanceTraveled >= maxTravelDistance) {
			isAlive = false;
		}
	}

	public function onCollision() {
		isAlive = false;
		dieEffect = DieEffect.Explosion;
	}
}
