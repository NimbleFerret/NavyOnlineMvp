package client.entity;

import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShellEntity;

class ClientShell extends ClientBaseGameEntity {
	public function new(s2d:h2d.Scene, engineShellEntity:EngineShellEntity, ownerShip:ClientShip) {
		super();
		initiateEngineEntity(engineShellEntity);
		// Correct initial pos due to ship's position interpolation
		var posX = 0.0;
		var posY = 0.0;
		if (engineShellEntity.pos == 0) {
			posX = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 0).x;
			posX = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 0).y;
		} else if (engineShellEntity.pos == 1) {
			posX = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 1).x;
			posY = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 1).y;
		} else if (engineShellEntity.pos == 2) {
			posX = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 2).x;
			posY = ownerShip.getCanonOffsetBySideAndIndex(engineShellEntity.side, 2).y;
		}
		setPosition(posX, posY);
		// Graphics init
		var shellTile = hxd.Res.cannonBall.toTile();
		shellTile = shellTile.center();
		bmp = new h2d.Bitmap(shellTile);
		bmp.rotation = engineShellEntity.rotation;
		addChild(bmp);
		s2d.addChild(this);
	}

	public function update(dt:Float) {
		final dx = engineEntity.currentSpeed * dt * Math.cos(bmp.rotation);
		final dy = engineEntity.currentSpeed * dt * Math.sin(bmp.rotation);
		x += dx;
		y += dy;
	}

	public function getDieEffect() {
		final engineShellEntity = cast(engineEntity, EngineShellEntity);
		return engineShellEntity.dieEffect;
	}
}
