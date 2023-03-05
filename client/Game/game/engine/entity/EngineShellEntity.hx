package game.engine.entity;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.geometry.Point;

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
		super(GameEntityType.SHELL, shellObjectEntity);

		this.shellObjectEntity = shellObjectEntity;
		this.rotation = shellObjectEntity.rotation;

		customUpdate = this;
		customCollide = this;
		currentSpeed = GameEngineConfig.ShellDefaultSpeed;
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		return true;
	}

	// ------------------------------------------------
	// General
	// ------------------------------------------------

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

	public function getRotation() {
		return shellObjectEntity.rotation;
	}
}
