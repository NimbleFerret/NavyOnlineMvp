package game.engine.base.geometry;

import game.engine.base.geometry.Point;
import game.engine.base.geometry.Line;

// TODO Make some functions Inline ?
class Rectangle {
	public var x:Float;
	public var y:Float;
	public var w:Float;
	public var h:Float;
	public var r:Float;

	public function new(x:Float, y:Float, w:Float, h:Float, r:Float) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
	}

	public function getCenter() {
		return new Point(x, y);
	}

	private function getLeft() {
		return x - w / 2;
	}

	private function getRight() {
		return x + w / 2;
	}

	private function getTop() {
		return y - h / 2;
	}

	private function getBottom() {
		return y + h / 2;
	}

	public function getTopLeftPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getLeft(), getTop(), x, y, r);
		return new Point(rotatedCoords.x, rotatedCoords.y);
	}

	public function getBottomLeftPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getLeft(), getBottom(), x, y, r);
		return new Point(rotatedCoords.x, rotatedCoords.y);
	}

	public function getTopRightPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getRight(), getTop(), x, y, r);
		return new Point(rotatedCoords.x, rotatedCoords.y);
	}

	public function getBottomRightPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getRight(), getBottom(), x, y, r);
		return new Point(rotatedCoords.x, rotatedCoords.y);
	}

	public function getLines() {
		final topLeftPoint = this.getTopLeftPoint();
		final bottomLeftPoint = this.getBottomLeftPoint();
		final topRightPoint = this.getTopRightPoint();
		final bottomRightPoint = this.getBottomRightPoint();
		return {
			lineA: new Line(topLeftPoint.x, topLeftPoint.y, topRightPoint.x, topRightPoint.y),
			lineB: new Line(topRightPoint.x, topRightPoint.y, bottomRightPoint.x, bottomRightPoint.y),
			lineC: new Line(bottomRightPoint.x, bottomRightPoint.y, bottomLeftPoint.x, bottomLeftPoint.y),
			lineD: new Line(bottomLeftPoint.x, bottomLeftPoint.y, topLeftPoint.x, topLeftPoint.y)
		};
	}

	public function contains(b:Rectangle) {
		var result = true;

		// no horizontal overlap
		if (getLeft() >= b.getRight() || b.getLeft() >= getRight())
			result = false;

		// no vertical overlap
		if (getTop() >= b.getBottom() || b.getTop() >= getBottom())
			result = false;

		return result;
	}

	public function intersectsWithLine(line:Line) {
		final lines = this.getLines();

		if (lines.lineA.intersectsWithLine(line)) {
			return true;
		} else if (lines.lineB.intersectsWithLine(line)) {
			return true;
		} else if (lines.lineC.intersectsWithLine(line)) {
			return true;
		} else if (lines.lineD.intersectsWithLine(line)) {
			return true;
		}

		return false;
	}

	public function intersectsWithPoint(point:Point) {
		if (r == 0)
			return Math.abs(x - point.x) < w / 2 && Math.abs(y - point.y) < h / 2;

		final tx = Math.cos(r) * point.x - Math.sin(r) * point.y;
		final ty = Math.cos(r) * point.y + Math.sin(r) * point.x;
		final cx = Math.cos(r) * x - Math.sin(r) * y;
		final cy = Math.cos(r) * y + Math.sin(r) * x;
		return Math.abs(cx - tx) < w / 2 && Math.abs(cy - ty) < h / 2;
	}

	// TODO Need to use Separating Axis Theorem (SAT) in order to reduce computation cost
	// https://github.com/Prozi/detect-collisions (BVH + SAT)
	public function intersectsWithRect(b:Rectangle) {
		// TODO add distance check first
		if (r == 0 && b.r == 0) {
			return contains(b);
		} else {
			final rA = getLines();
			final rB = b.getLines();
			// Check if rect A line A intersects with each line of rect B
			if (rA.lineA.intersectsWithLine(rB.lineA)
				|| rA.lineA.intersectsWithLine(rB.lineB)
				|| rA.lineA.intersectsWithLine(rB.lineC)
				|| rA.lineA.intersectsWithLine(rB.lineD)) {
				return true;
			}
			// Check if rect B line A intersects with each line of rect B
			if (rA.lineB.intersectsWithLine(rB.lineA)
				|| rA.lineB.intersectsWithLine(rB.lineB)
				|| rA.lineB.intersectsWithLine(rB.lineC)
				|| rA.lineB.intersectsWithLine(rB.lineD)) {
				return true;
			}
			// Check if rect C line A intersects with each line of rect B
			if (rA.lineC.intersectsWithLine(rB.lineA)
				|| rA.lineC.intersectsWithLine(rB.lineB)
				|| rA.lineC.intersectsWithLine(rB.lineC)
				|| rA.lineC.intersectsWithLine(rB.lineD)) {
				return true;
			}
			// Check if rect D line A intersects with each line of rect B
			if (rA.lineD.intersectsWithLine(rB.lineA)
				|| rA.lineD.intersectsWithLine(rB.lineB)
				|| rA.lineD.intersectsWithLine(rB.lineC)
				|| rA.lineD.intersectsWithLine(rB.lineD)) {
				return true;
			}
			return false;
		}
	}
}
