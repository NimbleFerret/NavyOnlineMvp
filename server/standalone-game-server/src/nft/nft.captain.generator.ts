/* eslint-disable prettier/prettier */

import { v4 as uuidv4 } from 'uuid';
import { createCanvas, loadImage } from "canvas";
import { RandomService } from "src/random/random.service";
import { MoralisService } from 'src/moralis/moralis.service';
import { CaptainStats } from 'src/cronos/cronos.service';

export class NftCaptainGenerator {

    private readonly RareBgChance = 20;

    private readonly Clothes1Chance = 1;
    private readonly Clothes2Chance = 11;
    private readonly Clothes3Chance = 26;
    private readonly Clothes4Chance = 21;
    private readonly Clothes5Chance = 17;
    private readonly Clothes6Chance = 5;

    private readonly Head1Chance = 10;
    private readonly Head2Chance = 20;
    private readonly Head3Chance = 50;
    private readonly Head4Chance = 20;

    private readonly Acc1Chance = 25;
    private readonly Acc2Chance = 14;
    private readonly Acc3Chance = 3;
    private readonly Acc4Chance = 9;
    private readonly Acc5Chance = 1;

    private readonly HairOrHat1Chance = 12;
    private readonly HairOrHat2Chance = 15;
    private readonly HairOrHat3Chance = 22;
    private readonly HairOrHat4Chance = 9;
    private readonly HairOrHat5Chance = 1;
    private readonly HairOrHat6Chance = 5;
    private readonly HairOrHat7Chance = 7;
    private readonly HairOrHat8Chance = 3;

    async generateFounderCaptain(index: number, maxIndex: number, captainStats: CaptainStats) {
        const bodyImagePath = __dirname.split('dist')[0] + 'assets\\captain\\body.png';

        const acc1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\accessories\\acc_1.png';
        const acc2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\accessories\\acc_2.png';
        const acc3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\accessories\\acc_3.png';
        const acc4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\accessories\\acc_4.png';
        const acc5ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\accessories\\acc_5.png';

        const bg1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_1.png';
        const bg2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_2.png';
        const bg3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_3.png';
        const bg4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_4.png';
        const bg5ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_5.png';
        const bg6ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_6.png';
        const bg7ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_7.png';
        const bg8ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_8.png';
        const bg9ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_9.png';
        const bg10ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_10.png';
        const bg11ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_11.png';
        const bg12ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\bgs\\bg_12.png';

        const clothes1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_1.png';
        const clothes2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_2.png';
        const clothes3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_3.png';
        const clothes4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_4.png';
        const clothes5ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_5.png';
        const clothes6ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\clothes\\clothes_6.png';

        const haircut1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\haircuts\\haircut_1.png';
        const haircut2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\haircuts\\haircut_2.png';
        const haircut3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\haircuts\\haircut_3.png';
        const haircut4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\haircuts\\haircut_4.png';

        const hat1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\hats\\hat_1.png';
        const hat2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\hats\\hat_2.png';
        const hat3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\hats\\hat_3.png';
        const hat4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\hats\\hat_4.png';
        const hat5ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\hats\\hat_5.png';

        const head1ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\heads\\head_1.png';
        const head2ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\heads\\head_2.png';
        const head3ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\heads\\head_3.png';
        const head4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\heads\\head_4.png';

        const canvas = createCanvas(72, 72);
        const ctx = canvas.getContext('2d');

        // Generate BG
        // 9, 10, 11, 12 - rare

        // Background random 
        let bgImagePath = bg1ImagePath;
        const bgRnd1 = RandomService.GetRandomIntInRange(1, 100);

        if (100 - this.RareBgChance < bgRnd1) {
            const bgRnd2 = RandomService.GetRandomIntInRange(1, 4);
            switch (bgRnd2) {
                case 1:
                    bgImagePath = bg9ImagePath;
                    break;
                case 2:
                    bgImagePath = bg10ImagePath;
                    break;
                case 3:
                    bgImagePath = bg11ImagePath;
                    break;
                case 4:
                    bgImagePath = bg12ImagePath;
                    break;
            }
        } else {
            const bgRnd2 = RandomService.GetRandomIntInRange(1, 8);
            switch (bgRnd2) {
                case 1:
                    bgImagePath = bg1ImagePath;
                    break;
                case 2:
                    bgImagePath = bg2ImagePath;
                    break;
                case 3:
                    bgImagePath = bg3ImagePath;
                    break;
                case 4:
                    bgImagePath = bg4ImagePath;
                    break;
                case 5:
                    bgImagePath = bg5ImagePath;
                    break;
                case 6:
                    bgImagePath = bg6ImagePath;
                    break;
                case 7:
                    bgImagePath = bg7ImagePath;
                    break;
                case 8:
                    bgImagePath = bg8ImagePath;
                    break;
            }
        }

        // Clothes random
        let clothesImagePath;
        const clothesRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.Clothes1Chance < clothesRnd) {
            clothesImagePath = clothes1ImagePath;
        } else if (100 - this.Clothes2Chance < clothesRnd) {
            clothesImagePath = clothes2ImagePath;
        } else if (100 - this.Clothes3Chance < clothesRnd) {
            clothesImagePath = clothes3ImagePath;
        } else if (100 - this.Clothes4Chance < clothesRnd) {
            clothesImagePath = clothes4ImagePath;
        } else if (100 - this.Clothes5Chance < clothesRnd) {
            clothesImagePath = clothes5ImagePath;
        } else if (100 - this.Clothes6Chance < clothesRnd) {
            clothesImagePath = clothes6ImagePath;
        }

