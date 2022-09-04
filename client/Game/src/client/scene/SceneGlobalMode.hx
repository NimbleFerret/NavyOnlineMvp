package client.scene;

import haxe.Timer;
import client.network.RestProtocol;
import client.network.Rest;
import client.Player;
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
			case GameWorldData.SectorBaseType:
				contentRect.beginFill(0xFFEE4D);
			case GameWorldData.SectorIslandType:
				contentRect.beginFill(0x1EFF00);
			case GameWorldData.SectorBossType:
				contentRect.beginFill(0xF6BD02);
			case GameWorldData.SectorPVEType:
				contentRect.beginFill(0x5035FF);
			case GameWorldData.SectorPVPType:
				contentRect.beginFill(0xFF3B3B);
		}

		contentRect.drawRect(1, 1, 99, 99);
		contentRect.endFill();
	}
}

class EnterSectorCallback {
	public final joinSectorResponse:JoinSectorResponse;

	public function new(joinSectorResponse:JoinSectorResponse) {
		this.joinSectorResponse = joinSectorResponse;
	}
}

class SceneGlobalMode extends Scene {
	var playerBmp:h2d.Bitmap;

	var playerInitialized = false;
	var gameWorldInitialized = false;
	var allowPlayerMove = false;

	private var gameWorldSectors = new Array<SectorRectObject>();
	private final enterSectorCallback:EnterSectorCallback->Void;

	public function new(enterSectorCallback:EnterSectorCallback->Void) {
		super();

		this.enterSectorCallback = enterSectorCallback;

		start();
	}

	public function start() {
		playerInitialized = false;
		gameWorldInitialized = false;
		allowPlayerMove = false;
		gameWorldSectors = new Array<SectorRectObject>();

		if (playerBmp != null) {
			removeChild(playerBmp);
			playerBmp = null;
		}

		Rest.instance.signInOrUp(Player.instance.ethAddress, function callback(player:PlayerData) {
			if (!playerInitialized) {
				Player.instance.playerData = player;
				playerInitialized = true;
				initOrUpdateGameWorld();
			}
		});
	}

	private function movePlayer(x:Int, y:Int) {
		if (gameWorldInitialized && allowPlayerMove) {
			allowPlayerMove = false;
			Timer.delay(function resetMoveDelay() {
				allowPlayerMove = true;
			}, 1000);
			Rest.instance.worldMove(Player.instance.ethAddress, x, y, function callback(result:Bool) {
				if (result) {
					final pos = sectorPosToWorldCoords(x, y);
					playerBmp.setPosition(pos.x - 10, pos.y - 10);

					Player.instance.playerData.worldX = x;
					Player.instance.playerData.worldY = y;
				}
			});
		}
	}

	private function checkDistance(x:Int, y:Int) {
		final pos = sectorPosToWorldCoords(x, y);
		return hxd.Math.distance(pos.x - playerBmp.x, pos.y - playerBmp.y) < 200;
	}

	private function sectorPosToWorldCoords(sx:Int, sy:Int) {
		return {
			x: sx * 100 + 100 + 50,
			y: sy * 100 + 100 + 50
		}
	}

	private function initOrUpdateGameWorld() {
		Rest.instance.getWorldInfo(function callback(world:GameWorldData) {
			if (!gameWorldInitialized) {
				initiateGameWorld(world);
			} else {
				trace('update game world');
			}
		});
	}

	private function initiateGameWorld(world:GameWorldData) {
		for (x in 0...world.size) {
			for (y in 0...world.size) {
				final posX = x > 0 ? x * 100 - 1 : x * 100;
				final posY = y > 0 ? y * 100 - 1 : y * 100;

				var sectorType = GameWorldData.SectorEmptyType;
				for (sector in world.sectors) {
					if (sector.x == x && sector.y == y) {
						sectorType = sector.content;
					}
				}

				final sectorRectObject = new SectorRectObject(this, posX + 100, posY + 100, sectorType);
				final interaction = new h2d.Interactive(100, 100, sectorRectObject.object);
				interaction.onClick = function(event:hxd.Event) {
					if (Player.instance.playerData.worldX != x || Player.instance.playerData.worldY != y) {
						if (checkDistance(x, y)) {
							movePlayer(x, y);
						} else {
							trace("Too far");
							// TODO show dialog
						}
					} else if (Player.instance.playerData.worldX == x && Player.instance.playerData.worldY == y) {
						// TODO show dialog

						enterSector(x, y);

						// Game.CurrentSectorX = x;
						// Game.CurrentSectorY = y;

						// if (enterSectorCallback != null) {
						// 	enterSectorCallback(new SectorDescription(x, y));
						// }
					}
				}
				gameWorldSectors.push(sectorRectObject);
			}
		}

		gameWorldInitialized = true;
		allowPlayerMove = true;

		final playerTile = Tile.fromColor(0x863D0D, 20, 20);
		playerBmp = new Bitmap(playerTile);

		final pos = sectorPosToWorldCoords(Player.instance.playerData.worldX, Player.instance.playerData.worldY);
		playerBmp.setPosition(pos.x - 10, pos.y - 10);

		addChild(playerBmp);
	}

	private function enterSector(x:Int, y:Int) {
		if (gameWorldInitialized) {
			Rest.instance.worldEnter(Player.instance.ethAddress, x, y, function callback(response:JoinSectorResponse) {
				if (response.result) {
					if (enterSectorCallback != null) {
						enterSectorCallback(new EnterSectorCallback(response));
					}
				} else {
					trace(response.reason);
				}
			});
		}
	}
}
