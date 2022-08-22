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
		if (engineShellEntity.side == Side.Left) {
			if (engineShellEntity.pos == 0) {
				posX = ownerShip.leftCanon1.localToGlobal().x;
				posY = ownerShip.leftCanon1.localToGlobal().y;
			} else if (engineShellEntity.pos == 1) {
				posX = ownerShip.leftCanon2.localToGlobal().x;
				posY = ownerShip.leftCanon2.localToGlobal().y;
			} else if (engineShellEntity.pos == 2) {
				posX = ownerShip.leftCanon3.localToGlobal().x;
				posY = ownerShip.leftCanon3.localToGlobal().y;
			}
		} else {
			if (engineShellEntity.pos == 0) {
				posX = ownerShip.rightCanon1.localToGlobal().x;
				posY = ownerShip.rightCanon1.localToGlobal().y;
			} else if (engineShellEntity.pos == 1) {
				posX = ownerShip.rightCanon2.localToGlobal().x;
				posY = ownerShip.rightCanon2.localToGlobal().y;
			} else if (engineShellEntity.pos == 2) {
				posX = ownerShip.rightCanon3.localToGlobal().x;
				posY = ownerShip.rightCanon3.localToGlobal().y;
			}
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
