package client.scene.base;

import client.network.RestProtocol.JoinSectorResponse;
import h2d.Scene;

abstract class BasicScene extends Scene {
	public abstract function start(?joinSectorResponse:JoinSectorResponse):Void;

	public abstract function update(dt:Float, fps:Float):Void;

	public abstract function getInputScene():h2d.Scene;
}
