import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Module({
    imports: [],
    controllers: [],
    providers: [PrometheusService],
    exports: [PrometheusService]
})
export class PrometheusModule { }