package client.gameplay.battle;

import client.gameplay.BaiscHud.BasicHud;

class DebugHud extends BasicHud {
	public function new() {
		super(500, 10);

		addCheck('Show water', function() return GameConfig.ShowWaterBackground, function(v) {
			GameConfig.ShowWaterBackground = v;
		}, 2);

		addCheck('Debug draw', function() return GameConfig.DebugDraw, function(v) {
			GameConfig.DebugDraw = v;
		}, 2);

		addCheck('Draw firing area', function() return GameConfig.DebugCannonFiringArea, function(v) {
			GameConfig.DebugCannonFiringArea = v;
		}, 2);

		addCheck('Draw cannons sight', function() return GameConfig.DrawCannonsSight, function(v) {
			GameConfig.DrawCannonsSight = v;
		}, 2);
	}
}
