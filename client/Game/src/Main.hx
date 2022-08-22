import client.GuiApp;
import client.scene.SceneDemo1;
import client.scene.SceneMain;
import h3d.Engine;

// import hxd.Math;

interface Updatable {
	public function update(dt:Float):Void;
}

class Main extends GuiApp {
	private var sceneMain:SceneMain;
	private var sceneDemo1:SceneDemo1;

	override function init() {
		super.init();

		engine.backgroundColor = 0x6BC2EE;

		sceneMain = new SceneMain(function loadLevel1() {
			setScene2D(sceneDemo1);
		}, function loadLevel2() {});

		sceneDemo1 = new SceneDemo1(engine.width, engine.height);

		setScene2D(sceneMain);

		// s2d.camera.setViewport(engine.width / 2, engine.height / 2, 0, 0);

		// hud = new Hud();
		// sevents.addScene(hud);

		// hud.addChoice("Debug1211", ["Off", "On"], function(i) {
		// 	switch (i) {
		// 		case 0:
		// 			Main.DebugDraw = false;
		// 		case 1:
		// 			Main.DebugDraw = true;
		// 	}
		// });

		// hud.addChoice("Input", ["Game", "Camera", "Player"], function(i) {
		// 	switch (i) {
		// 		case 0:
		// 			inputType = InputType.Game;
		// 		case 1:
		// 			inputType = InputType.DebugCamera;
		// 		case 2:
		// 			inputType = InputType.DebugPlayerShip;
		// 	}
		// });
	}

	// override function render(e:Engine) {
	// 	// hud.render(e);
	// 	// s2d.render(e);
	// 	// debugDraw();
	// }

	override function update(dt:Float) {}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
