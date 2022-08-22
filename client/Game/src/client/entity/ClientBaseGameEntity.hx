package client.entity;

import engine.entity.EngineBaseGameEntity;
import h2d.Layers;

abstract class ClientBaseGameEntity extends h2d.Object {
	var engineEntity:EngineBaseGameEntity;

	public var displayingObject:h2d.Object;
	public var layers:h2d.Layers;
	public var bmp:h2d.Bitmap;
	public var debugRect:h2d.Graphics;
	public var shapeColor = 0x00FF00;

	public function new() {
		super();
		layers = new Layers(this);
	}

	public function initiateEngineEntity(engineEntity:EngineBaseGameEntity) {
		this.engineEntity = engineEntity;
		setPosition(engineEntity.x, engineEntity.y);
		set_rotation(engineEntity.rotation);
	}

	public function getEngineEntityRect() {
		return engineEntity.getGameRect();
	}

	public function getId() {
		return engineEntity.id;
	}

	public function isAlive() {
		return engineEntity.isAlive;
	}

	// TODO make it abs ?
	public function onCollision() {}

	abstract public function update(dt:Float):Void;
}
