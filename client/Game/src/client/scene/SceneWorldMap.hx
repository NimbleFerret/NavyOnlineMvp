// package client.scene;
// import haxe.Timer;
// import h2d.Bitmap;
// import h2d.Tile;
// import h2d.Scene;
// import h3d.Engine;
// import client.Player;
// import client.network.RestProtocol;
// import client.network.Rest;
// import client.ui.hud.SceneWorldMapHud;
// final SectorSize = 64;
// class SectorRectObject {
// 	public final object:h2d.Object;
// 	private var contentBmp:h2d.Bitmap;
// 	public function new(scene:Scene, x:Float, y:Float, sectorType:Int) {
// 		object = new h2d.Object(scene);
// 		object.setPosition(x, y);
// 		final borderRect = new h2d.Graphics(object);
// 		borderRect.lineStyle(3, 0xC79161);
// 		borderRect.drawRect(0, 0, SectorSize, SectorSize);
// 		borderRect.endFill();
// 		var isSkull = false;
// 		switch (sectorType) {
// 			case GameWorldData.SectorBaseType:
// 				contentBmp = new h2d.Bitmap(SceneWorldMap.AcnhorTile);
// 			case GameWorldData.SectorIslandType:
// 				contentBmp = new h2d.Bitmap(SceneWorldMap.IslandTile);
// 			case GameWorldData.SectorBossType:
// 				contentBmp = new h2d.Bitmap(SceneWorldMap.BlueSkullTile);
// 				isSkull = true;
// 			case GameWorldData.SectorPVEType:
// 				contentBmp = new h2d.Bitmap(SceneWorldMap.CommonSkullTile);
// 				isSkull = true;
// 			case GameWorldData.SectorPVPType:
// 				contentBmp = new h2d.Bitmap(SceneWorldMap.PinkSkullTile);
// 				isSkull = true;
// 		}
// 		if (contentBmp != null) {
// 			if (isSkull) {
// 				contentBmp.setScale(1.5);
// 				contentBmp.setPosition(16, 16);
// 			} else {
// 				contentBmp.setScale(0.6);
// 				contentBmp.setPosition(4, 4);
// 			}
// 			object.addChild(contentBmp);
// 		}
// 	}
// }
// class EnterSectorCallback {
// 	public final joinSectorResponse:JoinSectorResponse;
// 	public function new(joinSectorResponse:JoinSectorResponse) {
// 		this.joinSectorResponse = joinSectorResponse;
// 	}
// }
// class SceneWorldMap extends Scene {
// 	public final hud:SceneWorldMapHud;
// 	var playerBmp:h2d.Bitmap;
// 	var playerInitialized = false;
// 	var gameWorldInitialized = false;
// 	var allowPlayerMove = false;
// 	public static var AcnhorTile:h2d.Tile;
// 	public static var IslandTile:h2d.Tile;
// 	public static var CommonSkullTile:h2d.Tile;
// 	public static var BlueSkullTile:h2d.Tile;
// 	public static var PinkSkullTile:h2d.Tile;
// 	private var gameWorldSectors = new Array<SectorRectObject>();
// 	private final enterSectorCallback:EnterSectorCallback->Void;
// 	public function new(enterSectorCallback:EnterSectorCallback->Void, mainMenuCallback:Void->Void) {
// 		super();
// 		scaleMode = LetterBox(1920, 1080, false, Left, Center);
// 		SceneWorldMap.AcnhorTile = hxd.Res.anchor.toTile();
// 		SceneWorldMap.IslandTile = hxd.Res.small_palm.toTile();
// 		SceneWorldMap.CommonSkullTile = hxd.Res.common_skull.toTile();
// 		SceneWorldMap.BlueSkullTile = hxd.Res.blue_skull.toTile();
// 		SceneWorldMap.PinkSkullTile = hxd.Res.pink_skull.toTile();
// 		hud = new SceneWorldMapHud(mainMenuCallback);
// 		this.enterSectorCallback = enterSectorCallback;
// 	}
// 	public function getHud() {
// 		return hud;
// 	}
// 	public override function render(e:Engine) {
// 		hud.render(e);
// 		super.render(e);
// 	}
// 	public function start() {
// 		playerInitialized = false;
// 		gameWorldInitialized = false;
// 		allowPlayerMove = false;
// 		gameWorldSectors = new Array<SectorRectObject>();
// 		if (playerBmp != null) {
// 			removeChild(playerBmp);
// 			playerBmp = null;
// 		}
// 		playerInitialized = true;
// 		initOrUpdateGameWorld();
// 	}
// 	private function movePlayer(x:Int, y:Int) {
// 		if (gameWorldInitialized && allowPlayerMove) {
// 			allowPlayerMove = false;
// 			Timer.delay(function resetMoveDelay() {
// 				allowPlayerMove = true;
// 			}, 1000);
// 			Rest.instance.worldMove(Player.instance.playerId, x, y, function callback(result:Bool) {
// 				if (result) {
// 					final pos = sectorPosToWorldCoords(x, y);
// 					playerBmp.setPosition(pos.x - 10, pos.y - 10);
// 					Player.instance.playerData.worldX = x;
// 					Player.instance.playerData.worldY = y;
// 				}
// 			});
// 		}
// 	}
// 	private function checkDistance(x:Int, y:Int) {
// 		final pos = sectorPosToWorldCoords(x, y);
// 		return hxd.Math.distance(pos.x - playerBmp.x, pos.y - playerBmp.y) < SectorSize * 2;
// 	}
// 	private function sectorPosToWorldCoords(sx:Int, sy:Int) {
// 		return {
// 			x: sx * SectorSize + SectorSize + (SectorSize / 2),
// 			y: sy * SectorSize + SectorSize + (SectorSize / 2)
// 		}
// 	}
// 	private function initOrUpdateGameWorld() {
// 		Rest.instance.getWorldInfo(function callback(world:GameWorldData) {
// 			initiateGameWorld(world);
// 		});
// 	}
// 	private function initiateGameWorld(world:GameWorldData) {
// 		for (x in 0...world.size) {
// 			for (y in 0...world.size) {
// 				final posX = x > 0 ? x * SectorSize - 1 : x * SectorSize;
// 				final posY = y > 0 ? y * SectorSize - 1 : y * SectorSize;
// 				var sectorType = GameWorldData.SectorEmptyType;
// 				for (sector in world.sectors) {
// 					if (sector.x == x && sector.y == y) {
// 						sectorType = sector.content;
// 					}
// 				}
// 				final sectorRectObject = new SectorRectObject(this, posX + SectorSize, posY + SectorSize, sectorType);
// 				final interaction = new h2d.Interactive(SectorSize, SectorSize, sectorRectObject.object);
// 				interaction.onClick = function(event:hxd.Event) {
// 					if (Player.instance.playerData.worldX != x || Player.instance.playerData.worldY != y) {
// 						if (checkDistance(x, y)) {
// 							movePlayer(x, y);
// 						}
// 					} else if (Player.instance.playerData.worldX == x && Player.instance.playerData.worldY == y) {
// 						enterSector(x, y);
// 					}
// 				}
// 				gameWorldSectors.push(sectorRectObject);
// 			}
// 		}
// 		gameWorldInitialized = true;
// 		allowPlayerMove = true;
// 		final playerTile = Tile.fromColor(0x863D0D, 20, 20);
// 		playerBmp = new Bitmap(playerTile);
// 		final pos = sectorPosToWorldCoords(Player.instance.playerData.worldX, Player.instance.playerData.worldY);
// 		playerBmp.setPosition(pos.x - 10, pos.y - 10);
// 		addChild(playerBmp);
// 	}
// 	private function enterSector(x:Int, y:Int) {
// 		if (gameWorldInitialized) {
// 			Rest.instance.worldEnter(Player.instance.playerId, x, y, function callback(response:JoinSectorResponse) {
// 				if (response.result) {
// 					if (enterSectorCallback != null) {
// 						enterSectorCallback(new EnterSectorCallback(response));
// 					}
// 				}
// 			});
// 		}
// 	}
// }
