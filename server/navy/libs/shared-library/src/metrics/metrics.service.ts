
import { Injectable } from '@nestjs/common';
import { PrometheusService } from "./prometheus/prometheus.service";

@Injectable()
export class MetricsService {
    public get metrics(): Promise<string> {
        return this.prometheusService.metrics;
    }

    constructor(private prometheusService: PrometheusService) { }

    public registerGauge(name: string, help: string) {
        this.prometheusService.registerGauge(name, help);
    }

    public setGaugeValue(name: string, value: number) {
        this.prometheusService.setGaugeValue(name, value);
    }
}