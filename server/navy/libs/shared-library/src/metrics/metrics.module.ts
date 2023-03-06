
import { Module } from '@nestjs/common';
import { PrometheusModule } from './prometheus/prometheus.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
    imports: [PrometheusModule],
    controllers: [MetricsController],
    providers: [MetricsService],
    exports: [MetricsService]
})
export class MetricsModule { }