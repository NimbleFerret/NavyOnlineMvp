package client.network;

import client.network.RestProtocol;
import haxe.http.HttpJs;

class Rest {
	public static final instance:Rest = new Rest();

	private function new() {
		// getNftShips('0x87400A03678dd03c8BF536404B5B14C609a23b79');
	}

	public function signInOrUp(ethAddress:String, callback:PlayerData->Void) {
		final req = new HttpJs("http://localhost:3000/app/signInOrUp");
		final body = {ethAddress: ethAddress};
		req.setPostData(haxe.Json.stringify(body));
		req.addHeader("Content-type", "application/json");
		req.request(true);
		req.onData = function onData(data:String) {
			if (callback != null) {
				final json = haxe.Json.parse(data);
				callback(new PlayerData(json.ethAddress, json.nickname, json.worldX, json.worldY, json.worldState));
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
				callback(new JoinSectorResponse(json.result, json.reason, json.playersCount, json.totalShips, json.instanceId, json.sectorType));
			}
		};
	}

	//

	public function getNftShips(ethAddress:String) {
		final req = new HttpJs('https://deep-index.moralis.io/api/v2/' + ethAddress + '/nft?chain=0x152&format=decimal');
		req.addHeader('Content-type', 'application/json');
		req.addHeader('X-API-Key', 'aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF');
		req.onData = function onData(data:String) {
			final json = haxe.Json.parse(data);
			final nfts = new Array<MoralisNFT>();
			if (json.total > 0) {
				final tokens:Array<Dynamic> = json.result;
				for (token in tokens) {
					nfts.push(new MoralisNFT(token.name, token.metadata));
				}
			}
			final shipNfts = new MoralisNFTs(json.total, nfts);
			trace('');
		};
		req.request();
		// 		const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': 'test'}};
		// fetch('https://deep-index.moralis.io/api/v2/address/nft?chain=eth&format=decimal', options)
		//   .then(response => response.json())
		//   .then(response => console.log(response))
		//   .catch(err => console.error(err));
	}
}
