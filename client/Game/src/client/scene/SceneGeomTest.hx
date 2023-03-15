// package client.scene;
// import h2d.col.Point;
// import h2d.Scene;
// import hxd.Window;
// import utils.Utils;
// import game.engine.base.MathUtils;
// import game.engine.base.geometry.Rectangle;
// import game.engine.base.geometry.Line;
// class SceneGeomTest extends Scene {
// 	public var debugGraphics:h2d.Graphics;
// 	// Two rect collides with each other
// 	private final rect1 = new Rectangle(200, 200, 300, 300, 0);
// 	private final rect2 = new Rectangle(200, 550, 300, 300, 0);
// 	// Rect to collide with mouse
// 	private final mouseRect = new Rectangle(1100, 400, 300, 500, 0);
// 	public function new(width:Int, height:Int) {
// 		super();
// 		camera.setScale(2, 2);
// 		debugGraphics = new h2d.Graphics(this);
// 	}
// 	public function start() {}
// 	public function update(dt:Float, fps:Float) {
// 		debugGraphics.clear();
// 		// ------------------------------------------
// 		// Two rect collide test
// 		// ------------------------------------------
// 		rect2.r += MathUtils.degreeToRads(0.1);
// 		var collideRectColor = GameConfig.GreenColor;
// 		if (rect1.intersectsWithRect(rect2)) {
// 			collideRectColor = GameConfig.RedColor;
// 		}
// 		Utils.DrawRect(debugGraphics, rect1, collideRectColor);
// 		Utils.DrawRect(debugGraphics, rect2, collideRectColor);
// 		// ------------------------------------------
// 		// Mouse cursor and rect collide test
// 		// ------------------------------------------
// 		mouseRect.r += MathUtils.degreeToRads(0.1);
// 		final mousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
// 		final mouseToCameraPos = new Point(mousePos.x, mousePos.y);
// 		camera.sceneToCamera(mouseToCameraPos);
// 		final cursorToMouseRectLine = new Line(mouseToCameraPos.x, mouseToCameraPos.y, mouseRect.x, mouseRect.y);
// 		var mouseRectColor = GameConfig.YellowColor;
// 		if (mouseRect.getLines().lineB.intersectsWithLine(cursorToMouseRectLine)
// 			|| mouseRect.getLines().lineD.intersectsWithLine(cursorToMouseRectLine)) {
// 			mouseRectColor = GameConfig.RedColor;
// 		}
// 		Utils.DrawRect(debugGraphics, mouseRect, mouseRectColor);
// 		debugGraphics.lineStyle(3, GameConfig.YellowColor);
// 		debugGraphics.moveTo(cursorToMouseRectLine.x1, cursorToMouseRectLine.y1);
// 		debugGraphics.lineTo(cursorToMouseRectLine.x2, cursorToMouseRectLine.y2);
// 	}
// }
