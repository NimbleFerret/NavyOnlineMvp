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
