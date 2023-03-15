package client;

import client.network.RestProtocol;
import uuid.Uuid;

class Player {
	public static final instance:Player = new Player();

	// Carefully drop playerData
	public var playerData:PlayerData;
	public var ethAddress:String;
	public var playerId:String;
	public var playerEntityId:String;
	public var isCurrentShipIsFree = true;

	public final SinglePlayer = false;
	public final TestGameplayInstanceId = "9fd5b610-93a3-45cf-9d38-311775a33ec5";
	public final TestIslandInstanceId = "88601987-c5f8-4076-b51b-d64845334210";

	private var inputIndex = 0;

	private function new() {
		playerId = Uuid.short().toLowerCase();
		playerEntityId = "testShip_" + playerId;
	}

	public function incrementAndGetInputIndex() {
		return ++inputIndex;
	}

	public function getInputIndex() {
		return inputIndex;
	}
}
