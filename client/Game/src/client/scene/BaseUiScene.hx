package client.scene;

import haxe.ui.core.Screen;
import haxe.ui.Toolkit;
import haxe.ui.ComponentBuilder;
import h2d.Scene;

class BaseUiScene extends Scene {
	public function new() {
		super();

		var x = ComponentBuilder.fromFile("res/main-view.xml");
		Toolkit.init({root: this, manualUpdate: false});
		Screen.instance.addComponent(x);
	}
}
