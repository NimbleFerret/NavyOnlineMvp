package client.scene;

import haxe.Timer;
import client.network.RestProtocol;
import client.network.Rest;
import h2d.Bitmap;
import h2d.Tile;
import h2d.Scene;

class SectorRectObject {
	public final object:h2d.Object;

	var contentRect:h2d.Graphics;

	public function new(scene:Scene, x:Float, y:Float, sectorType:Int) {
		object = new h2d.Object(scene);
		object.setPosition(x, y);

		final borderRect = new h2d.Graphics(object);
		borderRect.lineStyle(3, 0xFFFFFF);
		borderRect.drawRect(0, 0, 100, 100);
		borderRect.endFill();

		contentRect = new h2d.Graphics(object);

		switch (sectorType) {
			case GameWorld.SectorBaseType:
				contentRect.beginFill(0xFFEE4D);
			case GameWorld.SectorIslandType:
				contentRect.beginFill(0x1EFF00);
			case GameWorld.SectorBossType:
				contentRect.beginFill(0xF6BD02);
			case GameWorld.SectorPVEType:
				contentRect.beginFill(0x5035FF);
			case GameWorld.SectorPVPType:
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
	var player:Player;
	var playerBmp:h2d.Bitmap;

	var playerInitialized = false;
	var gameWorldInitialized = false;

	var allowPlayerMove = true;

	private final gameWorldSectors = new Array<SectorRectObject>();
	private final enterSectorCallback:SectorDescription->Void;

	public function new(enterSectorCallback:SectorDescription->Void) {
		super();

		this.enterSectorCallback = enterSectorCallback;

		Rest.instance.signInOrUp('0x0...1', function callback(player:Player) {
			if (!playerInitialized) {
				this.player = player;
				playerInitialized = true;
				initOrUpdateGameWorld();
			}
		});

		// final xxx = new YesNoDialog(this, 0, 0);
		// addChild(xxx.guiObject);
	}

	function movePlayer(x:Int, y:Int) {
		if (gameWorldInitialized && allowPlayerMove) {
			allowPlayerMove = false;
			Timer.delay(function resetMoveDelay() {
				allowPlayerMove = true;
			}, 2000);
			Rest.instance.worldMove(player.ethAddress, x, y, function callback(result:Bool) {
				if (result) {
					final pos = sectorPosToWorldCoords(x, y);
					playerBmp.setPosition(pos.x - 10, pos.y - 10);

					player.worldX = x;
					player.worldY = y;
				}
			});
		}
	}

	function checkDistance(x:Int, y:Int) {
		final pos = sectorPosToWorldCoords(x, y);
		return hxd.Math.distance(pos.x - playerBmp.x, pos.y - playerBmp.y) < 150;
	}

	function sectorPosToWorldCoords(sx:Int, sy:Int) {
		return {
			x: sx * 100 + 100 + 50,
			y: sy * 100 + 100 + 50
		}
	}

	private function initOrUpdateGameWorld() {
		Rest.instance.getWorldInfo(function callback(world:GameWorld) {
			if (!gameWorldInitialized) {
				initiateGameWorld(world);
			} else {
				trace('update game world');
			}
		});
	}

	private function initiateGameWorld(world:GameWorld) {
		for (x in 0...world.size) {
			for (y in 0...world.size) {
				final posX = x > 0 ? x * 100 - 1 : x * 100;
				final posY = y > 0 ? y * 100 - 1 : y * 100;

				var sectorType = GameWorld.SectorEmptyType;
				for (sector in world.sectors) {
					if (sector.x == x && sector.y == y) {
						sectorType = sector.content;
					}
				}

				final sectorRectObject = new SectorRectObject(this, posX + 100, posY + 100, sectorType);
				final interaction = new h2d.Interactive(100, 100, sectorRectObject.object);
				interaction.onClick = function(event:hxd.Event) {
					if (this.player.worldX != x || this.player.worldY != y) {
						if (checkDistance(x, y)) {
							movePlayer(x, y);
						} else {
							trace("Too far");
							// TODO show dialog
						}
					} else if (this.player.worldX == x && this.player.worldY == y) {
						// TODO show dialog

						Game.CurrentSectorX = x;
						Game.CurrentSectorY = y;

						if (enterSectorCallback != null) {
							enterSectorCallback(new SectorDescription(x, y));
						}
					}
				}
				gameWorldSectors.push(sectorRectObject);
			}
		}

		gameWorldInitialized = true;

		final playerTile = Tile.fromColor(0x863D0D, 20, 20);
		playerBmp = new Bitmap(playerTile);

		final pos = sectorPosToWorldCoords(player.worldX, player.worldY);
		playerBmp.setPosition(pos.x - 10, pos.y - 10);

		addChild(playerBmp);
	}
}
