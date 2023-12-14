export interface Script {
    name: string;
    path: string;
    fileName: string;
}

export interface Language {
    name: string;
    extension: string;
    command: string;
}

export interface Folder {
    id?: string;
    name: string;
    path: string;
}
