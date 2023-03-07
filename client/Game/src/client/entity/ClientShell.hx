package client.entity;

import game.engine.entity.EngineShellEntity;
import utils.Utils;

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
		x = x + dx * 0.96;
		y = y + dy * 0.96;
	}

	public function debugDraw(graphics:h2d.Graphics) {
		final shipEntity = cast(engineEntity, EngineShellEntity);
		Utils.DrawRect(graphics, shipEntity.getBodyRectangle(), GameConfig.GreenColor);

		final forwardLine = shipEntity.getForwardLookingLine(50);
		final p1 = Utils.EngineToClientPoint(forwardLine.p1);
		final p2 = Utils.EngineToClientPoint(forwardLine.p2);
		Utils.DrawLine(graphics, p1, p2, GameConfig.RedColor);
	}
}
