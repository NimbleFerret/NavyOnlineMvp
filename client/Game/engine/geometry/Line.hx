package engine.geometry;

class Line {
	public var x1:Float;
	public var y1:Float;
	public var x2:Float;
	public var y2:Float;

	public function new(x1:Float = 0, y1:Float = 0, x2:Float = 0, y2:Float = 0) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	public function intersectsWithLine(line:Line) {
		return MathUtils.lineToLineIntersection(this, line);
	}
}
