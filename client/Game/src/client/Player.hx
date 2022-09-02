package client;

import uuid.Uuid;
import client.network.RestProtocol;

class Player {
	public static final instance:Player = new Player();

	public var playerData:PlayerData;
	public var ethAddress:String;

	private function new() {
		ethAddress = Uuid.short();
	}
}
