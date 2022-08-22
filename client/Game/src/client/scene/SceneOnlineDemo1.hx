package client.scene;

import client.network.Socket;
import h2d.Scene;

class SceneOnlineDemo1 extends Scene {
	private final fui:h2d.Flow;
	private final gui:Gui;

	public function new() {
		super();

		fui = new h2d.Flow(this);
		fui.layout = Vertical;
		fui.verticalSpacing = 5;
		fui.padding = 10;
		fui.y = 10;

		gui = new Gui(fui);

		gui.addButton("Connect socket", function() {
			trace("Socket connect");

			Socket.instance.joinGame("0x0...0");
		});
	}
}
