package client.entity;

import h2d.col.Point;
import game.engine.MathUtils;
import utils.Utils;
import game.engine.entity.EngineShellEntity;

class ClientShell extends ClientBaseGameEntity {
	public function new(engineShellEntity:EngineShellEntity, ownerShip:ClientShip) {
		super();
		initiateEngineEntity(engineShellEntity);

		// Correct initial pos due to ship's position interpolation
		final offset = ownerShip.getCannonPositionBySideAndIndex(engineShellEntity.getSide(), engineShellEntity.getPos());
		final posX = offset.x;
		final posY = offset.y;

		setPosition(posX, posY);
		// Graphics init
		bmp = new h2d.Bitmap(hxd.Res.cannonBall.toTile().center());
		bmp.rotation = engineShellEntity.rotation;
		addChild(bmp);
	}

	public function getDieEffect() {
		final engineShellEntity = cast(engineEntity, EngineShellEntity);
		return engineShellEntity.dieEffect;
	}

	public function update(dt:Float) {
		final dx = engineEntity.currentSpeed * dt * Math.cos(bmp.rotation);
		final dy = engineEntity.currentSpeed * dt * Math.sin(bmp.rotation);
		x += dx;
		y += dy;
	}

	public function debugDraw(graphics:h2d.Graphics) {
		final shipEntity = cast(engineEntity, EngineShellEntity);
		Utils.DrawRect(graphics, shipEntity.getBodyRectangle(), GameConfig.GreenColor);

		final forwardLine = shipEntity.getForwardLookingLine(50);
		Utils.DrawLine(graphics, forwardLine.p1, forwardLine.p2, GameConfig.RedColor);
	}
}
