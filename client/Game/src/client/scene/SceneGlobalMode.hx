package client.scene;

import h3d.Engine;
import haxe.Timer;
import client.network.RestProtocol;
import client.network.Rest;
import client.Player;
import h2d.Bitmap;
import h2d.Tile;
import h2d.Scene;

final SectorSize = 96;

class SectorRectObject {
	public final object:h2d.Object;

	private var contentBmp:h2d.Bitmap;

	public function new(scene:Scene, x:Float, y:Float, sectorType:Int) {
		object = new h2d.Object(scene);
		object.setPosition(x, y);

		final borderRect = new h2d.Graphics(object);
		borderRect.lineStyle(3, 0xC79161);
		borderRect.drawRect(0, 0, SectorSize, SectorSize);
		borderRect.endFill();

		var isSkull = false;

		switch (sectorType) {
			case GameWorldData.SectorBaseType:
				contentBmp = new h2d.Bitmap(SceneGlobalMode.AcnhorTile);
			case GameWorldData.SectorIslandType:
				contentBmp = new h2d.Bitmap(SceneGlobalMode.IslandTile);
			case GameWorldData.SectorBossType:
				contentBmp = new h2d.Bitmap(SceneGlobalMode.BlueSkullTile);
				isSkull = true;
			case GameWorldData.SectorPVEType:
				contentBmp = new h2d.Bitmap(SceneGlobalMode.CommonSkullTile);
				isSkull = true;
			case GameWorldData.SectorPVPType:
				contentBmp = new h2d.Bitmap(SceneGlobalMode.PinkSkullTile);
				isSkull = true;
		}

		if (contentBmp != null) {
			if (isSkull) {
				contentBmp.setScale(2);
				contentBmp.setPosition(24, 24);
			}
			object.addChild(contentBmp);
		}
	}
}

class EnterSectorCallback {
	public final joinSectorResponse:JoinSectorResponse;

	public function new(joinSectorResponse:JoinSectorResponse) {
		this.joinSectorResponse = joinSectorResponse;
	}
}

class SceneGlobalMode extends Scene {
	public final hud:SceneGlobalModeUi;

	var playerBmp:h2d.Bitmap;

	var playerInitialized = false;
	var gameWorldInitialized = false;
	var allowPlayerMove = false;

	public static var AcnhorTile:h2d.Tile;
	public static var IslandTile:h2d.Tile;
	public static var CommonSkullTile:h2d.Tile;
	public static var BlueSkullTile:h2d.Tile;
	public static var PinkSkullTile:h2d.Tile;

	private var gameWorldSectors = new Array<SectorRectObject>();
	private final enterSectorCallback:EnterSectorCallback->Void;

	public function new(enterSectorCallback:EnterSectorCallback->Void, mainMenuCallback:Void->Void) {
		super();

		SceneGlobalMode.AcnhorTile = hxd.Res.anchor.toTile();
		SceneGlobalMode.IslandTile = hxd.Res.small_palm.toTile();
		SceneGlobalMode.CommonSkullTile = hxd.Res.common_skull.toTile();
		SceneGlobalMode.BlueSkullTile = hxd.Res.blue_skull.toTile();
		SceneGlobalMode.PinkSkullTile = hxd.Res.pink_skull.toTile();

		hud = new SceneGlobalModeUi(mainMenuCallback);

		this.enterSectorCallback = enterSectorCallback;

		start();
	}

	public function getHud() {
		return hud;
	}

	public override function render(e:Engine) {
		hud.render(e);
		super.render(e);
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
		return hxd.Math.distance(pos.x - playerBmp.x, pos.y - playerBmp.y) < SectorSize * 2;
	}

	private function sectorPosToWorldCoords(sx:Int, sy:Int) {
		return {
			x: sx * SectorSize + SectorSize + (SectorSize / 2),
			y: sy * SectorSize + SectorSize + (SectorSize / 2)
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
				final posX = x > 0 ? x * SectorSize - 1 : x * SectorSize;
				final posY = y > 0 ? y * SectorSize - 1 : y * SectorSize;

				var sectorType = GameWorldData.SectorEmptyType;
				for (sector in world.sectors) {
					if (sector.x == x && sector.y == y) {
						sectorType = sector.content;
					}
				}

				final sectorRectObject = new SectorRectObject(this, posX + SectorSize, posY + SectorSize, sectorType);
				final interaction = new h2d.Interactive(SectorSize, SectorSize, sectorRectObject.object);
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