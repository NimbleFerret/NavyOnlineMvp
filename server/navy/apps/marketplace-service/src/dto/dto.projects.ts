export interface ProjectCollection {
    contractAddress: string;
    chainName: string;
    name: string;
}

export interface ProjectDto {
    name: string;
    active: boolean;
    state: string;
    collections: ProjectCollection[];
}