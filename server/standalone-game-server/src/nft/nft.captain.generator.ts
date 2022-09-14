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
        const haircut4ImagePath = __dirname.split('dist')[0] + 'assets\\captain\\haircuts\\haircuts_4.png';

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

        let bgIndex = 1;
        let accIndex = 1;
        let headIndex = 1;
        let haircutOrHatIndex = 1;
        let clothesIndex = 1;

        // Background random 
        let bgImagePath = bg1ImagePath;
        const bgRnd1 = RandomService.GetRandomIntInRange(1, 100);

        if (100 - this.RareBgChance < bgRnd1) {
            const bgRnd2 = RandomService.GetRandomIntInRange(1, 4);
            bgIndex = bgRnd2;
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
            bgIndex = bgRnd2;
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
            clothesIndex = 1;
            clothesImagePath = clothes1ImagePath;
        } else if (100 - this.Clothes2Chance < clothesRnd) {
            clothesIndex = 2;
            clothesImagePath = clothes2ImagePath;
        } else if (100 - this.Clothes3Chance < clothesRnd) {
            clothesIndex = 3;
            clothesImagePath = clothes3ImagePath;
        } else if (100 - this.Clothes4Chance < clothesRnd) {
            clothesIndex = 4;
            clothesImagePath = clothes4ImagePath;
        } else if (100 - this.Clothes5Chance < clothesRnd) {
            clothesIndex = 5;
            clothesImagePath = clothes5ImagePath;
        } else if (100 - this.Clothes6Chance < clothesRnd) {
            clothesIndex = 6;
            clothesImagePath = clothes6ImagePath;
        }

        // Head random
        let headImagePath = head1ImagePath;
        const headRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.Head1Chance < headRnd) {
            headIndex = 1;
            headImagePath = head1ImagePath;
        } else if (100 - this.Head2Chance < headRnd) {
            headIndex = 2;
            headImagePath = head2ImagePath;
        } else if (100 - this.Head3Chance < headRnd) {
            headIndex = 3;
            headImagePath = head3ImagePath;
        } else if (100 - this.Head4Chance < headRnd) {
            headIndex = 4;
            headImagePath = head4ImagePath;
        }

        // Add random
        let accImagePath;
        const accRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.Acc1Chance < accRnd) {
            accIndex = 1;
            accImagePath = acc1ImagePath;
        } else if (100 - this.Acc2Chance < accRnd) {
            accIndex = 2;
            accImagePath = acc2ImagePath;
        } else if (100 - this.Acc3Chance < accRnd) {
            accIndex = 3;
            accImagePath = acc3ImagePath;
        } else if (100 - this.Acc4Chance < accRnd) {
            accIndex = 4;
            accImagePath = acc4ImagePath;
        } else if (100 - this.Acc5Chance < accRnd) {
            accIndex = 5;
            accImagePath = acc5ImagePath;
        }

        // Haircut or hat random
        let haircutOrHatImagePath = haircut3ImagePath;
        haircutOrHatIndex = 3;
        const haircutOrHatRnd = RandomService.GetRandomIntInRange(1, 100);
        if (100 - this.HairOrHat1Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 1;
            haircutOrHatImagePath = haircut1ImagePath;
        } else if (100 - this.HairOrHat2Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 2;
            haircutOrHatImagePath = haircut2ImagePath;
        } else if (100 - this.HairOrHat3Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 4;
            haircutOrHatImagePath = haircut4ImagePath;
        } else if (100 - this.HairOrHat4Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 5;
            haircutOrHatImagePath = hat1ImagePath;
        } else if (100 - this.HairOrHat5Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 6;
            haircutOrHatImagePath = hat2ImagePath;
        } else if (100 - this.HairOrHat6Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 7;
            haircutOrHatImagePath = hat3ImagePath;
        } else if (100 - this.HairOrHat7Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 8;
            haircutOrHatImagePath = hat4ImagePath;
        } else if (100 - this.HairOrHat8Chance < haircutOrHatRnd) {
            haircutOrHatIndex = 9;
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
                { rarity: captainStats.rarity },
                { bg: bgIndex },
                { acc: accIndex },
                { head: headIndex },
                { haircutOrHat: haircutOrHatIndex },
                { clothes: clothesIndex }
            ]
        }

        const uploadedMetadataFile = await MoralisService.UploadFile('nvy/' + entityName + '.json', Buffer.from(JSON.stringify(metadata)).toString('base64')) as any;
        const metadataPathOnMoralis = uploadedMetadataFile.data[0].path;

        return metadataPathOnMoralis as string;
    }

}