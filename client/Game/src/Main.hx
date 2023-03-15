import client.scene.base.BasicScene;
import client.scene.SceneManager;

class Main extends hxd.App {
	private var lastAddedIteractiveScene:hxd.SceneEvents.InteractiveScene;

	public static var ScreenWidth:Int = 1920;
	public static var ScreenHeight:Int = 1080;
	public static var IsWeb3Available = false;

	private var sceneManager:SceneManager;

	override function init() {
		super.init();

		engine.backgroundColor = 0xFCDCA1;

		this.sceneManager = new SceneManager(function callback(scene:BasicScene) {
			setScene2D(scene);
			sevents.addScene(scene.getInputScene());
		});
	}

	private function changeScene() {
		setScene2D(sceneManager.getCurrentScene());
	}

	override function update(dt:Float) {
		sceneManager.getCurrentScene().update(dt, engine.fps);
	}

	override function onResize() {
		// if (currentScene == SceneOnlineDemo1) {
		// 	sceneOnlineDemo1.onResize();
		// }
	}

	static function main() {
		hxd.Res.initEmbed();
		new Main();
	}
}
