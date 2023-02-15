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
	id:String,
	owner:String,
	type:Int,
	stakingRewardNVY:Int,
	miningRewardNVY:Int,
	miningStartedAt:Int,
	miningDurationSeconds:Int,
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
	id:String,
	owner:String,
	type:Int,
	hull:Int,
	armor:Int,
	maxSpeed:Int,
	direction:String,
	accelerationStep:Int,
	accelerationDelay:Int,
	rotationDelay:Int,
	fireDelay:Int,
	cannons:Int,
	cannonsRange:Int,
	cannonsDamage:Int,
	traits:Int,
	rarity:Int,
	size:Int,
	windows:Int,
	anchor:Int,
	level:Int,
	currentIntegrity:Int,
	maxIntegrity:Int
}

typedef IslandEntity = {
	id:String,
	owner:String,
	level:Int,
	rarity:Int,
	size:Int,
	terrain:String,
	miningRewardNVY:Int,
	shipAndCaptainFee:Int,
	maxMiners:Int,
	mining:Bool,
	miners:Int,
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
	public var nvy:Float;
	public var aks:Float;

	public var dailyPlayersKilledCurrent:Int;
	public var dailyPlayersKilledMax:Int;
	public var dailyBotsKilledCurrent:Int;
	public var dailyBotsKilledMax:Int;
	public var dailyBossesKilledCurrent:Int;
	public var dailyBossesKilledMax:Int;

	public function new(ethAddress:String, nickname:String, worldX:Int, worldY:Int, nvy:Float, aks:Float, ownedCaptains:Array<CaptainEntity>,
			ownedShips:Array<ShipEntity>, ownedIslands:Array<IslandEntity>, dailyPlayersKilledCurrent:Int, dailyPlayersKilledMax:Int,
			dailyBotsKilledCurrent:Int, dailyBotsKilledMax:Int, dailyBossesKilledCurrent:Int, dailyBossesKilledMax:Int) {
		this.ethAddress = ethAddress;
		this.nickname = nickname;
		this.worldX = worldX;
		this.worldY = worldY;
		this.nvy = nvy;
		this.aks = aks;

		this.ownedCaptains = ownedCaptains;
		this.ownedShips = ownedShips;
		this.ownedIslands = ownedIslands;

		this.dailyPlayersKilledCurrent = dailyPlayersKilledCurrent;
		this.dailyPlayersKilledMax = dailyPlayersKilledMax;
		this.dailyBotsKilledCurrent = dailyBotsKilledCurrent;
		this.dailyBotsKilledMax = dailyBotsKilledMax;
		this.dailyBossesKilledCurrent = dailyBossesKilledCurrent;
		this.dailyBossesKilledMax = dailyBossesKilledMax;
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
	public final instanceId:String;
	public final sectorType:Int;

	public final islandId:String;
	public final islandOwner:String;
	public final islandTerrain:String;
	public final islandMining:Bool;

	public function new(result:Bool, reason:String, totalShips:Int, instanceId:String, sectorType:Int, islandId:String, islandOwner:String,
			islandTerrain:String, islandMining:Bool) {
		this.result = result;
		this.reason = reason;
		this.instanceId = instanceId;
		this.sectorType = sectorType;

		// Island
		this.islandId = islandId;
		this.islandOwner = islandOwner;
		this.islandTerrain = islandTerrain;
		this.islandMining = islandMining;
	}
}
