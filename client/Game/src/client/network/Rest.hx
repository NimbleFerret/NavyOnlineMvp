package client.network;

import client.network.RestProtocol;
import haxe.http.HttpJs;

final ServerUrl = 'http://localhost:3000';

// final ServerUrl = 'https://navy.online';
class Rest {
	public static final instance:Rest = new Rest();

	private function new() {}

	public function signInOrUp(ethAddress:String, callback:PlayerData->Void) {
		final req = new HttpJs(ServerUrl + "/app/signInOrUp");
		final body = {ethAddress: ethAddress};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new PlayerData(json.ethAddress, json.nickname, json.worldX, json.worldY, json.nvy, json.aks, json.ownedCaptains, json.ownedShips,
					json.ownedIslands, json.dailyPlayersKilledCurrent, json.dailyPlayersKilledMax, json.dailyBotsKilledCurrent, json.dailyBotsKilledMax,
					json.dailyBossesKilledCurrent, json.dailyBossesKilledMax));
			}
		};
	}

	public function getWorldInfo(callback:GameWorldData->Void) {
		final req = new HttpJs(ServerUrl + "/app/world");
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new GameWorldData(json.size, json.sectors));
			}
		};
	}

	public function worldMove(ethAddress:String, x:Int, y:Int, callback:Bool->Void) {
		final req = new HttpJs(ServerUrl + "/app/world/move");
		final body = {
			ethAddress: ethAddress,
			x: x,
			y: y
		};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(json.result);
			}
		};
	}

	public function worldEnter(ethAddress:String, x:Int, y:Int, callback:JoinSectorResponse->Void) {
		final req = new HttpJs(ServerUrl + "/app/world/enter");
		final body = {
			ethAddress: ethAddress,
			x: x,
			y: y
		};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new JoinSectorResponse(json.result, json.reason, json.totalShips, json.instanceId, json.sectorType, json.islandId, json.islandOwner,
					json.islandTerrain, json.islandMining));
			}
		};
	}

	public function getFounderCollections(callback:FounderCollections->Void) {
		final req = new HttpJs(ServerUrl + "/app/founders");
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new FounderCollections(json.captainsOnSale, json.shipsOnSale, json.islandsOnSale));
			}
		};
	}

	public function getNfts(ethAddress:String, callback:NFTs->Void) {
		final req = new HttpJs(ServerUrl + '/app/nfts/' + ethAddress);
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new NFTs(json.captains, json.ships, json.islands));
			}
		};
	}

	public function startMining(ethAddress:String, islandId:String) {
		final req = new HttpJs(ServerUrl + "/app/startMining");
		final body = {ethAddress: ethAddress, islandId: islandId};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
	}
}
