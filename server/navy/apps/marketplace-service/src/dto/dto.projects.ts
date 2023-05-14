export interface ProjectCollection {
    contractAddress: string;
    chainId: string;
    name: string;
}

export interface ProjectDto {
    name: string;
    active: boolean;
    state: string;
    collections: ProjectCollection[];
}