package client;

import client.network.RestProtocol;

class Player {
	public static final instance:Player = new Player();

	public var playerData:PlayerData;
	public var ethAddress:String;
	public var currentShipId:String;
	public var isCurrentShipIsFree = true;

	private function new() {}
}
