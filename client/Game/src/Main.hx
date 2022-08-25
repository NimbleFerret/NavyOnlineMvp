import client.GuiApp;
import client.scene.SceneMain;
import client.scene.SceneDemo1;
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
	private var sceneOnlineDemo1:SceneOnlineDemo1;

	private final defaultScene = Scene.SceneDemo1;
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
		sevents.addScene(sceneDemo1.getHud());

		sceneOnlineDemo1 = new SceneOnlineDemo1(engine.width, engine.height);
		sevents.addScene(sceneOnlineDemo1.getHud());

		switch (defaultScene) {
			case SceneMain:
				setScene2D(sceneMain);
			case SceneDemo1:
				setScene2D(sceneDemo1);
			case SceneOnlineDemo1:
				setScene2D(sceneOnlineDemo1);
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
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
