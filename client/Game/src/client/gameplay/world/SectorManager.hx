package client.gameplay.world;

import h2d.col.Point;
import h2d.Scene;
import h2d.Tile;
import h2d.Bitmap;
import client.gameplay.world.GameWorldGameplay.SectorContent;

final SectorSize = 100;
final SectorGroupSize = 20;
final GameWorldSize = 500;

// -----------------------------------
// Сектор
// -----------------------------------

class SectorObject {
	public final object:h2d.Object;

	private final contentBmp:Bitmap;

	public function new(parent:h2d.Object, x:Float, y:Float, sectorType:SectorContent) {
		object = new h2d.Object(parent);

		contentBmp = new Bitmap(getTileBySectorContent(sectorType), object);

		// Оптимизировать
		final borderRect = new h2d.Graphics(object);
		borderRect.lineStyle(3, 0xC79161);
		borderRect.drawRect(0, 0, SectorSize, SectorSize);
		borderRect.endFill();

		object.setPosition(x, y);
	}

	public function changeContent(sectorContent:SectorContent) {
		contentBmp.tile = getTileBySectorContent(sectorContent);
	}

	// TODO pre save
	private function getTileBySectorContent(sectorContent:SectorContent) {
		switch (sectorContent) {
			case Island1:
				return Tile.fromColor(0xEDED59, SectorSize, SectorSize);
			case Island2:
				return Tile.fromColor(0x0D865A, SectorSize, SectorSize);
			case Island3:
				return Tile.fromColor(0x030608, SectorSize, SectorSize);
			case Island4:
				return Tile.fromColor(0x860D78, SectorSize, SectorSize);
			case Island5:
				return Tile.fromColor(0x00FF2A, SectorSize, SectorSize);
			case _:
				return Tile.fromColor(0x0D5886, SectorSize, SectorSize);
		}
	}
}

// -----------------------------------
// Группа секторов
// -----------------------------------

/*
	Каждая группа секторов это двумерный масссив 20х20, 
	где каждая ячейка хранит информацию о контенте игрового мире в глобальных координатах.

	Группа секторов имеет свои координаты относительно сцены и камеры игрока, 
	чтобы можно было перемещать отдельные группы для поддержания эффекта буфферезации.

	Внутри каждой группы тайлы имеют координаты начиная с 0, 0.
 */
class SectorGroup {
	public final object:h2d.Object;

	private final sectorGroup:Array<Array<SectorObject>>;

	public var worldPos = new Point();

	public function new(worldX:Int, worldY:Int) {
		object = new h2d.Object();
		worldPos.set(worldX, worldY);

		sectorGroup = [for (i in 0...SectorGroupSize) []];

		final geoDataOffsetX = worldPos.x * SectorGroupSize;
		final geoDataOffsetY = worldPos.y * SectorGroupSize;
		final pos = new Point();

		for (y in 0...SectorGroupSize) {
			for (x in 0...SectorGroupSize) {
				final geoDataKey = (x + geoDataOffsetX) + '_' + (y + geoDataOffsetY);
				final sector = new SectorObject(object, pos.x, pos.y, GameWorldGameplay.GeoData.get(geoDataKey));
				sectorGroup[y].push(sector);

				pos.x += SectorSize;
			}

			pos.x = 0;
			pos.y += SectorSize;
		}

		setPosition();
	}

	public function shiftFromLeftToRightCorner() {
		worldPos.x += 5;
		setPosition();
		updateGroupContent();
	}

	public function shiftFromRightToLeftCorner() {
		worldPos.x -= 5;
		setPosition();
		updateGroupContent();
	}

	public function shiftFromTopToBottomCorner() {
		worldPos.y += 5;
		setPosition();
		updateGroupContent();
	}

	public function shiftFromBottomToTopCorner() {
		worldPos.y -= 5;
		setPosition();
		updateGroupContent();
	}

	private function setPosition() {
		final geoDataOffsetX = worldPos.x * SectorGroupSize;
		final geoDataOffsetY = worldPos.y * SectorGroupSize;
		object.setPosition(geoDataOffsetX * SectorSize, geoDataOffsetY * SectorSize);
	}

	private function updateGroupContent() {
		final geoDataOffsetX = worldPos.x * SectorGroupSize;
		final geoDataOffsetY = worldPos.y * SectorGroupSize;

		for (y in 0...SectorGroupSize) {
			for (x in 0...SectorGroupSize) {
				final geoDataKey = (x + geoDataOffsetX) + '_' + (y + geoDataOffsetY);
				sectorGroup[y][x].changeContent(GameWorldGameplay.GeoData.get(geoDataKey));
			}
		}
	}
}

