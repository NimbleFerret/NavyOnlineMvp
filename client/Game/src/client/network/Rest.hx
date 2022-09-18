package client.network;

import client.network.RestProtocol;
import haxe.http.HttpJs;

class Rest {
	public static final instance:Rest = new Rest();

	private function new() {}

	public function signInOrUp(ethAddress:String, callback:PlayerData->Void) {
		final req = new HttpJs("http://localhost:3000/app/signInOrUp");
		final body = {ethAddress: ethAddress};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new PlayerData(json.ethAddress, json.nickname, json.worldX, json.worldY, json.ownedCaptains, json.ownedShips, json.ownedIslands,
					json.dailyPlayersKilledCurrent, json.dailyPlayersKilledMax, json.dailyBotsKilledCurrent, json.dailyBotsKilledMax,
					json.dailyBossesKilledCurrent, json.dailyBossesKilledMax));
			}
		};
	}

	public function getWorldInfo(callback:GameWorldData->Void) {
		final req = new HttpJs("http://localhost:3000/app/world");
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new GameWorldData(json.size, json.sectors));
			}
		};
	}

	public function worldMove(ethAddress:String, x:Int, y:Int, callback:Bool->Void) {
		final req = new HttpJs("http://localhost:3000/app/world/move");
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
		final req = new HttpJs("http://localhost:3000/app/world/enter");
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
		final req = new HttpJs("http://localhost:3000/app/founders");
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new FounderCollections(json.captainsOnSale, json.shipsOnSale, json.islandsOnSale));
			}
		};
	}

	public function getNfts(ethAddress:String, callback:NFTs->Void) {
		final req = new HttpJs('http://localhost:3000/app/nfts/' + ethAddress);
		req.request();
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new NFTs(json.captains, json.ships, json.islands));
			}
		};
	}
}
