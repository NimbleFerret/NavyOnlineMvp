package game.engine.entity;

import game.engine.entity.TypesAndClasses;

class EngineShipEntityConfig {
	public static final EntityShapeByType:Map<GameEntityType, EntityShape> = [
		GameEntityType.SmallShip => new EntityShape(200, 80),
		GameEntityType.MediumShip => new EntityShape(300, 120),
		GameEntityType.Shell => new EntityShape(10, 10),
		GameEntityType.Character => new EntityShape(60, 60)
	];

	public static final ShapeOffsetByDir:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.East => new PosOffset(0, -100, -40),
		GameEntityDirection.North => new PosOffset(-90, -50, 110),
		GameEntityDirection.NorthEast => new PosOffset(-26, -110, 19),
		GameEntityDirection.NorthWest => new PosOffset(-155, -65, 87),
		GameEntityDirection.South => new PosOffset(90, 26, 72),
		GameEntityDirection.SouthEast => new PosOffset(26, -80, -6),
		GameEntityDirection.SouthWest => new PosOffset(-23, -113, 19),
		GameEntityDirection.West => new PosOffset(0, -110, -42),
	];

	// Small size
	public static final RightCannonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray([new PosOffset(-28, 26), new PosOffset(0, 26), new PosOffset(28, 26)]),
		GameEntityDirection.NorthEast => new PosOffsetArray([new PosOffset(17, 31), new PosOffset(36, 21), new PosOffset(55, 13)]),
		GameEntityDirection.North => new PosOffsetArray([new PosOffset(50, 10), new PosOffset(50, -13), new PosOffset(50, 33)]),
		GameEntityDirection.NorthWest => new PosOffsetArray([new PosOffset(50, -16), new PosOffset(28, -26), new PosOffset(7, -33)]),
		GameEntityDirection.West => new PosOffsetArray([new PosOffset(50, -50), new PosOffset(21, -50), new PosOffset(-8, -50)]),
		GameEntityDirection.SouthWest => new PosOffsetArray([new PosOffset(-10, -41), new PosOffset(-27, -34), new PosOffset(-41, -27)]),
		GameEntityDirection.South => new PosOffsetArray([new PosOffset(-50, -31), new PosOffset(-50, -11), new PosOffset(-50, 10)]),
		GameEntityDirection.SouthEast => new PosOffsetArray([new PosOffset(-70, 10), new PosOffset(-50, 19), new PosOffset(-28, 29)]),
	];

	public static final LeftCannonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray([new PosOffset(-28, -52), new PosOffset(0, -52), new PosOffset(28, -52)]),
		GameEntityDirection.NorthEast => new PosOffsetArray([new PosOffset(-55, -16), new PosOffset(-35, -24), new PosOffset(-16, -32)]),
		GameEntityDirection.North => new PosOffsetArray([new PosOffset(-50, 10), new PosOffset(-50, -13), new PosOffset(-50, 33)]),
		GameEntityDirection.NorthWest => new PosOffsetArray([new PosOffset(-13, 32), new PosOffset(-32, 22), new PosOffset(-52, 11)]),
		GameEntityDirection.West => new PosOffsetArray([new PosOffset(50, 27), new PosOffset(21, 27), new PosOffset(-8, 27)]),
		GameEntityDirection.SouthWest => new PosOffsetArray([new PosOffset(70, 5), new PosOffset(50, 15), new PosOffset(31, 25)]),
		GameEntityDirection.South => new PosOffsetArray([new PosOffset(50, -31), new PosOffset(50, -11), new PosOffset(50, 10)]),
		GameEntityDirection.SouthEast => new PosOffsetArray([new PosOffset(11, -32), new PosOffset(27, -25), new PosOffset(46, -15)]),
	];

	// Mid size
	public static final RightCannonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray([
			new PosOffset(-49, 54),
			new PosOffset(-19, 54),
			new PosOffset(11, 54),
			new PosOffset(41, 54)
		]),
		GameEntityDirection.NorthEast => new PosOffsetArray([
			new PosOffset(21, 51),
			new PosOffset(47, 38),
			new PosOffset(72, 25),
			new PosOffset(96, 12)
		]),
		GameEntityDirection.North => new PosOffsetArray([
			new PosOffset(47, 8),
			new PosOffset(47, -13),
			new PosOffset(47, -34),
			new PosOffset(47, -55)
		]),
		GameEntityDirection.NorthWest => new PosOffsetArray([
			new PosOffset(27, -17),
			new PosOffset(5, -28),
			new PosOffset(-19, -40),
			new PosOffset(-42, -51)
		]),
		GameEntityDirection.West => new PosOffsetArray([
			new PosOffset(0, -59),
			new PosOffset(-24, -59),
			new PosOffset(-51, -59),
			new PosOffset(-78, -59)
		]),
		GameEntityDirection.SouthWest => new PosOffsetArray([
			new PosOffset(-61, -28),
			new PosOffset(-82, -17),
			new PosOffset(-103, -6),
			new PosOffset(-125, 5)
		]),
		GameEntityDirection.South => new PosOffsetArray([
			new PosOffset(-87, -10),
			new PosOffset(-87, 10),
			new PosOffset(-87, 30),
			new PosOffset(-87, 50)
		]),
		GameEntityDirection.SouthEast => new PosOffsetArray([
			new PosOffset(-82, 33),
			new PosOffset(-60, 44),
			new PosOffset(-39, 54),
			new PosOffset(-18, 64)
		]),
	];

	public static final LeftCannonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray([
			new PosOffset(-43, -59),
			new PosOffset(-15, -59),
			new PosOffset(13, -59),
			new PosOffset(41, -59)
		]),
		GameEntityDirection.NorthEast => new PosOffsetArray([
			new PosOffset(-63, -20),
			new PosOffset(-43, -30),
			new PosOffset(-23, -40),
			new PosOffset(-3, -50)
		]),
		GameEntityDirection.North => new PosOffsetArray([
			new PosOffset(-87, 8),
			new PosOffset(-87, -13),
			new PosOffset(-87, -34),
			new PosOffset(-87, -55)
		]),
		GameEntityDirection.NorthWest => new PosOffsetArray([
			new PosOffset(-60, 48),
			new PosOffset(-81, 38),
			new PosOffset(-102, 28),
			new PosOffset(-123, 18)
		]),
		GameEntityDirection.West => new PosOffsetArray([
			new PosOffset(0, 54),
			new PosOffset(-24, 54),
			new PosOffset(-51, 54),
			new PosOffset(-78, 54)
		]),
		GameEntityDirection.SouthWest => new PosOffsetArray([
			new PosOffset(42, 36),
			new PosOffset(24, 44),
			new PosOffset(-3, 59),
			new PosOffset(-26, 70)
		]),
		GameEntityDirection.South => new PosOffsetArray([
			new PosOffset(48, -10),
			new PosOffset(48, 10),
			new PosOffset(48, 30),
			new PosOffset(48, 50)
		]),
		GameEntityDirection.SouthEast => new PosOffsetArray([
			new PosOffset(25, -26),
			new PosOffset(47, -16),
			new PosOffset(70, -4),
			new PosOffset(93, 6)
		]),
	];

	public static final RightSideRectOffsetByDir:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.East => new PosOffset(0, 0, 0),
		GameEntityDirection.North => new PosOffset(0, 0, 0),
		GameEntityDirection.NorthEast => new PosOffset(0, 0, 0),
		GameEntityDirection.NorthWest => new PosOffset(0, 0, 0),
		GameEntityDirection.South => new PosOffset(0, 0, 0),
		GameEntityDirection.SouthEast => new PosOffset(0, 0, 0),
		GameEntityDirection.SouthWest => new PosOffset(0, 0, 0),
		GameEntityDirection.West => new PosOffset(0, 0, 0),
	];
}
