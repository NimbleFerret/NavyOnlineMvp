package client.gameplay.world;

import h2d.Bitmap;
import h2d.Tile;
import h2d.Scene;
import h2d.col.Point;
import hxd.Key in K;
import hxd.Window;

using tweenxcore.Tools;

final SectorSize = 100;
final GameWorldSize = 500;

enum SectorContent {
	Empty;
	Island1;
	Island2;
	Island3;
	Island4;
	Island5;
}

class SectorRectObject {
	public final object:h2d.Object;

	private final contentBmp:Bitmap;

	public function new(parent:h2d.Object, x:Float, y:Float, sectorType:SectorContent) {
		object = new h2d.Object(parent);

		final contentTile = Tile.fromColor(sectorType == SectorContent.Empty ? 0x0D5886 : 0xEDED59, SectorSize, SectorSize);
		contentBmp = new Bitmap(contentTile, object);

		final borderRect = new h2d.Graphics(object);
		borderRect.lineStyle(3, 0xC79161);
		borderRect.drawRect(0, 0, SectorSize, SectorSize);
		borderRect.endFill();

		object.setPosition(x, y);
	}

	public function changeContent(sectorType:SectorContent) {
		final contentTile = Tile.fromColor(sectorType == SectorContent.Empty ? 0x0D5886 : 0xEDED59, SectorSize, SectorSize);
		contentBmp.tile = contentTile;
	}
}

class SectorsContainer {
	public final object:h2d.Object;

	private final sectorsMap = new Map<String, SectorRectObject>();

	public function new(scene:Scene) {
		object = new h2d.Object(scene);
	}

	public function addSector(worldCoords:Point, sectorCoords:Point, sectorContent:SectorContent) {
		final sector = new SectorRectObject(object, worldCoords.x, worldCoords.y, sectorContent);
		sectorsMap.set(sectorCoords.x + '_' + sectorCoords.y, sector);
	}

	public function updateSectorContent(sectorCoords:Point, sectorContent:SectorContent) {
		sectorsMap.get(sectorCoords.x + '_' + sectorCoords.y).changeContent(sectorContent);
	}
}

class GameWorldGameplay {
	private final scene:Scene;
	private final minCameraOffsetX = 950;
	private final minCameraOffsetY = 525;

	private final playerSize = 50;
	private final player:Bitmap;
	private final totalFrames = 2 * 60;
	private var movementFrameCount = 0;
	private var cameraFrameCount = 0;
	private var playerMoving = false;
	private var moveCamera = false;

	private var currentSector = new Point(1, 1);
	private var playerNewPos:Point;
	private var playerLastPos:Point;
	private var sectorsMoved = new Point(0, 0);

	// private final arr2d:Array<Array<SectorRectObject>> = [for (i in 0...20) []];
	// private final mapData:Array<Array<SectorContent>> = [for (i in 0...GameWorldSize) []];
	public static final GeoData = new Map<String, SectorContent>();

	// private final sectorsContainer:SectorsContainer;
	private final sectorManager:SectorManager;

	public function new(scene:Scene) {
		this.scene = scene;

		// sectorsContainer = new SectorsContainer(scene);

		for (y in 0...GameWorldSize) {
			for (x in 0...GameWorldSize) {
				final key = x + '_' + y;
				GeoData.set(key, SectorContent.Empty);
			}
		}

		// Horizontal
		for (i in 0...20) {
			final key1 = 19 + '_' + i;
			GeoData.set(key1, SectorContent.Island1);

			final key2 = 39 + '_' + i;
			GeoData.set(key2, SectorContent.Island2);

			final key3 = 59 + '_' + i;
			GeoData.set(key3, SectorContent.Island3);

			final key4 = 79 + '_' + i;
			GeoData.set(key4, SectorContent.Island4);

			final key5 = 99 + '_' + i;
			GeoData.set(key5, SectorContent.Island5);

			final key5 = 119 + '_' + i;
			GeoData.set(key5, SectorContent.Island1);

			final key5 = 139 + '_' + i;
			GeoData.set(key5, SectorContent.Island2);
		}

		// Vertical
		for (i in 0...20) {
			final key1 = i + '_' + 19;
			GeoData.set(key1, SectorContent.Island1);

			final key2 = i + '_' + 39;
			GeoData.set(key2, SectorContent.Island2);

			final key3 = i + '_' + 59;
			GeoData.set(key3, SectorContent.Island3);

			final key4 = i + '_' + 79;
			GeoData.set(key4, SectorContent.Island4);

			final key5 = i + '_' + 99;
			GeoData.set(key5, SectorContent.Island5);

			final key5 = i + '_' + 119;
			GeoData.set(key5, SectorContent.Island1);

			final key5 = i + '_' + 139;
			GeoData.set(key5, SectorContent.Island2);
		}

		// // Начинаем в левом верхнем углу
		// for (y in 1...10) {
		// 	for (x in 1...40) {
		// 		final sectorPos = sectorPosToWorldCoords(x, y);
		// 		// final sectorRect = new SectorRectObject(scene, sectorPos.x, sectorPos.y, mapData[x][y]);
		// 		sectorsContainer.addSector(sectorPos, new Point(x, y), mapData[x][y]);

		// 		// arr2d[y - 1].push(sectorRect);
		// 	}
		// }

		sectorManager = new SectorManager(scene, currentSector);

		final playerTile = Tile.fromColor(0x863D0D, playerSize, playerSize);
		player = new Bitmap(playerTile);
		scene.add(player);

		playerNewPos = SectorPosToWorldCoords(currentSector.x, currentSector.y);
		playerNewPos.x += playerSize / 2;
		playerNewPos.y += playerSize / 2;
		playerLastPos = playerNewPos;

		// sectorManager.setPlayerPos(currentSector);

		player.setPosition(playerNewPos.x, playerNewPos.y);
	}

