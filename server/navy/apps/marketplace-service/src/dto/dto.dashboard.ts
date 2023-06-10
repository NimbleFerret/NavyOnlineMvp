export interface PerformanceOnChain {
    chainId: string;
    chainName: string;
    tokenSymbol: string;
    tokenTurnover: number;
    captainsSold: number;
    islandsSold: number;
    shipsSold: number;
}

export interface DashboardDto {
    venomPerformance: PerformanceOnChain;
    cronosPerformance: PerformanceOnChain;
}