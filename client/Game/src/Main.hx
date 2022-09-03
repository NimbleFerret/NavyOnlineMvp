import client.network.RestProtocol.GameWorldData;
import client.scene.SceneMoralis;
import client.scene.SceneGlobalMode;
import client.scene.SceneIsland;
import client.GuiApp;
import client.scene.SceneShipsDemo;
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
	SceneShipsDemo;
	SceneIsland;
	SceneGlobalMode;
	SceneMoralis;
}

class Main extends GuiApp {
	private var sceneMain:SceneMain;
	private var sceneDemo1:SceneDemo1;
	// private var sceneUIDemo:SceneUIDemo;
	private var sceneShipsDemo:SceneShipsDemo;
	private var sceneOnlineDemo1:SceneOnlineDemo1;

	private var sceneIsland:SceneIsland;
	private var sceneGlobalMode:SceneGlobalMode;

	private var sceneMoralis:SceneMoralis;

	private final defaultScene = Scene.SceneGlobalMode;
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
		sceneMoralis = new SceneMoralis();

		sceneOnlineDemo1 = new SceneOnlineDemo1(engine.width, engine.height, function leaveCallback() {
			currentScene = SceneGlobalMode;
			sceneGlobalMode.init();
			setScene2D(sceneGlobalMode);
		});

		// sceneUIDemo = new SceneUIDemo();

		sceneShipsDemo = new SceneShipsDemo();
		sceneIsland = new SceneIsland(engine.width, engine.height, function leaveCallback() {
			trace('Leave island');
		});

		//

		sceneGlobalMode = new SceneGlobalMode(function callback(sector:EnterSectorCallback) {
			if (sector.joinSectorResponse.sectorType == GameWorldData.SectorIslandType) {
				currentScene = SceneIsland;

				sceneIsland.instanceId = sector.joinSectorResponse.instanceId;
				sceneIsland.start();
				// sevents.addScene(sceneIsland.getHud());
				setScene2D(sceneIsland);
			} else {
				currentScene = SceneOnlineDemo1;

				sceneOnlineDemo1.instanceId = sector.joinSectorResponse.instanceId;
				sceneOnlineDemo1.start();
				sevents.addScene(sceneOnlineDemo1.getHud());
				setScene2D(sceneOnlineDemo1);
			}
		});

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
			case SceneShipsDemo:
				setScene2D(sceneShipsDemo);
			case SceneIsland:
				setScene2D(sceneIsland);
			case SceneGlobalMode:
				setScene2D(sceneGlobalMode);
			case SceneMoralis:
				setScene2D(sceneMoralis);
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

		if (currentScene == SceneShipsDemo) {
			sceneShipsDemo.update();
		}
		if (currentScene == SceneIsland) {
			sceneIsland.update(dt);
		}
	}

	override function onResize() {
		if (currentScene == SceneOnlineDemo1) {
			sceneOnlineDemo1.onResize();
		}
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
