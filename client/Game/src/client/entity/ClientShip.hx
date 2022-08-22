package client.entity;

import engine.entity.EngineShipEntity;

class ClientShip extends ClientBaseGameEntity {
	public function new(s2d:h2d.Scene, engineShipEntity:EngineShipEntity) {
		super();

		final hullTile = h2d.Tile.fromColor(0xFF00FF, 200, 100, 1);
		bmp = new h2d.Bitmap(hullTile);

		layers.add(bmp, 1);
		s2d.addChild(this);
	}

	public function update(dt:Float) {
		x = hxd.Math.lerp(x, engineEntity.x, 0.1);
		y = hxd.Math.lerp(y, engineEntity.y, 0.1);
	}
}
