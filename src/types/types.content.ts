export interface Settings {
    subtitleEnabled: boolean;
    originalEnabled: boolean;
    targetLanguage: string;
    subtitleOpacity: number;
    subtitleWidth: number;
    subtitleSize: number;
}

export interface Config {
    boxSelector: string;
    textSelector: string;
}

export interface Params {
    client: string;
    sl: string;
    tl: string;
    dt: string;
    q: string;
}

export interface API {
    baseUrl: string;
    params: Params;
}

export interface Text {
    search: string;
    subtitleEnabled: string;
    originalEnabled: string;
}