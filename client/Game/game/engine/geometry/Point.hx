package game.engine.geometry;

class Point {
	public var x:Float;
	public var y:Float;

	public function new(x:Float = 0, y:Float = 0) {
		this.x = x;
		this.y = y;
	}

	public inline function distanceSq(p:Point) {
		var dx = x - p.x;
		var dy = y - p.y;
		return dx * dx + dy * dy;
	}

	public inline function distance(p:Point):Float {
		return Math.sqrt(distanceSq(p));
	}
}