// -----------------------------------
// Управление группами секторов
// -----------------------------------

/*
	Игровое поле для игрока представляет собой матрицу 5х5
	Каждый элемент которой это квадрат из 20 ячеек по 100 пикселей (фактически один видимый экран), элемент матрицы называется группа секторов
	Задача класса обеспечивать буффер экранов относительно всех 4 сторон от игрока и подгружать мир игры в этот буффер, переиспользуя и перемещая группы секторов
	А так же конвертировать абсолютную позицию игрока в мире в локальные координаты групп секторов
	К примеру поцизия игрока 10,10, это группа секторов 1,1, поскольку размер группы 20х20 

	1) Пример когда игрок в точке мира 3,3

		  1 2 3 4 5
		1 * * * * *
		2 * * * * *
		3 * * @ * *
		4 * * * * *
		5 * * * * *

	2) Игрок перемещается вправо на 4,3

		  1 2 3 4 5         2 3 4 5 6 
		1 * * * * *       1 * * * * * 
		2 * * * * *       2 * * * * *
		3 * * * @ *   =>  3 * * @ * *   
		4 * * * * *       4 * * * * *
		5 * * * * *       5 * * * * *

 */
class SectorManager {
	public final object:h2d.Object;

	private var playerPos:Point;
	private var lastPlayerSectorGroup:Point;

	private final groupHorizontalSize = 5;
	private var groupLine1 = new Array<SectorGroup>();
	private var groupLine2 = new Array<SectorGroup>();
	private var groupLine3 = new Array<SectorGroup>();
	private var groupLine4 = new Array<SectorGroup>();
	private var groupLine5 = new Array<SectorGroup>();

	public function new(scene:Scene, playerInitialPos:Point) {
		object = new h2d.Object(scene);

		final playerPosDetails = getPlayerPositionDetails(playerInitialPos);

		lastPlayerSectorGroup = new Point(playerPosDetails.currentPlayerSectorGroup.x, playerPosDetails.currentPlayerSectorGroup.y);

		final loopStartX = Std.int(playerPosDetails.currentPlayerSectorGroup.x);
		final loopStartY = Std.int(playerPosDetails.currentPlayerSectorGroup.y);

		for (y in loopStartY...loopStartY + 5) {
			for (x in loopStartX...loopStartX + 5) {
				final group = new SectorGroup(x, y);
				object.addChild(group.object);

				if (y == 0)
					groupLine1.push(group);
				if (y == 1)
					groupLine2.push(group);
				if (y == 2)
					groupLine3.push(group);
				if (y == 3)
					groupLine4.push(group);
				if (y == 4)
					groupLine5.push(group);
			}
		}
	}

	public function move(x:Float, y:Float) {
		object.x += x;
		object.y += y;
	}

