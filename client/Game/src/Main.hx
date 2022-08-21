import client.GuiApp;
import client.Hud;
import h3d.Engine;

class Main extends GuiApp {
	public static var DebugDraw = true;

	var hud:Hud;

	override function init() {
		super.init();

		engine.backgroundColor = 0x6BC2EE;

		s2d.camera.setViewport(engine.width / 2, engine.height / 2, 0, 0);

		hud = new Hud();
		sevents.addScene(hud);

		hud.addButton("Socket connect", function() {
			// Socket.instance.joinGame("0x0...0");
		});
	}

	override function render(e:Engine) {
		hud.render(e);
		s2d.render(e);
	}

	override function update(dt:Float) {}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
