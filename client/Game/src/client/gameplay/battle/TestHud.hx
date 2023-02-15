package client.gameplay.battle;

import client.gameplay.BaiscHud.BasicHud;

class TestHud extends BasicHud {
	public function new() {
		super(500, 10);

		addText("Test Test 123");

		addCheck('Show water', function() return GameConfig.ShowWaterBackground, function(v) {
			GameConfig.ShowWaterBackground = v;
			trace(GameConfig.ShowWaterBackground);
		});
	}
}
