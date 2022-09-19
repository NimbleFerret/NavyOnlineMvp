/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { AppEvents, MintIngameReward, NotifyPlayerEventMsg, PlayerKilledShip } from '../app.events';
import { User, UserDocument } from '../user/user.entity';
import { DailyTaskType, SocketServerDailyTaskChange, SocketServerDailyTaskComplete, WsProtocol } from '../ws/ws.protocol';

// TODO Need refactgor this class. Need to cache user and issue reward in a different worker thread
@Injectable()
export class RewardService {

    public static readonly DailyPlayersKillTask = 2;
    public static readonly DailyPlayersKillRewardNVY = 2;
    public static readonly DailyPlayersKillRewardAKS = 40;

    public static readonly DailyBotsKillTask = 10;
    public static readonly DailyBotsKillRewardNVY = 2;
    public static readonly DailyBotsKillRewardAKS = 40;

    public static readonly DailyBossesKillTask = 5;
    public static readonly DailyBossesKillRewardNVY = 1;
    public static readonly DailyBossesKillRewardAKS = 40;

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private eventEmitter: EventEmitter2) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    resetDailyTasks() {
        console.log(new Date().getTime());
        // TODO reset daily tasls
    }

    @OnEvent(AppEvents.PlayerKilledPlayer)
    async playerKilledPlayer(data: PlayerKilledShip) {
        const player = await this.findUserByEthAddress(data.playerId);
        if (player && player.dailyPlayersKilled + 1 <= RewardService.DailyPlayersKillTask) {
            player.dailyPlayersKilled += 1;
            await player.save()
            await this.dailyTaskChanged(player);
            await this.checkDailyRewardsForPlayer(player);
        }
    }

    @OnEvent(AppEvents.PlayerKilledBot)
    async playerKilledBot(data: PlayerKilledShip) {
        const player = await this.findUserByEthAddress(data.playerId);
        if (player && player.dailyBotsKilled + 1 <= RewardService.DailyBotsKillTask) {
            player.dailyBotsKilled += 1;
            await player.save()
            await this.dailyTaskChanged(player);
            await this.checkDailyRewardsForPlayer(player);
        }
    }

    @OnEvent(AppEvents.PlayerKilledBoss)
    async playerKilledBoss(data: PlayerKilledShip) {
        const player = await this.findUserByEthAddress(data.playerId);
        if (player && player.dailyBossesKilled + 1 <= RewardService.DailyBossesKillTask) {
            player.dailyBossesKilled += 1;
            await player.save()
            await this.dailyTaskChanged(player);
            await this.checkDailyRewardsForPlayer(player);
        }
    }

    private async dailyTaskChanged(player: UserDocument) {
        const notifyPlayerEventMsg = {
            playerId: player.ethAddress,
            socketEvent: WsProtocol.SocketServerEventDailyTaskUpdate,
            message: {
                dailyPlayersKilledCurrent: player.dailyPlayersKilled,
                dailyPlayersKilledMax: RewardService.DailyPlayersKillTask,
                dailyBotsKilledCurrent: player.dailyBotsKilled,
                dailyBotsKilledMax: RewardService.DailyBotsKillTask,
                dailyBossesKilledCurrent: player.dailyBossesKilled,
                dailyBossesKilledMax: RewardService.DailyBossesKillTask
            } as SocketServerDailyTaskChange
        } as NotifyPlayerEventMsg;
        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    private async checkDailyRewardsForPlayer(player: UserDocument) {
        let dailyTaskType: DailyTaskType;
        let rewardNVY = 0;
        let rewardAKS = 0;

        if (player.dailyPlayersKilled == RewardService.DailyPlayersKillTask) {
            dailyTaskType = DailyTaskType.KILL_PLAYERS;
            rewardNVY = RewardService.DailyPlayersKillRewardNVY;
            rewardAKS = RewardService.DailyPlayersKillRewardAKS
        }
        if (player.dailyBotsKilled == RewardService.DailyBotsKillTask) {
            dailyTaskType = DailyTaskType.KILL_BOTS;
            rewardNVY = RewardService.DailyBotsKillRewardNVY;
            rewardAKS = RewardService.DailyBotsKillRewardAKS
        }
        if (player.dailyBossesKilled == RewardService.DailyBossesKillTask) {
            dailyTaskType = DailyTaskType.KILL_BOSSES;
            rewardNVY = RewardService.DailyBossesKillRewardNVY;
            rewardAKS = RewardService.DailyBossesKillRewardAKS
        }

        if (dailyTaskType) {
            const notifyPlayerEventMsg = {
                playerId: player.ethAddress,
                socketEvent: WsProtocol.SocketServerEventDailyTaskReward,
                message: {
                    dailyTaskType,
                    rewardNVY,
                    rewardAKS
                } as SocketServerDailyTaskComplete
            } as NotifyPlayerEventMsg;
            this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);

            this.eventEmitter.emit(AppEvents.MintIngameReward, {
                playerId: player.ethAddress,
                nvy: rewardNVY,
                aks: rewardAKS
            } as MintIngameReward);
        }
    }

    private async findUserByEthAddress(ethAddress: string) {
        return this.userModel.findOne({ ethAddress });
    }
}