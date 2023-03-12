package game.engine.navy.entity;

import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.geometry.Point;
import game.engine.base.BaseTypesAndClasses;
import game.engine.navy.NavyTypesAndClasses;
import game.engine.navy.NavyEngineConfig;

enum DieEffect {
	Splash;
	Explosion;
}

class NavyShellEntity extends EngineBaseGameEntity implements GameEntityCustomUpdate implements GameEntityCustomCollide {
	private final shellObjectEntity:ShellObjectEntity;
	private var distanceTraveled = 0.0;
	private var preUpdatePos = new Point();

	public var dieEffect = DieEffect.Splash;

	public function new(shellObjectEntity:ShellObjectEntity) {
		super(shellObjectEntity, NavyEntitiesConfig.EntityShapeByType.get(GameEntityType.SHELL));

		this.shellObjectEntity = shellObjectEntity;

		customUpdate = this;
		customCollide = this;
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		return true;
	}

	public function updateHashImpl() {
		return 0;
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
}