        // Head random
        let headImagePath = head1ImagePath;
        const headRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.Head1Chance < headRnd) {
            headImagePath = head1ImagePath;
        } else if (100 - this.Head2Chance < headRnd) {
            headImagePath = head2ImagePath;
        } else if (100 - this.Head3Chance < headRnd) {
            headImagePath = head3ImagePath;
        } else if (100 - this.Head4Chance < headRnd) {
            headImagePath = head4ImagePath;
        }

        // Add random
        let accImagePath;
        const accRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.Acc1Chance < accRnd) {
            accImagePath = acc1ImagePath;
        } else if (100 - this.Acc2Chance < accRnd) {
            accImagePath = acc2ImagePath;
        } else if (100 - this.Acc3Chance < accRnd) {
            accImagePath = acc3ImagePath;
        } else if (100 - this.Acc4Chance < accRnd) {
            accImagePath = acc4ImagePath;
        } else if (100 - this.Acc5Chance < accRnd) {
            accImagePath = acc5ImagePath;
        }

        // Haircut or hat random
        let haircutOrHatImagePath = haircut3ImagePath;
        const haircutOrHatRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.HairOrHat1Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = haircut1ImagePath;
        } else if (100 - this.HairOrHat2Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = haircut2ImagePath;
        } else if (100 - this.HairOrHat3Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = haircut4ImagePath;
        } else if (100 - this.HairOrHat4Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = hat1ImagePath;
        } else if (100 - this.HairOrHat5Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = hat2ImagePath;
        } else if (100 - this.HairOrHat6Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = hat3ImagePath;
        } else if (100 - this.HairOrHat7Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = hat4ImagePath;
        } else if (100 - this.HairOrHat8Chance < haircutOrHatRnd) {
            haircutOrHatImagePath = hat5ImagePath;
        }

        const bgImage = await loadImage(bgImagePath);
        const bodyImage = await loadImage(bodyImagePath);
        const clothesImage = clothesImagePath ? await loadImage(clothesImagePath) : undefined;
        const headImage = await loadImage(headImagePath);
        const accImage = accImagePath ? await loadImage(accImagePath) : undefined;
        const haircutOrHatImage = await loadImage(haircutOrHatImagePath);

        ctx.drawImage(bgImage, 0, 0, 72, 72);
        ctx.drawImage(bodyImage, 0, 0, 72, 72);
        if (clothesImage)
            ctx.drawImage(clothesImage, 0, 0, 72, 72);
        ctx.drawImage(headImage, 0, 0, 72, 72);
        if (accImage)
            ctx.drawImage(accImage, 0, 0, 72, 72);
        ctx.drawImage(haircutOrHatImage, 0, 0, 72, 72);

        const entityName = uuidv4();

        const fileBuffer = canvas.toBuffer('image/png');
        const uploadedImageFile = await MoralisService.UploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
        const imagePathOnMoralis = uploadedImageFile.data[0].path;

        const metadata = {
            name: `Founders captain (${index}/${maxIndex})`,
            description: 'Founders captain collection of Navy.online.',
            image: imagePathOnMoralis,
            attributes: [
                { miningRewardNVY: captainStats.miningRewardNVY },
                { stakingRewardNVY: captainStats.stakingRewardNVY },
                { traits: captainStats.traits },
                { level: captainStats.level },
                { rarity: captainStats.rarity }
            ]
        }

        const uploadedMetadataFile = await MoralisService.UploadFile('nvy/' + entityName + '.json', Buffer.from(JSON.stringify(metadata)).toString('base64')) as any;
        const metadataPathOnMoralis = uploadedMetadataFile.data[0].path;

        return metadataPathOnMoralis as string;
    }

}