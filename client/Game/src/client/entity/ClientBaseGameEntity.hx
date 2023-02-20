package client.entity;

import h2d.Layers;
import game.engine.entity.EngineBaseGameEntity;

abstract class ClientBaseGameEntity extends h2d.Object {
	var engineEntity:EngineBaseGameEntity;

	public var displayingObject:h2d.Object;
	public var layers:h2d.Layers;
	public var bmp:h2d.Bitmap;

	public function new() {
		super();
		layers = new Layers(this);
	}

	public function initiateEngineEntity(engineEntity:EngineBaseGameEntity) {
		this.engineEntity = engineEntity;
		setPosition(engineEntity.getX(), engineEntity.getY());
		// set_rotation(engineEntity.rotation);
	}

	public function updateEntityPosition(x:Float, y:Float) {
		engineEntity.setX(x);
		engineEntity.setY(y);
	}

	public function getBodyRectangle() {
		return engineEntity.getBodyRectangle();
	}

	public function getId() {
		return engineEntity.getId();
	}

	public function isAlive() {
		return engineEntity.isAlive;
	}

	// TODO make it abs ?
	public function onCollision() {}

	abstract public function update(dt:Float):Void;

	abstract public function debugDraw(graphics:h2d.Graphics):Void;
}
