package client.scene;

import js.moralis.Moralis;
import js.lib.Map;
import h2d.Scene;

class SceneMoralis extends Scene {
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

		gui.addButton("Moralis login", function() {
			final user = Moralis.User.current();
			if (user == null) {
				Moralis.authenticate({signingMessage: "Log in using Moralis"}).then(function(user:Map<String, String>) {
					trace("Logged in! Eth address:");
					trace(user.get('ethAddress'));
				}).catchError(function(e:Dynamic) {
					trace("Auth error");
				});
			} else {
				trace("Already logged in !");
				trace(user.get('ethAddress'));
			}
		}).setScale(4);
	}
}
