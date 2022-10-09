import { Hero, HeroService, WorldServiceGrpcPackage } from "@app/shared-library/gprc/grpc.world.service";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class GrpcService implements OnModuleInit {

    private heroService: HeroService;

    constructor(@Inject('WorldServiceGrpcClient') private readonly worldServiceGrpcClient: ClientGrpc) { }

    async onModuleInit() {
        this.heroService = this.worldServiceGrpcClient.getService<HeroService>('HeroService');
        this.heroService.findOne({ id: 123 }).subscribe({
            next: (hero: Hero) => { console.log(hero); },
            error: (e) => { console.log(e); }
        });
    }

}