	public function update() {
		if (K.isPressed(hxd.Key.MOUSE_LEFT) && !playerMoving) {
			final mousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			final mouseToCameraPos = new Point(mousePos.x, mousePos.y);
			scene.camera.sceneToCamera(mouseToCameraPos);
			final projectedMousePos = WorldCoordsToSectorPos(mouseToCameraPos.x, mouseToCameraPos.y);

			currentSector.set(projectedMousePos.x, projectedMousePos.y);

			playerNewPos = SectorPosToWorldCoords(projectedMousePos.x, projectedMousePos.y);
			playerNewPos.x += playerSize / 2;
			playerNewPos.y += playerSize / 2;

			playerLastPos.set(player.x, player.y);

			playerMoving = true;

			// currentSector is the center.

			// for (y in 1...3) {
			// 	for (x in 1...20) {
			// 		final sectorPos = sectorPosToWorldCoords(x, y);

			// 		final sectorRect = new SectorRectObject(scene, sectorPos.x, sectorPos.y, mapData[x][y]);

			// 		arr2d[x][y]
			// 	}
			// }
		}

		if (playerMoving) {
			// if (playerNewPos.distance(playerLastPos) <= 5) {
			// 	playerMoving = false;
			// 	moveCamera = true;
			// 	movementFrameCount = 0;
			// }
			final rate = movementFrameCount / totalFrames;
			if (rate <= 1) {
				player.x = rate.quintOut().lerp(playerLastPos.x, playerNewPos.x);
				player.y = rate.quintOut().lerp(playerLastPos.y, playerNewPos.y);
				movementFrameCount++;
			} else {
				playerLastPos = playerNewPos;
				sectorManager.playerMoved(currentSector);

				playerMoving = false;
				moveCamera = true;
				movementFrameCount = 0;

				sectorsMoved.x = Math.abs(currentSector.x - sectorsMoved.x);
				sectorsMoved.y = Math.abs(currentSector.y - sectorsMoved.y);
			}
		}

		// final camera = this.scene.camera;
		// final distanceBetweenCameraAndPlayer = new Point(camera.x, camera.y).distance(playerLastPos);

		final camera = this.scene.camera;

		if (moveCamera) {
			// trace(currentSector);

			// moveCamera = false;
			// if player at the middle of the screen
			// if (player.x)

			// if (new Point(camera.x, camera.y).distance(playerLastPos) <= 5) {
			// 	moveCamera = false;
			// 	frameCount = 0;
			// }

			final rate = cameraFrameCount / totalFrames;
			if (rate <= 1) {
				camera.x = rate.quintOut().lerp(camera.x, playerLastPos.x);
				camera.y = rate.quintOut().lerp(camera.y, playerLastPos.y);
				cameraFrameCount++;
			} else {
				moveCamera = false;
				cameraFrameCount = 0;

				sectorsMoved.set(currentSector.x, currentSector.y);

				// 	if (currentSector.x > 20) {
				// 		trace('Not on left border');
				// 	} else {
				// 		trace('On left border');
				// 	}

				// for (y in 1...10) {
				// 	for (x in 1...20) {
				// 		// final sectorPos = sectorPosToWorldCoords(playerNewPos.x - x, playerNewPos.x - y);
				// 		final castedX = Std.int(currentSector.x - x);
				// 		final castedY = Std.int(currentSector.y - y);

				// 		trace('Move sectors');
				// 		trace(x, y, castedX, castedY);

				// 		// final sectorRect = new SectorRectObject(scene, sectorPos.x, sectorPos.y, mapData[x][y]);
				// 		sectorsContainer.updateSectorContent(new Point(x, y), mapData[castedX][castedY]);

				// 		// arr2d[y - 1].push(sectorRect);
			}
		}
		// }
		// }

		if (camera.x < minCameraOffsetX) {
			camera.x += minCameraOffsetX - camera.x;
		}
		if (camera.y < minCameraOffsetY) {
			camera.y += minCameraOffsetY - camera.y;
		}
		// camera.x = player.x;
		// camera.y = player.y;
	}

	public static function SectorPosToWorldCoords(sx:Float, sy:Float) {
		final halfSectorSize = SectorSize;
		return new Point(Std.int(sx) * SectorSize - halfSectorSize, Std.int(sy) * SectorSize - halfSectorSize);
	}

	public static function WorldCoordsToSectorPos(x:Float, y:Float) {
		return {
			x: Math.ceil(x / SectorSize),
			y: Math.ceil(y / SectorSize)
		}
	}
}
