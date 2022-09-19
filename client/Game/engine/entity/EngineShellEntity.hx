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

class EngineShellEntity extends EngineBaseGameEntity implements GameEntityCustomUpdate implements GameEntityCustomCollide {
	public final side:Side;
	public final pos:Int;
	public final shellRnd:ShellRnd;
	public final damage:Int;
	public final range:Int;

	public var dieEffect = DieEffect.Splash;

	var distanceTraveled = 0.0;

	public function new(side:Side, pos:Int, x:Float, y:Float, rotation:Float, damage:Int, range:Int, ownerId:String, ?shellRnd:ShellRnd) {
		super(GameEntityType.Shell, x, y, rotation, null, ownerId);

		customUpdate = this;
		customCollide = this;

		this.damage = damage;
		this.range = range;
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

		// currentSpeed = 0;
		currentSpeed = 380;
		currentSpeed += this.shellRnd.speed;

		this.rotation += MathUtils.degreeToRads(this.shellRnd.dir == 1 ? this.shellRnd.rotation : -this.shellRnd.rotation);
	}

	public function onUpdate() {
		distanceTraveled += Math.abs(dx) + Math.abs(dy);
		if (distanceTraveled >= range) {
			isAlive = false;
		}
	}

	public function onCollide() {
		isAlive = false;
		dieEffect = DieEffect.Explosion;
	}
}
