<template>
	<header>
		<div :class="$style['wrapper']">
			<div :class="$style['settings']">
				<div :class="$style['group']">
					<div :class="$style['icon']">&#128073;</div>
					<Select
						:default="getSelected"
						:options="options"
						fill
						size="small"
						:search="text.search"
						@input="handlerSelect" />
				</div>
				<Switch
					:value="settings.subtitleEnabled"
					:label="text.subtitleEnabled"
					@input="changeSetting('subtitleEnabled')" />
				<Switch
					:value="settings.originalEnabled"
					:disabled="!settings.subtitleEnabled"
					:label="text.originalEnabled"
					@input="changeSetting('originalEnabled')" />
				<Slider
					:value="settings.subtitleSize"
					:disabled="!settings.subtitleEnabled"
					icon="&#11021;"
					icon-row
					@input="handlerSliderSubtitleSize" />
				<Slider
					:value="settings.subtitleWidth"
					:disabled="!settings.subtitleEnabled"
					:min="100"
					:max="1200"
					:step="10"
					icon="&#11020;"
					@input="handlerSliderSubtitleWidth" />
				<Slider
					:value="settings.subtitleOpacity"
					:disabled="!settings.subtitleEnabled"
					:min="0.1"
					:max="1"
					:step="0.1"
					icon="&#9728;"
					icon-row
					@input="handlerSliderSubtitleOpacity" />
			</div>
			<div :class="$style['help']">
				<div :class="$style['text']">
					<span :class="$style['heart']">&#10084;</span>
					Tinkoff
				</div>
				<div :class="$style['bank']">2200 7009 3056 2839</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import type { Text } from '../types/types.content';
import { computed, onMounted, ref, watch } from 'vue';
import Switch from '@src/components/Switch.vue';
import Select from '@src/components/Select.vue';
import Slider from '@src/components/Slider.vue';
import lodash from 'lodash';

const configDefault = {
	search: 'Search',
	subtitleEnabled: 'Enable translator',
	originalEnabled: 'Show original',
}

const text = ref<Text>({
	search: configDefault.search,
	subtitleEnabled: configDefault.subtitleEnabled,
	originalEnabled: configDefault.originalEnabled,
});

const settings = ref({
	subtitleEnabled: false,
	originalEnabled: true,
	targetLanguage: 'ru',
	subtitleSize: 16,
	subtitleWidth: 324,
	subtitleOpacity: 0.8,
});

