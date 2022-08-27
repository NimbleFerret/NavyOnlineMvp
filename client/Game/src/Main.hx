import client.GuiApp;
import client.scene.SceneMain;
import client.scene.SceneDemo1;
// import client.scene.SceneUIDemo;
import client.scene.SceneOnlineDemo1;

interface Updatable {
	public function update(dt:Float):Void;
}

enum Scene {
	SceneMain;
	SceneDemo1;
	SceneOnlineDemo1;
}

class Main extends GuiApp {
	private var sceneMain:SceneMain;
	private var sceneDemo1:SceneDemo1;
	// private var sceneUIDemo:SceneUIDemo;
	private var sceneOnlineDemo1:SceneOnlineDemo1;

	private final defaultScene = Scene.SceneOnlineDemo1;
	private var currentScene:Scene;

	override function init() {
		super.init();

		engine.backgroundColor = 0x6BC2EE;

		sceneMain = new SceneMain(function loadLevel1() {
			setScene2D(sceneDemo1);
		}, function loadLevel2() {
			setScene2D(sceneOnlineDemo1);
		});

		sceneDemo1 = new SceneDemo1(engine.width, engine.height);

		sceneOnlineDemo1 = new SceneOnlineDemo1(engine.width, engine.height);

		// sceneUIDemo = new SceneUIDemo();

		// TODO refactor scene load and unload
		switch (defaultScene) {
			case SceneMain:
				sceneMain.start();
				setScene2D(sceneMain);
			case SceneDemo1:
				sceneDemo1.start();
				sevents.addScene(sceneDemo1.getHud());
				setScene2D(sceneDemo1);
			case SceneOnlineDemo1:
				sceneOnlineDemo1.start();
				sevents.addScene(sceneOnlineDemo1.getHud());
				setScene2D(sceneOnlineDemo1);
				// case SceneUIDemo:
				// 	sceneUIDemo.start();
				// 	setScene2D(sceneUIDemo);
		}

		currentScene = defaultScene;
	}

	override function update(dt:Float) {
		if (currentScene == SceneDemo1) {
			sceneDemo1.update(dt, engine.fps);
		}
		if (currentScene == SceneOnlineDemo1) {
			sceneOnlineDemo1.update(dt, engine.fps);
		}
		// if (currentScene == SceneUIDemo) {
		// 	sceneUIDemo.update();
		// }
	}

	override function onResize() {
		// if (currentScene == SceneUIDemo) {
		// 	sceneUIDemo.onResize();
		// }
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
