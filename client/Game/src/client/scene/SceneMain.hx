package client.scene;

import h2d.Scene;

class SceneMain extends Scene {
	private final fui:h2d.Flow;
	private final gui:Gui;

	public function new(level1Callback:Void->Void, level2Callback:Void->Void) {
		super();

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

		gui = new Gui(fui);

		gui.addButton("Load level 1", function() {
			level1Callback();
		});

		gui.addButton("Load level 2", function() {
			level2Callback();
		});
	}
}
