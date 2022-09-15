package client.network;

// -----------------------------------
// Common api
// -----------------------------------

class FounderCollections {
	public final captainsOnSale:Int;
	public final shipsOnSale:Int;
	public final islandsOnSale:Int;

	public function new(captainsOnSale:Int, shipsOnSale:Int, islandsOnSale:Int) {
		this.captainsOnSale = captainsOnSale;
		this.shipsOnSale = shipsOnSale;
		this.islandsOnSale = islandsOnSale;
	}
}

typedef CaptainEntity = {
	id:Int,
	stakingRewardNVY:Int,
	miningRewardNVY:Int,
	traits:Int,
	level:Int,
	rarity:Int,
	bg:Int,
	acc:Int,
	head:Int,
	haircutOrHat:Int,
	clothes:Int,
}

typedef ShipEntity = {
	id:Int,
	type:Int,
	hull:Int,
	armor:Int,
	maxSpeed:Int,
	accelerationStep:Int,
	accelerationDelay:Int,
	rotationDelay:Int,
	cannons:Int,
	cannonsRange:Int,
	cannonsDamage:Int,
	traits:Int,
	rarity:Int,
	size:Int,
	windows:Int,
	anchor:Int,
	level:Int
}

typedef IslandEntity = {
	id:Int,
	level:Int,
	rarity:Int,
	terrain:String,
	miningRewardNVY:Int,
	shipAndCaptainFee:Int,
	maxMiners:Int,
	minersFee:Int
}

class NFTs {
	public final captains:Array<CaptainEntity>;
	public final ships:Array<ShipEntity>;
	public final islands:Array<IslandEntity>;

	public function new(captains:Array<CaptainEntity>, ships:Array<ShipEntity>, islands:Array<IslandEntity>) {
		this.captains = captains;
		this.ships = ships;
		this.islands = islands;
	}
}

// -----------------------------------
// Player
// -----------------------------------

class PlayerData {
	public final ethAddress:String;
	public final nickname:String;
	public final ownedCaptains:Array<CaptainEntity>;
	public final ownedShips:Array<ShipEntity>;
	public final ownedIslands:Array<IslandEntity>;
	public var worldX:Int;
	public var worldY:Int;

	public function new(ethAddress:String, nickname:String, worldX:Int, worldY:Int, ownedCaptains:Array<CaptainEntity>, ownedShips:Array<ShipEntity>,
			ownedIslands:Array<IslandEntity>) {
		this.ethAddress = ethAddress;
		this.nickname = nickname;
		this.worldX = worldX;
		this.worldY = worldY;
		this.ownedCaptains = ownedCaptains;
		this.ownedShips = ownedShips;
		this.ownedIslands = ownedIslands;
	}
}

// -----------------------------------
// World and sectors
// -----------------------------------

typedef Sector = {
	x:Int,
	y:Int,
	content:Int
}

class GameWorldData {
	public static final SectorEmptyType = 1;
	public static final SectorBaseType = 2;
	public static final SectorIslandType = 3;
	public static final SectorBossType = 4;
	public static final SectorPVEType = 5;
	public static final SectorPVPType = 6;

	public final size:Int;
	public final sectors:Array<Sector>;

	public function new(size:Int, sectors:Array<Sector>) {
		this.size = size;
		this.sectors = sectors;
	}
}

class JoinSectorResponse {
	public final result:Bool;
	public final reason:String;
	public final playersCount:Int;
	public final totalShips:Int;
	public final instanceId:String;
	public final sectorType:Int;

	public function new(result:Bool, reason:String, playersCount:Int, totalShips:Int, instanceId:String, sectorType:Int) {
		this.result = result;
		this.reason = reason;
		this.playersCount = playersCount;
		this.totalShips = totalShips;
		this.instanceId = instanceId;
		this.sectorType = sectorType;
	}
}
