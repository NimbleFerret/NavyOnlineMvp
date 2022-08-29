package client.scene;

import h2d.Bitmap;
import h2d.Tile;
import h2d.Scene;

enum SectorType {
	Empty;
	Base;
	Island;
	Combat;
}

class SectorRectObject {
	public final object:h2d.Object;

	var contentRect:h2d.Graphics;

	public function new(scene:Scene, x:Float, y:Float, sectorType:SectorType) {
		object = new h2d.Object(scene);
		object.setPosition(x, y);

		final borderRect = new h2d.Graphics(object);
		borderRect.lineStyle(3, 0xFFFFFF);
		borderRect.drawRect(0, 0, 100, 100);
		borderRect.endFill();

		contentRect = new h2d.Graphics(object);
		if (sectorType == Base) {
			contentRect.beginFill(0xFFEE4D);
		}
		if (sectorType == Island) {
			contentRect.beginFill(0x35FF3B);
		}
		if (sectorType == Combat) {
			contentRect.beginFill(0xFF3B3B);
		}
		contentRect.drawRect(1, 1, 99, 99);
		contentRect.endFill();
	}
}

class SectorDescription {
	public final x:Int;
	public final y:Int;

	public function new(x:Int, y:Int) {
		this.x = x;
		this.y = y;
	}
}

class SceneGlobalMode extends Scene {
	var playerPosX = 7;
	var playerPosY = 9;
	var player:h2d.Bitmap;

	public function new(enterSectorCallback:SectorDescription->Void) {
		super();

		for (x in 0...15) {
			for (y in 0...15) {
				final posX = x > 0 ? x * 100 - 1 : x * 100;
				final posY = y > 0 ? y * 100 - 1 : y * 100;

				var sectorType = Empty;
				if (x == 7 && y == 9) {
					sectorType = Base;
				}
				if (x == 1 && y == 4 || x == 12 && y == 5) {
					sectorType = Island;
				}

				if (x == 4 && y == 14 || x == 9 && y == 3) {
					sectorType = Combat;
				}

				final sector = new SectorRectObject(this, posX + 100, posY + 100, sectorType);

				var interaction = new h2d.Interactive(100, 100, sector.object);
				interaction.onClick = function(event:hxd.Event) {
					if (playerPosX != x || playerPosY != y) {
						if (checkDistance(x, y)) {
							movePlayer(x, y);
						} else {
							trace("Too far");
							// TODO show dialog
						}
					} else if (playerPosX == x && playerPosY == y) {
						// TODO show dialog

						Game.CurrentSectorX = x;
						Game.CurrentSectorY = y;

						if (enterSectorCallback != null) {
							enterSectorCallback(new SectorDescription(x, y));
						}
					}
				}
			}
		}

		final playerTile = Tile.fromColor(0x863D0D, 20, 20);
		player = new Bitmap(playerTile);

		final pos = sectorPosToWorldCoords(7, 9);
		player.setPosition(pos.x - 10, pos.y - 10);

		addChild(player);
	}

	function movePlayer(x:Int, y:Int) {
		final pos = sectorPosToWorldCoords(x, y);
		player.setPosition(pos.x - 10, pos.y - 10);

		playerPosX = x;
		playerPosY = y;
	}

	function checkDistance(x:Int, y:Int) {
		final pos = sectorPosToWorldCoords(x, y);
		return hxd.Math.distance(pos.x - player.x, pos.y - player.y) < 150;
	}

	function sectorPosToWorldCoords(sx:Int, sy:Int) {
		return {
			x: sx * 100 + 100 + 50,
			y: sy * 100 + 100 + 50
		}
	}
}