	public function playerMoved(newPlayerPos:Point) {
		final p = getPlayerPositionDetails(newPlayerPos);

		// Вышел ли игрок за пределы последней группы секторов и в какую сторону
		if (p.currentPlayerSectorGroup.distance(lastPlayerSectorGroup) > 0) {
			trace('Seems like player changed his sector group');

			// При горизонтальном перемещении мы перемещаем первый или последний элемент каждой группы
			if (lastPlayerSectorGroup.x > p.currentPlayerSectorGroup.x) {
				trace('Moved to the left ?');

				// Обвновляем буффер если слева меньше 2 секторов
				if (!p.nearTheLeftBorder && groupLine1[0].worldPos.x - p.currentPlayerSectorGroup.x < 2) {
					trace('Need to update buffer on the left');

					// Переместить группы на сцене
					groupLine1[4].shiftFromRightToLeftCorner();
					groupLine2[4].shiftFromRightToLeftCorner();
					groupLine3[4].shiftFromRightToLeftCorner();
					groupLine4[4].shiftFromRightToLeftCorner();
					groupLine5[4].shiftFromRightToLeftCorner();

					// Обновить индексы
					groupLine1.unshift(groupLine1.pop());
					groupLine2.unshift(groupLine2.pop());
					groupLine3.unshift(groupLine3.pop());
					groupLine4.unshift(groupLine4.pop());
					groupLine5.unshift(groupLine5.pop());
				}
			} else if (lastPlayerSectorGroup.x < p.currentPlayerSectorGroup.x) {
				trace('Moved to the right');

				// Обвновляем буффер если справа меньше 2 секторов
				if (!p.nearTheRightBorder && groupLine1[4].worldPos.x - p.currentPlayerSectorGroup.x < 2) {
					trace('Need to update buffer on the right');

					// Переместить группы на сцене с левого края на правый
					groupLine1[0].shiftFromLeftToRightCorner();
					groupLine2[0].shiftFromLeftToRightCorner();
					groupLine3[0].shiftFromLeftToRightCorner();
					groupLine4[0].shiftFromLeftToRightCorner();
					groupLine5[0].shiftFromLeftToRightCorner();

					// Обновить индексы
					groupLine1.push(groupLine1.shift());
					groupLine2.push(groupLine2.shift());
					groupLine3.push(groupLine3.shift());
					groupLine4.push(groupLine4.shift());
					groupLine5.push(groupLine5.shift());
				}
			}

			// При вертикальном перемещении мы перемещаем каждый элемент в первой или последней группе
			if (lastPlayerSectorGroup.y > p.currentPlayerSectorGroup.y) {
				trace('Moved up ?');

				// Обвновляем буффер если сверху меньше 2 секторов
				if (!p.nearTheTopBorder && groupLine1[0].worldPos.y - p.currentPlayerSectorGroup.y < 2) {
					trace('Need to update buffer on the top');

					// Переместить группу на сцене
					groupLine5[0].shiftFromBottomToTopCorner();
					groupLine5[1].shiftFromTopToBottomCorner();
					groupLine5[2].shiftFromTopToBottomCorner();
					groupLine5[3].shiftFromTopToBottomCorner();
					groupLine5[4].shiftFromTopToBottomCorner();

					final groupLine1Copy = groupLine1.copy();
					final groupLine2Copy = groupLine2.copy();
					final groupLine3Copy = groupLine3.copy();
					final groupLine4Copy = groupLine4.copy();
					final groupLine5Copy = groupLine5.copy();

					// Обновить индексы
					groupLine1 = groupLine5Copy;
					groupLine2 = groupLine2Copy;
					groupLine3 = groupLine3Copy;
					groupLine4 = groupLine4Copy;
					groupLine5 = groupLine1Copy;
				}
			} else if (lastPlayerSectorGroup.y < p.currentPlayerSectorGroup.y) {
				trace('Moved down ?');

				// Обвновляем буффер если снизу меньше 2 секторов
				if (!p.nearTheBottomBorder && groupLine5[0].worldPos.y - p.currentPlayerSectorGroup.y < 2) {
					trace('Need to update buffer on the bottom');

					// Переместить группу на сцене
					groupLine1[0].shiftFromTopToBottomCorner();
					groupLine1[1].shiftFromTopToBottomCorner();
					groupLine1[2].shiftFromTopToBottomCorner();
					groupLine1[3].shiftFromTopToBottomCorner();
					groupLine1[4].shiftFromTopToBottomCorner();

					final groupLine1Copy = groupLine1.copy(); // 1 линия
					final groupLine2Copy = groupLine2.copy(); // 2 линия
					final groupLine3Copy = groupLine3.copy(); // 3 линия
					final groupLine4Copy = groupLine4.copy(); // 4 линия
					final groupLine5Copy = groupLine5.copy(); // 5 линия

					// Обновить индексы
					groupLine1 = groupLine2Copy;
					groupLine2 = groupLine3Copy;
					groupLine3 = groupLine4Copy;
					groupLine4 = groupLine5Copy;
					groupLine5 = groupLine1Copy;
				}
			}

			lastPlayerSectorGroup.set(p.currentPlayerSectorGroup.x, p.currentPlayerSectorGroup.y);
		}
	}

	private function getPlayerPositionDetails(playerPos:Point) {
		var nearTheLeftBorder = false;
		var nearTheRightBorder = false;
		var nearTheTopBorder = false;
		var nearTheBottomBorder = false;

		final currentPlayerSectorGroup = new Point(Math.ceil(playerPos.x / SectorGroupSize) - 1, Math.ceil(playerPos.y / SectorGroupSize) - 1);

		if (currentPlayerSectorGroup.x - 2 < 0) {
			nearTheLeftBorder = true;
		} else if (currentPlayerSectorGroup.x + 2 > GameWorldSize) {
			nearTheRightBorder = true;
		}

		if (currentPlayerSectorGroup.y - 2 < 0) {
			nearTheTopBorder = true;
		} else if (currentPlayerSectorGroup.y + 2 > GameWorldSize) {
			nearTheBottomBorder = true;
		}

		return {
			nearTheLeftBorder: nearTheLeftBorder,
			nearTheRightBorder: nearTheRightBorder,
			nearTheTopBorder: nearTheTopBorder,
			nearTheBottomBorder: nearTheBottomBorder,
			currentPlayerSectorGroup: currentPlayerSectorGroup
		}
	}
}
