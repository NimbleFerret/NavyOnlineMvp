import client.network.RestProtocol.JoinSectorResponse;
import client.network.RestProtocol.GameWorldData;
import client.scene.SceneGlobalMode;
import client.scene.SceneIsland;
import client.scene.SceneShipsDemo;
import client.scene.SceneMain;
import client.scene.SceneDemo1;
import client.scene.SceneOnlineDemo1;
import client.GuiApp;

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
}

class Main extends GuiApp {
	private var sceneMain:SceneMain;
	private var sceneDemo1:SceneDemo1;
	private var sceneShipsDemo:SceneShipsDemo;
	private var sceneOnlineDemo1:SceneOnlineDemo1;
	private var sceneIsland:SceneIsland;
	private var sceneGlobalMode:SceneGlobalMode;

	private final defaultScene = Scene.SceneMain;
	private var currentScene:Scene;
	private var lastAddedIteractiveScene:hxd.SceneEvents.InteractiveScene;

	public static var ScreenWidth:Int = 1920;
	public static var ScreenHeight:Int = 1080;

	public static var IsWeb3Available = false;

	override function init() {
		super.init();

		engine.backgroundColor = 0xFCDCA1;

		sceneMain = new SceneMain(function startCallback() {
			initGlobalMode();
		});

		lastAddedIteractiveScene = sceneMain.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		sceneDemo1 = new SceneDemo1(engine.width, engine.height);

		sceneShipsDemo = new SceneShipsDemo();
		sceneIsland = new SceneIsland(engine.width, engine.height, function leaveCallback() {});

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
				setScene2D(sceneOnlineDemo1);
			case SceneShipsDemo:
				setScene2D(sceneShipsDemo);
			case SceneIsland:
				final response = new JoinSectorResponse(true, null, 0, 'instance', 1, 'islandId', '0x87400A03678dd03c8BF536404B5B14C609a23b79', 'Green', true);
				sceneIsland.start(response);
				sevents.addScene(sceneIsland.getHud());
				setScene2D(sceneIsland);
			case SceneGlobalMode:
				setScene2D(sceneGlobalMode);
		}

		currentScene = defaultScene;
	}

	private function initOnlineScene(instanceId:String) {
		currentScene = SceneOnlineDemo1;

		sceneOnlineDemo1 = new SceneOnlineDemo1(function leaveCallback() {
			currentScene = SceneGlobalMode;
			sceneGlobalMode.start();

			sevents.removeScene(lastAddedIteractiveScene);
			lastAddedIteractiveScene = sceneGlobalMode.getHud();
			sevents.addScene(lastAddedIteractiveScene);

			setScene2D(sceneGlobalMode);
		}, function diedCallback() {
			currentScene = SceneMain;
			sceneMain.start();
			setScene2D(sceneMain);
		});

		sceneOnlineDemo1.instanceId = instanceId;
		sceneOnlineDemo1.start();

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneOnlineDemo1.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		setScene2D(sceneOnlineDemo1);
	}

	private function initGlobalMode() {
		currentScene = SceneGlobalMode;

		sceneGlobalMode = new SceneGlobalMode(function callback(sector:EnterSectorCallback) {
			if (sector.joinSectorResponse.sectorType == GameWorldData.SectorIslandType) {
				currentScene = SceneIsland;

				sceneIsland.instanceId = sector.joinSectorResponse.instanceId;
				sceneIsland.start(sector.joinSectorResponse);

				sevents.removeScene(lastAddedIteractiveScene);
				lastAddedIteractiveScene = sceneIsland.getHud();
				sevents.addScene(lastAddedIteractiveScene);

				setScene2D(sceneIsland);
			} else {
				initOnlineScene(sector.joinSectorResponse.instanceId);
			}
		}, function mainMenuCallback() {
			currentScene = SceneMain;
			sceneMain.start();

			sevents.removeScene(lastAddedIteractiveScene);
			lastAddedIteractiveScene = sceneMain.getHud();
			sevents.addScene(lastAddedIteractiveScene);

			setScene2D(sceneMain);
		});

		sevents.removeScene(lastAddedIteractiveScene);
		lastAddedIteractiveScene = sceneGlobalMode.getHud();
		sevents.addScene(lastAddedIteractiveScene);

		sceneGlobalMode.start();

		setScene2D(sceneGlobalMode);
	}

	override function update(dt:Float) {
		if (currentScene == SceneOnlineDemo1) {
			sceneOnlineDemo1.update(dt, engine.fps);
		}
		if (currentScene == SceneShipsDemo) {
			sceneShipsDemo.update();
		}
		if (currentScene == SceneIsland) {
			sceneIsland.update(dt, engine.fps);
		}
		if (currentScene == SceneDemo1) {
			sceneDemo1.update(dt, engine.fps);
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
