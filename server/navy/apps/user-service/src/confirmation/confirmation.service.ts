import { SharedLibraryService } from '@app/shared-library';
import { ConfirmationCode, ConfirmationCodeDocument } from '@app/shared-library/schemas/schema.confirmation.code';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export enum ConfirmationResult {
    MATCH,
    MISSMATCH,
    EXPIRED
}

@Injectable()
export class ConfirmationService {

    private readonly CodeLength = 5;
    private readonly MaxCheckAttempts = 4;
    private readonly CodeMinutesTTL = 15;

    constructor(@InjectModel(ConfirmationCode.name) private confirmationCodeModel: Model<ConfirmationCodeDocument>) {
    }

    async generateNewCode(email: string) {
        let code = '';
        for (let i = 0; i < this.CodeLength; i++) {
            code += SharedLibraryService.GetRandomIntInRange(0, 9);
        }
        const newCode = new this.confirmationCodeModel();
        newCode.code = code;
        newCode.email = email;
        newCode.attemptsLeft = this.MaxCheckAttempts;
        newCode.expirationDate = new Date(Date.now() + this.CodeMinutesTTL * 60000);
        return await newCode.save();
    }

    async checkCode(email: string, code: string) {
        let result = ConfirmationResult.EXPIRED;
        const codeByEmail = await this.confirmationCodeModel.findOne({ email }).sort([['expirationDate', -1]]);
        if (codeByEmail) {
            if (codeByEmail.attemptsLeft - 1 >= 0) {
                codeByEmail.attemptsLeft--;
                if (code == codeByEmail.code) {
                    result = ConfirmationResult.MATCH;
                    codeByEmail.attemptsLeft = 0;
                } else {
                    result = ConfirmationResult.MISSMATCH;
                }
                await codeByEmail.save();
            }
        }
        return result;
    }
}