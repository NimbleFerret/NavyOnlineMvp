package client.scene.impl;

import client.network.RestProtocol.JoinSectorResponse;
import client.scene.base.BasicScene;
import game.engine.base.MathUtils;
import game.engine.base.geometry.Rectangle;
import game.engine.base.geometry.Line;
import h2d.col.Point;
import hxd.Window;
import utils.Utils;

class SceneGeomTest extends BasicScene {
	public var debugGraphics:h2d.Graphics;

	// Two rect collides with each other
	private final rect1 = new Rectangle(200, 200, 300, 300, 0);
	private final rect2 = new Rectangle(200, 550, 300, 300, 0);
	// Rect to collide with mouse
	private final mouseRect = new Rectangle(1100, 400, 300, 500, 0);

	public function new() {
		super();
		camera.setScale(2, 2);
		debugGraphics = new h2d.Graphics(this);
	}

	// --------------------------------------
	// Impl
	// --------------------------------------

	public function start(?joinSectorResponse:JoinSectorResponse) {}

	public function update(dt:Float, fps:Float) {
		debugGraphics.clear();
		// ------------------------------------------
		// Two rect collide test
		// ------------------------------------------
		rect2.r += MathUtils.degreeToRads(0.1);
		var collideRectColor = GameConfig.GreenColor;
		if (rect1.intersectsWithRect(rect2)) {
			collideRectColor = GameConfig.RedColor;
		}
		Utils.DrawRect(debugGraphics, rect1, collideRectColor);
		Utils.DrawRect(debugGraphics, rect2, collideRectColor);
		// ------------------------------------------
		// Mouse cursor and rect collide test
		// ------------------------------------------
		mouseRect.r += MathUtils.degreeToRads(0.1);
		final mousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
		final mouseToCameraPos = new Point(mousePos.x, mousePos.y);
		camera.sceneToCamera(mouseToCameraPos);
		final cursorToMouseRectLine = new Line(mouseToCameraPos.x, mouseToCameraPos.y, mouseRect.x, mouseRect.y);
		var mouseRectColor = GameConfig.YellowColor;
		if (mouseRect.getLines().lineB.intersectsWithLine(cursorToMouseRectLine)
			|| mouseRect.getLines().lineD.intersectsWithLine(cursorToMouseRectLine)) {
			mouseRectColor = GameConfig.RedColor;
		}
		Utils.DrawRect(debugGraphics, mouseRect, mouseRectColor);
		debugGraphics.lineStyle(3, GameConfig.YellowColor);
		debugGraphics.moveTo(cursorToMouseRectLine.x1, cursorToMouseRectLine.y1);
		debugGraphics.lineTo(cursorToMouseRectLine.x2, cursorToMouseRectLine.y2);
	}

	public function getInputScene() {
		return this;
	}
}