const options = ref([
	{ value: 'ru', name: 'Russian' },
	{ value: 'af', name: 'Afrikaans' },
	{ value: 'sq', name: 'Albanian' },
	{ value: 'am', name: 'Amharic' },
	{ value: 'ar', name: 'Arabic' },
	{ value: 'hy', name: 'Armenian' },
	{ value: 'as', name: 'Assamese' },
	{ value: 'ay', name: 'Aymara' },
	{ value: 'az', name: 'Azerbaijani' },
	{ value: 'bm', name: 'Bambara' },
	{ value: 'eu', name: 'Basque' },
	{ value: 'be', name: 'Belarusian' },
	{ value: 'bn', name: 'Bengali' },
	{ value: 'bho', name: 'Bhojpuri' },
	{ value: 'bs', name: 'Bosnian' },
	{ value: 'bg', name: 'Bulgarian' },
	{ value: 'ca', name: 'Catalan' },
	{ value: 'ceb', name: 'Cebuano' },
	{ value: 'zh-CN', name: 'Chinese (Simplified)' },
	{ value: 'zh-TW', name: 'Chinese (Traditional)' },
	{ value: 'co', name: 'Corsican' },
	{ value: 'hr', name: 'Croatian' },
	{ value: 'cs', name: 'Czech' },
	{ value: 'da', name: 'Danish' },
	{ value: 'dv', name: 'Dhivehi' },
	{ value: 'doi', name: 'Dogri' },
	{ value: 'nl', name: 'Dutch' },
	{ value: 'en', name: 'English' },
	{ value: 'eo', name: 'Esperanto' },
	{ value: 'et', name: 'Estonian' },
	{ value: 'ee', name: 'Ewe' },
	{ value: 'fil', name: 'Filipino (Tagalog)' },
	{ value: 'fi', name: 'Finnish' },
	{ value: 'fr', name: 'French' },
	{ value: 'fy', name: 'Frisian' },
	{ value: 'gl', name: 'Galician' },
	{ value: 'ka', name: 'Georgian' },
	{ value: 'de', name: 'German' },
	{ value: 'el', name: 'Greek' },
	{ value: 'gn', name: 'Guarani' },
	{ value: 'gu', name: 'Gujarati' },
	{ value: 'ht', name: 'Haitian Creole' },
	{ value: 'ha', name: 'Hausa' },
	{ value: 'haw', name: 'Hawaiian' },
	{ value: 'he', name: 'Hebrew' },
	{ value: 'hi', name: 'Hindi' },
	{ value: 'hmn', name: 'Hmong' },
	{ value: 'hu', name: 'Hungarian' },
	{ value: 'is', name: 'Icelandic' },
	{ value: 'ig', name: 'Igbo' },
	{ value: 'ilo', name: 'Ilocano' },
	{ value: 'id', name: 'Indonesian' },
	{ value: 'ga', name: 'Irish' },
	{ value: 'it', name: 'Italian' },
	{ value: 'ja', name: 'Japanese' },
	{ value: 'jv', name: 'Javanese' },
	{ value: 'kn', name: 'Kannada' },
	{ value: 'kk', name: 'Kazakh' },
	{ value: 'km', name: 'Khmer' },
	{ value: 'rw', name: 'Kinyarwanda' },
	{ value: 'gom', name: 'Konkani' },
	{ value: 'ko', name: 'Korean' },
	{ value: 'kri', name: 'Krio' },
	{ value: 'ku', name: 'Kurdish' },
	{ value: 'ckb', name: 'Kurdish (Sorani)' },
	{ value: 'ky', name: 'Kyrgyz' },
	{ value: 'lo', name: 'Lao' },
	{ value: 'la', name: 'Latin' },
	{ value: 'lv', name: 'Latvian' },
	{ value: 'ln', name: 'Lingala' },
	{ value: 'lt', name: 'Lithuanian' },
	{ value: 'lg', name: 'Luganda' },
	{ value: 'lb', name: 'Luxembourgish' },
	{ value: 'mk', name: 'Macedonian' },
	{ value: 'mai', name: 'Maithili' },
	{ value: 'mg', name: 'Malagasy' },
	{ value: 'ms', name: 'Malay' },
	{ value: 'ml', name: 'Malayalam' },
	{ value: 'mt', name: 'Maltese' },
	{ value: 'mi', name: 'Maori' },
	{ value: 'mr', name: 'Marathi' },
	{ value: 'mni-Mtei', name: 'Meiteilon (Manipuri)' },
	{ value: 'lus', name: 'Mizo' },
	{ value: 'mn', name: 'Mongolian' },
	{ value: 'my', name: 'Myanmar (Burmese)' },
	{ value: 'ne', name: 'Nepali' },
	{ value: 'no', name: 'Norwegian' },
	{ value: 'ny', name: 'Nyanja (Chichewa)' },
	{ value: 'or', name: 'Odia (Oriya)' },
	{ value: 'om', name: 'Oromo' },
	{ value: 'ps', name: 'Pashto' },
	{ value: 'fa', name: 'Persian' },
	{ value: 'pl', name: 'Polish' },
	{ value: 'pt', name: 'Portuguese (Portugal, Brazil)' },
	{ value: 'pa', name: 'Punjabi' },
	{ value: 'qu', name: 'Quechua' },
	{ value: 'ro', name: 'Romanian' },
	{ value: 'sm', name: 'Samoan' },
	{ value: 'sa', name: 'Sanskrit' },
	{ value: 'gd', name: 'Scots Gaelic' },
	{ value: 'nso', name: 'Sepedi' },
	{ value: 'sr', name: 'Serbian' },
	{ value: 'st', name: 'Sesotho' },
	{ value: 'sn', name: 'Shona' },
	{ value: 'sd', name: 'Sindhi' },
	{ value: 'si', name: 'Sinhala (Sinhalese)' },
	{ value: 'sk', name: 'Slovak' },
	{ value: 'sl', name: 'Slovenian' },
	{ value: 'so', name: 'Somali' },
	{ value: 'es', name: 'Spanish' },
	{ value: 'su', name: 'Sundanese' },
	{ value: 'sw', name: 'Swahili' },
	{ value: 'sv', name: 'Swedish' },
	{ value: 'tl', name: 'Tagalog (Filipino)' },
	{ value: 'tg', name: 'Tajik' },
	{ value: 'ta', name: 'Tamil' },
	{ value: 'tt', name: 'Tatar' },
	{ value: 'te', name: 'Telugu' },
	{ value: 'th', name: 'Thai' },
	{ value: 'ti', name: 'Tigrinya' },
	{ value: 'ts', name: 'Tsonga' },
	{ value: 'tr', name: 'Turkish' },
	{ value: 'tk', name: 'Turkmen' },
	{ value: 'ak', name: 'Twi (Akan)' },
	{ value: 'uk', name: 'Ukrainian' },
	{ value: 'ur', name: 'Urdu' },
	{ value: 'ug', name: 'Uyghur' },
	{ value: 'uz', name: 'Uzbek' },
	{ value: 'vi', name: 'Vietnamese' },
	{ value: 'cy', name: 'Welsh' },
	{ value: 'xh', name: 'Xhosa' },
	{ value: 'yi', name: 'Yiddish' },
	{ value: 'yo', name: 'Yoruba' },
	{ value: 'zu', name: 'Zulu' }
]);
const selected = ref(options.value[0] as any);
const getSelected = computed(() => selected);

