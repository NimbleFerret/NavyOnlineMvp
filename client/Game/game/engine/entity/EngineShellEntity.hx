package game.engine.entity;

import hxd.Math;
import h2d.col.Point;
import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;

enum DieEffect {
	Splash;
	Explosion;
}

class EngineShellEntity extends EngineBaseGameEntity implements GameEntityCustomUpdate implements GameEntityCustomCollide {
	private final shellObjectEntity:ShellObjectEntity;
	private var distanceTraveled = 0.0;
	private var preUpdatePos = new Point();

	public var dieEffect = DieEffect.Splash;

	public function new(shellObjectEntity:ShellObjectEntity) {
		super(GameEntityType.Shell, shellObjectEntity);

		this.shellObjectEntity = shellObjectEntity;
		this.rotation = shellObjectEntity.rotation;

		customUpdate = this;
		customCollide = this;

		if (this.shellObjectEntity.shellRnd == null) {
			this.shellObjectEntity.shellRnd = {
				speed: Std.random(GameEngineConfig.ShellRandomSpeedFactor),
				dir: Std.random(2),
				rotation: Std.random(GameEngineConfig.ShellRandomAngleSpreadDegree)
			};
		}

		currentSpeed = GameEngineConfig.ShellDefaultSpeed;
		currentSpeed += this.shellObjectEntity.shellRnd.speed;

		final shellRndRotation = this.shellObjectEntity.shellRnd.rotation;

		this.rotation += MathUtils.degreeToRads(this.shellObjectEntity.shellRnd.dir == 1 ? shellRndRotation : -shellRndRotation);
	}

	public function onUpdate() {
		preUpdatePos.x = getX();
		preUpdatePos.y = getY();
	}

	public function postUpdate() {
		final newPos = new Point(getX(), getY());
		distanceTraveled += newPos.distance(preUpdatePos);
		if (distanceTraveled >= shellObjectEntity.range) {
			isAlive = false;
		}
	}

	public function onCollide() {
		isAlive = false;
		dieEffect = DieEffect.Explosion;
	}

	// -----------------------
	// Getters
	// -----------------------

	public function getSide() {
		return shellObjectEntity.side;
	}

	public function getPos() {
		return shellObjectEntity.pos;
	}

	public function getDamage() {
		return shellObjectEntity.damage;
	}

	public function getShellRnd() {
		return shellObjectEntity.shellRnd;
	}
}
