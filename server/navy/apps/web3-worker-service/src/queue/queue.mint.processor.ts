import { WorkersMint } from "@app/shared-library/workers/workers.mint";
import { Process, Processor } from "@nestjs/bull";

@Processor(WorkersMint.MintQueue)
export class QueueMintProcessor {

    @Process()
    async process() {

    }

}