const handlerSelect = lodash.debounce((event: any) => {
	selected.value = event;
	const newSettingValue = event?.value ?? 'ru';
	chrome.storage.sync.set({ targetLanguage: newSettingValue }, () => {
		settings.value.targetLanguage = newSettingValue;
	});
}, 1000);

const handlerSliderSubtitleSize = lodash.debounce((event: any) => {
	const newSettingValue = event ?? 16;
	chrome.storage.sync.set({ subtitleSize: newSettingValue }, () => {
		settings.value.subtitleSize = newSettingValue;
	});
}, 1000);

const handlerSliderSubtitleWidth = lodash.debounce((event: any) => {
	const newSettingValue = event ?? 16;
	chrome.storage.sync.set({ subtitleWidth: newSettingValue }, () => {
		settings.value.subtitleWidth = newSettingValue;
	});
}, 1000);

const handlerSliderSubtitleOpacity = lodash.debounce((event: any) => {
	const newSettingValue = event ?? 16;
	chrome.storage.sync.set({ subtitleOpacity: newSettingValue }, () => {
		settings.value.subtitleOpacity = newSettingValue;
	});
}, 1000);

const translate = async(text: string) => {
	const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${settings.value.targetLanguage}&dt=t&q=${encodeURI(text)}`

	try {
		const response: Response = await fetch(url);
		const data = await response.json();
		return decodeURI(data[0][0][0]);
	} catch (error) {
		console.error(error);
		return '';
	}
}

const translateSettings = () => {
	if (settings.value.targetLanguage) {
		Object.entries(configDefault).forEach(([key, value]) => {
			translate(value).then((response) => {
				text.value[key as keyof Text] = response;
			});
		});
	}
}

watch(() => settings.value.targetLanguage, () => {
	translateSettings();
});

onMounted(() => {
	translateSettings();
});

const changeSetting = (prop: string) => {
	const newSettingValue = !(settings.value as any)[prop];
	chrome.storage.sync.set({ [prop]: newSettingValue }, function() {
		(settings.value as any)[prop] = newSettingValue;
	});
}

chrome.storage.sync.get(
	Object.keys(settings.value),
	({ subtitleEnabled, originalEnabled, targetLanguage, subtitleSize, subtitleWidth, subtitleOpacity }) => {
	settings.value.subtitleEnabled = subtitleEnabled;
	settings.value.originalEnabled = originalEnabled;
	settings.value.targetLanguage = targetLanguage;
	settings.value.subtitleOpacity = subtitleOpacity;
	settings.value.subtitleWidth = subtitleWidth;
	settings.value.subtitleSize = subtitleSize;

	const currentTargetLanguage = options.value?.find((lang) => lang.value === targetLanguage);
	if (currentTargetLanguage) {
		selected.value = currentTargetLanguage;
	}
});

chrome.storage.onChanged.addListener(function (changes) {
	const { subtitleEnabled, originalEnabled, targetLanguage, subtitleSize, subtitleWidth, subtitleOpacity } = changes;
	if (subtitleEnabled) {
		settings.value.subtitleEnabled = Boolean(subtitleEnabled.newValue);
	}
	if (originalEnabled) {
		settings.value.originalEnabled = Boolean(originalEnabled.newValue);
	}
	if (targetLanguage) {
		settings.value.targetLanguage = targetLanguage.newValue;
	}
	if (subtitleOpacity) {
		settings.value.subtitleOpacity = subtitleOpacity.newValue;
	}
	if (subtitleWidth) {
		settings.value.subtitleWidth = subtitleWidth.newValue;
	}
	if (subtitleSize) {
		settings.value.subtitleSize = subtitleSize.newValue;
	}
});

</script>


<style lang="scss" module>
.group {
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 4px;
}

.icon {
	font-size: 24px;
	margin-bottom: 4px;
	user-select: none;
}

.settings {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 10px;
}

.help {
	padding: 4px 20px;
	font-weight: 600;
	background: #eee;
	display: flex;
	gap: 10px;
	justify-content: center;
	border-radius: 4px;

	.heart {
		user-select: none;
		color: red;
		font-size: 18px;
		vertical-align: sub;
	}
}

</style>
