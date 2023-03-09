package client.entity;

import game.engine.navy.entity.NavyShellEntity;
import utils.Utils;

class ClientShell extends ClientBaseGameEntity {
	public function new(navyShellEntity:NavyShellEntity, ownerShip:ClientShip) {
		super();
		initiateEngineEntity(navyShellEntity);

		// Correct initial pos due to ship's position interpolation
		final offset = ownerShip.getCannonPositionBySideAndIndex(navyShellEntity.getSide(), navyShellEntity.getPos());
		final posX = offset.x;
		final posY = offset.y;

		setPosition(posX, posY);

		// Graphics init
		bmp = new h2d.Bitmap(hxd.Res.cannonBall.toTile().center());
		bmp.rotation = navyShellEntity.getRotation();
		addChild(bmp);
	}

	public function getDieEffect() {
		final navyShellEntity = cast(engineEntity, NavyShellEntity);
		return navyShellEntity.dieEffect;
	}

	public function update(dt:Float) {
		final dx = engineEntity.currentSpeed * dt * Math.cos(bmp.rotation);
		final dy = engineEntity.currentSpeed * dt * Math.sin(bmp.rotation);
		x = x + dx * 0.96;
		y = y + dy * 0.96;
	}

	public function debugDraw(graphics:h2d.Graphics) {
		final shellEntity = cast(engineEntity, NavyShellEntity);
		Utils.DrawRect(graphics, shellEntity.getBodyRectangle(), GameConfig.GreenColor);

		final forwardLine = shellEntity.getForwardLookingLine(50);
		final p1 = Utils.EngineToClientPoint(forwardLine.p1);
		final p2 = Utils.EngineToClientPoint(forwardLine.p2);
		Utils.DrawLine(graphics, p1, p2, GameConfig.RedColor);
	}
}
