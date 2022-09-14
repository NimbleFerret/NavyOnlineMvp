package client;

@:native("window")
extern class Moralis {
	static function isEthereumBrowser():Bool;

	static function initMoralis(callback:String->Void):Void;

	static function getEthAddress():String;

	static function buyFounderShip(successCallback:Void->Void, errorCallback:Void->Void):Void;

	static function buyFounderIsland(successCallback:Void->Void, errorCallback:Void->Void):Void;

	static function buyFounderCaptain(successCallback:Void->Void, errorCallback:Void->Void):Void;
}
