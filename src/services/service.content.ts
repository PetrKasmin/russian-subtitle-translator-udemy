import type { Config, API, Settings } from '../types/types.content';

export default class Service {
    protected api: API;
    public config: Config;
    public settings: Settings;

    private textElement: HTMLDivElement | null | undefined;
    private transElement: HTMLDivElement | null | undefined;

    private transNode: HTMLDivElement | null | undefined;
    private originNode: HTMLDivElement | null | undefined;

    private observer: MutationObserver | null | undefined;

    constructor({ api, config, settings }: { api: API, config: Config, settings: Settings }) {
        this.api = api;
        this.config = config;
        this.settings = settings;
    }

    toggleDisplayNode (node: HTMLDivElement | null, show: boolean) {
        if (node) {
            node.style.display = show
                ? 'block'
                : 'none';
        }
    }

    getTextFromNode (node: HTMLDivElement): string {
        return node.textContent?.replaceAll('\n', ' ').trim() ?? '';
    }

    applyTranslation(textElement: HTMLDivElement, transElement: HTMLDivElement) {
        const originalText: string = this.getTextFromNode(textElement);

        this.translate(originalText)
            .then((translatedText) => {
                transElement.innerHTML = '';
                transElement.style.width = `${this.settings.subtitleWidth}px`;
                transElement.style.maxWidth = '100%';
                transElement.style.borderRadius = '4px';
                transElement.style.opacity = String(this.settings.subtitleOpacity);

                this.transNode = document.createElement('div');
                this.transNode.textContent = translatedText;
                this.transNode.style.fontSize = `${this.settings.subtitleSize}px`;
                this.transNode.style.color = '#fff';
                this.transNode.style.lineHeight = '1.3';

                this.originNode = document.createElement('div');
                this.originNode.textContent = originalText;
                this.originNode.style.fontSize = `${this.settings.subtitleSize - 5}px`;
                this.originNode.style.color = '#ccc';
                this.originNode.style.lineHeight = '1.3';

                this.toggleDisplayNode(this.originNode, this.settings.originalEnabled)

                transElement.append(this.originNode);
                transElement.append(this.transNode);
            })
            .catch(error => {
                console.error(error);
            });
    }

    startTranslate = (): void => {
        this.textElement = document.querySelector(`[class^=${this.config.textSelector}]`) as HTMLDivElement;
        if (this.textElement) {
            this.toggleDisplayNode(this.textElement, false);

            this.transElement = document.createElement('div');

            this.textElement.classList.forEach((cl: string): void => {
                this.transElement?.classList.add(cl);
            });
            this.textElement.parentNode?.appendChild(this.transElement);

            this.applyTranslation(this.textElement as HTMLDivElement, this.transElement as HTMLDivElement);

            this.observer = new MutationObserver((mutations: MutationRecord[]): void => {
                mutations.forEach((mutation: MutationRecord): void => {
                    this.applyTranslation(mutation.target as HTMLDivElement, this.transElement as HTMLDivElement);
                });
            });

            this.observer.observe(this.textElement, {
                characterData: true,
                childList: true,
                subtree: true,
            });
        }
    }

    awaitRender() {
        const awaitRenderSelector: string = this.config.boxSelector;
        const startTranslate = this.startTranslate;
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const divHTML: HTMLDivElement = mutation.target as HTMLDivElement;
                if (divHTML?.classList?.value.includes(awaitRenderSelector)) {
                    startTranslate();
                    observer.disconnect();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init() {
        chrome.storage.sync.get(Object.keys(this.settings), (data): void => {
            this.settings.subtitleEnabled = data.subtitleEnabled;
            this.settings.originalEnabled = data.originalEnabled;
            this.settings.targetLanguage = data.targetLanguage;
            this.settings.subtitleOpacity = data.subtitleOpacity;
            this.settings.subtitleWidth = data.subtitleWidth;
            this.settings.subtitleSize = data.subtitleSize;

            if (this.settings.subtitleEnabled) {
                this.awaitRender();
            }
        });

        chrome.storage.onChanged.addListener((changes): void => {
            const {
                subtitleEnabled,
                originalEnabled,
                targetLanguage,
                subtitleOpacity,
                subtitleWidth,
                subtitleSize,
            } = changes;

            if (subtitleEnabled) {
                this.settings.subtitleEnabled = Boolean(subtitleEnabled.newValue)
                this.restart();
            }
            if (targetLanguage) {
                this.settings.targetLanguage = targetLanguage.newValue;
                this.restart();
            }
            if (subtitleSize) {
                this.settings.subtitleSize = subtitleSize.newValue;
                this.restart();
            }
            if (subtitleWidth) {
                this.settings.subtitleWidth = subtitleWidth.newValue;
                this.restart();
            }
            if (subtitleOpacity) {
                this.settings.subtitleOpacity = subtitleOpacity.newValue;
                this.restart();
            }
            if (originalEnabled) {
                this.settings.originalEnabled = Boolean(originalEnabled.newValue);
                this.toggleDisplayNode(this.originNode as HTMLDivElement, this.settings.originalEnabled);
            }
        });
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.textElement) {
            this.toggleDisplayNode(this.textElement, true);
            this.transElement?.remove();
        }
    }

    restart() {
        this.disconnect();

        if (this.settings.subtitleEnabled) {
            this.startTranslate();
        }
    }

    createApiUrl(): string {
        const url: URL = new URL(this.api.baseUrl);
        url.search = new URLSearchParams(this.api.params as unknown as Record<string, string>).toString();
        return url.href;
    }

    initParams(q: string): void {
        this.api.params.q = encodeURI(q);
        this.api.params.tl = this.settings.targetLanguage;
    }

    async translate(text: string) {
        this.initParams(text);

        try {
            const response: Response = await fetch(this.createApiUrl());
            const data = await response.json();
            return decodeURI(data[0][0][0]);
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}