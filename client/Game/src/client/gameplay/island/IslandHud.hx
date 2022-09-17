package client.gameplay.island;

import client.gameplay.BaiscHud.BasicHud;

class IslandHud extends BasicHud {
	public function new(islandId:String, islandOwner:String, leaveCallback:Void->Void) {
		super();

		final mainFui = new h2d.Flow(this);
		mainFui.layout = Vertical;
		mainFui.verticalSpacing = 5;
		mainFui.padding = 10;

		final islandInfoPlate = newCustomPlate(mainFui, 7, 2);
		islandInfoPlate.setPosition(5, 5);

		final idText = addText2(islandInfoPlate, 'Island id: ' + islandId);
		final ownerText = addText2(islandInfoPlate, 'Island owner: ' + Utils.MaskEthAddress(islandOwner));
		ownerText.setPosition(idText.x, idText.y + 70);

		addGuiButton(mainFui, 'Repair ship', false, function callback() {});
		addGuiButton(mainFui, 'Upgrade ship', false, function callback() {});
		addGuiButton(mainFui, 'Create ship', false, function callback() {});
		addGuiButton(mainFui, 'Leave island', false, function callback() {
			if (leaveCallback != null) {
				leaveCallback();
			}
		});
	}
}
