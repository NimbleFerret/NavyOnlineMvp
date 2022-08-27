package engine.entity;

import engine.entity.EngineBaseGameEntity;
import engine.MathUtils;

typedef ShellRnd = {
	speed:Int,
	dir:Int,
	rotation:Int
}

enum DieEffect {
	Splash;
	Explosion;
}

class EngineShellEntity extends EngineBaseGameEntity {
	public final side:Side;
	public final pos:Int;
	public final shellRnd:ShellRnd;
	public final baseDamage = 50;
	public var dieEffect = DieEffect.Splash;

	final maxTravelDistance = 900;
	var distanceTraveled = 0.0;

	public function new(side:Side, pos:Int, x:Float, y:Float, rotation:Float, ownerId:String, ?shellRnd:ShellRnd) {
		super(GameEntityType.Shell, x, y, rotation, null, ownerId);

		this.side = side;
		this.pos = pos;

		if (shellRnd != null) {
			this.shellRnd = shellRnd;
		} else {
			this.shellRnd = {
				speed: Std.random(30),
				dir: Std.random(2),
				rotation: Std.random(7)
			};
		}

		currentSpeed = 380;
		currentSpeed += this.shellRnd.speed;

		this.rotation += MathUtils.degreeToRads(this.shellRnd.dir == 1 ? this.shellRnd.rotation : -this.shellRnd.rotation);
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
