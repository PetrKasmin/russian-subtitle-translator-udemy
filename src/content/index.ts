import Service from '../services/service.content';
import type { Config, API, Settings, Params } from '../types/types.content';

const service: Service = new Service({
    api: {
        baseUrl: 'https://translate.googleapis.com/translate_a/single',
        params: {
            client: 'gtx',
            sl: 'auto',
            tl: '',
            dt: 't',
            q: '',
        } as Params,
    } as API,
    config: {
        boxSelector: 'captions-display--captions-container',
        textSelector: 'captions-display--captions-cue-text',
        videoSelector: '.vjs-tech',
    } as Config,
    settings: {
        subtitleEnabled: false,
        originalEnabled: true,
        targetLanguage: 'ru',
        subtitleOpacity: 0.8,
        subtitleWidth: 324,
        subtitleSize: 16,
    } as Settings,
});

service.init();

export {};
