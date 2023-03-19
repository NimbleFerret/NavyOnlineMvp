package client.scene.impl;

import h3d.Engine;
import client.gameplay.world.GameWorldGameplay;
import client.network.RestProtocol.JoinSectorResponse;
import client.scene.base.BasicScene;
import h2d.Bitmap;
import h2d.Tile;
import h2d.col.Point;
import utils.Utils;

// TODO MOVE TO SINGLE PLACE
final SectorSize = 100;
final SectorGroupSize = 20;
final GameWorldSize = 500;

// class SceneGameWorldGrid extends h2d.Scene {
// 	public function new() {
// 		super();
// 		camera.setScale(2, 2);
// 		final borderRect = new h2d.Graphics(this);
// 		var x = 10, y = 15;
// 		for (i in 0...SectorGroupSize) {
// 			for (j in 0...SectorGroupSize) {
// 				borderRect.lineStyle(3, 0xC79161);
// 				borderRect.drawRect(x, y, 100, 100);
// 				borderRect.endFill();
// 				x += 100;
// 			}
// 			x = 10;
// 			y += 100;
// 		}
// 	}
// }

class SceneGameWorld extends BasicScene {
	// private final playerSize = 50;
	// private final sectorSize = 100;
	// private final gameWorldSize = 5000;
	// private final minCameraOffsetX = 945;
	// private final minCameraOffsetY = 525;
	// private final debugGraphics:h2d.Graphics;
	private final gameWorldGameplay:GameWorldGameplay;

	// private final gridScene:SceneGameWorldGrid;

	public function new() {
		super();
		camera.setViewport(1920, 1080, 0, 0);
		camera.setScale(2, 2);

		gameWorldGameplay = new GameWorldGameplay(this);

		// gridScene = new SceneGameWorldGrid();

		// debugGraphics = new h2d.Graphics();
		// add(debugGraphics, 0);

		// final iterations = Std.int(gameWorldSize / sectorSize);
		// for (y in 0...iterations) {
		// 	Utils.DrawLine(debugGraphics, new Point(0, y * sectorSize), new Point(gameWorldSize, y * sectorSize), GameConfig.RedColor);
		// 	for (x in 0...iterations) {
		// 		Utils.DrawLine(debugGraphics, new Point(x * sectorSize, 0), new Point(x * sectorSize, gameWorldSize), GameConfig.RedColor);
		// 	}
		// }

		// playerNewPos = sectorPosToWorldCoords(currentSector.x, currentSector.y);
		// playerLastPos = playerNewPos;

		// player.setPosition(playerNewPos.x, playerNewPos.y);

		// final interaction = new h2d.Interactive(gameWorldSize, gameWorldSize, debugGraphics);
		// interaction.onClick = function(event:hxd.Event) {
		// 	final newPos = worldCoordsToSectorPos(event.relX, event.relY);
		// 	if (currentSector.x != newPos.x || currentSector.y != newPos.y) {
		// 		currentSector.set(newPos.x, newPos.y);

		// 		playerNewPos = sectorPosToWorldCoords(newPos.x, newPos.y);
		// 		playerLastPos.set(player.x, player.y);

		// 		frameCount = 0;

		// 		playerMoving = true;

		// 		trace(camera.x, camera.y);
		// 	}
		// };
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public function start(?joinSectorResponse:JoinSectorResponse) {}

	public function update(dt:Float, fps:Float) {
		final c = camera;
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_UP)) {
			c.scale(1.25, 1.25);
			// gridScene.camera.scale(1.25, 1.25);
		}
		if (hxd.Key.isPressed(hxd.Key.MOUSE_WHEEL_DOWN)) {
			c.scale(0.8, 0.8);
			// gridScene.camera.scale(0.8, 0.8);
		}

		gameWorldGameplay.update();

		// if (playerMoving) {
		// 	if (playerNewPos.distance(playerLastPos) <= 5) {
		// 		playerMoving = false;
		// 		moveCamera = true;
		// 		frameCount = 0;
		// 	}
		// 	final rate = frameCount / totalFrames;
		// 	if (rate <= 1) {
		// 		player.x = rate.quintOut().lerp(playerLastPos.x, playerNewPos.x);
		// 		player.y = rate.quintOut().lerp(playerLastPos.y, playerNewPos.y);
		// 	} else {
		// 		playerLastPos = playerNewPos;
		// 	}
		// 	frameCount++;
		// }

		// if (moveCamera) {
		// 	if (new Point(camera.x, camera.y).distance(playerLastPos) <= 5) {
		// 		moveCamera = false;
		// 		frameCount = 0;
		// 	}
		// 	final rate = frameCount / totalFrames;
		// 	if (rate <= 1) {
		// 		camera.x = rate.quintOut().lerp(camera.x, playerLastPos.x);
		// 		camera.y = rate.quintOut().lerp(camera.y, playerLastPos.y);
		// 	}
		// 	frameCount++;
		// }

		// if (camera.x < minCameraOffsetX) {
		// 	camera.x += minCameraOffsetX - camera.x;
		// }
		// if (camera.y < minCameraOffsetY) {
		// 	camera.y += minCameraOffsetY - camera.y;
		// }
	}

	public function getInputScene() {
		return this;
	}

	// --------------------------------------
	// General
	// --------------------------------------
	// public override function render(e:Engine) {
	// 	super.render(e);
	// 	// gridScene.render(e);
	// }
}
