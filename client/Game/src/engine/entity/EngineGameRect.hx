package engine.entity;

class EngineGameRect {
	var x:Float;
	var y:Float;
	var w:Float;
	var h:Float;
	var r:Float;

	public function new(x:Float, y:Float, w:Float, h:Float, r:Float) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
	}

	private function getCenter() {
		return {
			x: x + w / 2,
			y: y + y / 2
		}
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
		return {
			x: rotatedCoords.x,
			y: rotatedCoords.y
		}
	}

	public function getBottomLeftPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getLeft(), getBottom(), x, y, r);
		return {
			x: rotatedCoords.x,
			y: rotatedCoords.y
		}
	}

	public function getTopRightPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getRight(), getTop(), x, y, r);
		return {
			x: rotatedCoords.x,
			y: rotatedCoords.y
		}
	}

	public function getBottomRightPoint() {
		final rotatedCoords = MathUtils.rotatePointAroundCenter(getRight(), getBottom(), x, y, r);
		return {
			x: rotatedCoords.x,
			y: rotatedCoords.y
		}
	}

	private function getLines() {
		final topLeftPoint = this.getTopLeftPoint();
		final bottomLeftPoint = this.getBottomLeftPoint();
		final topRightPoint = this.getTopRightPoint();
		final bottomRightPoint = this.getBottomRightPoint();
		return {
			lineA: {
				x1: topLeftPoint.x,
				y1: topLeftPoint.y,
				x2: topRightPoint.x,
				y2: topRightPoint.y
			},
			lineB: {
				x1: topRightPoint.x,
				y1: topRightPoint.y,
				x2: bottomRightPoint.x,
				y2: bottomRightPoint.y
			},
			lineC: {
				x1: bottomRightPoint.x,
				y1: bottomRightPoint.y,
				x2: bottomLeftPoint.x,
				y2: bottomLeftPoint.y
			},
			lineD: {
				x1: bottomLeftPoint.x,
				y1: bottomLeftPoint.y,
				x2: topLeftPoint.x,
				y2: topLeftPoint.y
			}
		};
	}

	public function contains(b:EngineGameRect) {
		var result = true;

		// no horizontal overlap
		if (getLeft() >= b.getRight() || b.getLeft() >= getRight())
			result = false;

		// no vertical overlap
		if (getTop() >= b.getBottom() || b.getTop() >= getBottom())
			result = false;

		return result;
	}

	public function intersectsWithLine(x1:Float, y1:Float, x2:Float, y2:Float) {
		final rA = this.getLines();
		// RectA line A to RectB line A
		if (MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2)) {
			return true;
			// RectA line A to RectB line B
		} else if (MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2)) {
			return true;
			// RectA line A to RectB line C
		} else if (MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2)) {
			return true;
			// RectA line A to RectB line D
		} else if (MathUtils.lineToLineIntersection(x1, y1, x2, y2, rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2)) {
			return true;
		}
		return false;
	}

	// TODO Need to use Separating Axis Theorem (SAT) in order to reduce computation cost
	// https://github.com/Prozi/detect-collisions (BVH + SAT)
	public function intersectsWithRect(b:EngineGameRect) {
		// TODO add distance check first
		if (r == 0 && b.r == 0) {
			return contains(b);
		} else {
			final rA = getLines();
			final rB = b.getLines();

			// TODO reuse intersectsWithLine

			// RectA line A to RectB line A
			if (MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2, rB.lineA.y2)) {
				return true;
				// RectA line A to RectB line B
			} else if (MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2,
				rB.lineB.y2)) {
				return true;
				// RectA line A to RectB line C
			} else if (MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2,
				rB.lineC.y2)) {
				return true;
				// RectA line A to RectB line D
			} else if (MathUtils.lineToLineIntersection(rA.lineA.x1, rA.lineA.y1, rA.lineA.x2, rA.lineA.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2,
				rB.lineD.y2)) {
				return true;
				// RectA line B to RectB line A
			} else if (MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2,
				rB.lineA.y2)) {
				return true;
				// RectA line B to RectB line B
			} else if (MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2,
				rB.lineB.y2)) {
				return true;
				// RectA line B to RectB line C
			} else if (MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2,
				rB.lineC.y2)) {
				return true;
				// RectA line B to RectB line D
			} else if (MathUtils.lineToLineIntersection(rA.lineB.x1, rA.lineB.y1, rA.lineB.x2, rA.lineB.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2,
				rB.lineD.y2)) {
				return true;
				// RectA line C to RectB line A
			} else if (MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2,
				rB.lineA.y2)) {
				return true;
				// RectA line C to RectB line B
			} else if (MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2,
				rB.lineB.y2)) {
				return true;
				// RectA line C to RectB line C
			} else if (MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2,
				rB.lineC.y2)) {
				return true;
				// RectA line C to RectB line D
			} else if (MathUtils.lineToLineIntersection(rA.lineC.x1, rA.lineC.y1, rA.lineC.x2, rA.lineC.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2,
				rB.lineD.y2)) {
				return true;
				// RectA line D to RectB line A
			} else if (MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineA.x1, rB.lineA.y1, rB.lineA.x2,
				rB.lineA.y2)) {
				return true;
				// RectA line D to RectB line B
			} else if (MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineB.x1, rB.lineB.y1, rB.lineB.x2,
				rB.lineB.y2)) {
				return true;
				// RectA line D to RectB line C
			} else if (MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineC.x1, rB.lineC.y1, rB.lineC.x2,
				rB.lineC.y2)) {
				return true;
				// RectA line D to RectB line D
			} else if (MathUtils.lineToLineIntersection(rA.lineD.x1, rA.lineD.y1, rA.lineD.x2, rA.lineD.y2, rB.lineD.x1, rB.lineD.y1, rB.lineD.x2,
				rB.lineD.y2)) {
				return true;
			}
			return false;
		}
	}
}
