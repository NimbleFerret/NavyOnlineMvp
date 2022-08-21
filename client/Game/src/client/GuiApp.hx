package client;

class GuiApp extends hxd.App {
	function drawRect(x, y, w, h, c) {
		var customGraphics = new h2d.Graphics(s2d);

		customGraphics.beginFill(c);
		customGraphics.drawRect(x, y, w, h);
		customGraphics.endFill();
	}
}
