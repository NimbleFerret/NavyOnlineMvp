import {
    NotificationService,
    NotificationServiceGrpcClientName,
    NotificationServiceName
} from "@app/shared-library/gprc/grpc.notification.service";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { Faq, FaqDocument } from "@app/shared-library/schemas/marketplace/schema.faq";
import { Feedback, FeedbackDocument } from "@app/shared-library/schemas/marketplace/schema.feedback";
import { Project, ProjectDocument, ProjectState } from "@app/shared-library/schemas/marketplace/schema.project";
import { BadGatewayException, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";
import { lastValueFrom } from "rxjs";
import { FeedbackDto } from "../dto/dto.feedback";
import { ProjectDto, ProjectCollection } from "../dto/dto.projects";

@Injectable()
export class GeneralApiService implements OnModuleInit {

    private notificationService: NotificationService;
    private cronosTokenUsdPrice = 0;

    constructor(
        @InjectModel(Faq.name) private faqModel: Model<FaqDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
        @Inject(NotificationServiceGrpcClientName) private readonly notificationServiceGrpcClient: ClientGrpc
    ) {
    }

    async onModuleInit() {
        this.notificationService = this.notificationServiceGrpcClient.getService<NotificationService>(NotificationServiceName);
        await this.updateCronosTokenUsdPrice();
    }

    async faq() {
        const faq = await this.faqModel.findOne();
        return faq.questionsAndAnswers;
    }

    async feedback(feedbackDto: FeedbackDto) {
        const newFeedback = new this.feedbackModel;
        newFeedback.subject = feedbackDto.subject;
        newFeedback.message = feedbackDto.message;
        newFeedback.from = feedbackDto.from;
        await newFeedback.save();

        // TODO replace by kafka
        await lastValueFrom(this.notificationService.SendEmail({
            recipient: 'hello@navy.online',
            subject: feedbackDto.subject,
            message: feedbackDto.message,
            sender: feedbackDto.from
        }));
    }

    getCronosUsdPrice() {
        return {
            usd: this.cronosTokenUsdPrice
        };
    }

    async getProjects() {
        const result: ProjectDto[] = [];

        const projects = await this.projectModel.find({
            projectState: {
                "$ne": ProjectState.DISABLED
            }
        });

        for (const p of projects) {
            const project: ProjectDto = {
                name: p.name,
                state: p.state,
                active: p.active,
                collections: []
            };

            for (const c of p.collections) {
                const collection = await this.collectionModel.findById(c);
                project.collections.push({
                    name: collection.name,
                    contractAddress: collection.contractAddress,
                    chainId: collection.chainId,
                } as ProjectCollection);
            }

            result.push(project);
        }

        if (result.length == 0) {
            throw new BadGatewayException();
        }

        return result;
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateCronosTokenUsdPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain&vs_currencies=usd');
            const body = await response.json();
            this.cronosTokenUsdPrice = body['crypto-com-chain'].usd;
        } catch (e) {
            Logger.error(e);
        }
    }
}