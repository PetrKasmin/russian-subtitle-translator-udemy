interface Runtime {
    subtitleEnabled: boolean;
    originalEnabled: boolean;

    observer: MutationObserver | null;
    textElement: HTMLDivElement | null;
    transElement: HTMLDivElement | null;
    originNode: HTMLDivElement | null;
    transNode: HTMLDivElement | null;

    getTextFromNode: Function;
    toggleDisplayNode: Function;
}

const settings = {
    subtitleEnabled: false,
    originalEnabled: true,
};

const keys: string[] = Object.keys(settings);

const runtime: Runtime = {
    ...settings,
    observer: null,
    textElement: null,
    transElement: null,
    transNode: null,
    originNode: null,

    getTextFromNode: (node: HTMLDivElement): string => {
        return node.textContent?.replaceAll('\n', ' ').trim() ?? ''
    },
    toggleDisplayNode: (node: HTMLDivElement | null, show: boolean): void => {
        if (node) {
            node.style.display = show
                ? 'block'
                : 'none';
        }
    },
} as Runtime;

async function translateText(text: string, targetLanguage: string = 'ru'): Promise<any> {
    try {
        const response: Response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`
        );
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error(`Error API: ${error}`);
        return '';
    }
}

function applyTranslation(textElement: HTMLDivElement, transElement: HTMLDivElement): void {
    const originalText: string = runtime.getTextFromNode(textElement);

    translateText(originalText)
        .then(translatedText => {
            // console.log({ originalText, translatedText });

            transElement.innerHTML = ''

            runtime.transNode = document.createElement('div');
            runtime.transNode.textContent = translatedText
            runtime.transNode.style.fontSize = '16px';
            runtime.transNode.style.color = '#fff';

            runtime.originNode = document.createElement('div');
            runtime.originNode.textContent = originalText;
            runtime.originNode.style.fontSize = '12px';
            runtime.originNode.style.color = '#ccc';

            runtime.toggleDisplayNode(runtime.originNode, runtime.originalEnabled)

            transElement.append(runtime.originNode);
            transElement.append(runtime.transNode);
        })
        .catch(error => {
            console.error('Error processing captions:', error);
        });
}

function initTranslation(): void {
    runtime.textElement = document.querySelector('[class^="captions-display--captions-cue-text"]');
    if (runtime.textElement) {

        runtime.toggleDisplayNode(runtime.textElement, false)

        runtime.transElement = document.createElement('div');
        runtime.transElement.style.opacity = '0.75';

        runtime.textElement.classList.forEach((cl: string): void => {
            runtime.transElement?.classList.add(cl);
        })
        runtime.textElement.parentNode?.appendChild(runtime.transElement);

        applyTranslation(runtime.textElement as HTMLDivElement, runtime.transElement as HTMLDivElement);

        runtime.observer = new MutationObserver((mutations: MutationRecord[]): void => {
            mutations.forEach((mutation: MutationRecord): void => {
                applyTranslation(mutation.target as HTMLDivElement, runtime.transElement as HTMLDivElement);
            });
        });

        runtime.observer.observe(runtime.textElement, { characterData: true, childList: true, subtree: true });
    }
}

chrome.storage.onChanged.addListener((changes): void => {
    const {
        subtitleEnabled,
        originalEnabled,
    } = changes;

    if (subtitleEnabled) {
        runtime.subtitleEnabled = Boolean(subtitleEnabled.newValue)
        if (!runtime.subtitleEnabled && runtime.observer) {
            runtime.observer.disconnect();
            runtime.observer = null;

            if (runtime.textElement) {
                runtime.toggleDisplayNode(runtime.textElement, true)
                runtime.transElement?.remove()
            }
        } else if (runtime.subtitleEnabled && !runtime.observer) {
            initTranslation();
        }
    }

    if (originalEnabled) {
        runtime.originalEnabled = Boolean(originalEnabled.newValue)
        runtime.toggleDisplayNode(runtime.originNode, runtime.originalEnabled)
    }
});

chrome.storage.sync.get(keys, (data: any): void => {
    runtime.subtitleEnabled = data.subtitleEnabled;
    runtime.originalEnabled = data.originalEnabled;

    if (runtime.subtitleEnabled) {
        setTimeout((): void => {
            initTranslation();
        }, 5000);
    }
});

export {};
