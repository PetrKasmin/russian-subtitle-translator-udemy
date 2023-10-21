<template>
	<div :class="$style['root']">
		<label
			v-if="!!label"
			:class="$style['label']">
			{{ label }}
		</label>
		<div
			:class="{
                [$style['select']]: true,
                [$style[size]]: size,
                [$style['disabled']]: disabled,
                [$style['fill']]: fill,
            }"
			:tabindex="tabindex"
			@blur="onBlur"
			@click.stop>
			<div
				:class="{
                    [$style['selected']]: true,
                    [$style['open']]: open,
                }"
				@click="onOpen">
				{{ selected?.label ?? selected?.name ?? '' }}
			</div>
			<div
				:class="{
                    [$style['items']]: true,
                    [$style['hide']]: !open,
                }"
				@click.stop>
				<div :class="$style['search-wrap']">
					<input
						v-if="open"
						v-model="searchTerm"
						type="text"
						:placeholder="`${search}...`"
						:class="$style['search']"
						@click.stop>
					<div
						v-if="searchTerm"
						:class="$style['search-clear']"
						@click="searchTerm = ''"/>
				</div>
				<div :class="$style['inner']">
					<template v-if="filteredOptions.length">
						<div
							v-for="(option, index) of filteredOptions"
							:key="index"
							:class="{
                                [$style['item']]: true,
                                [$style['disabled']]: option === selected,
                            }"
							@click="onClick(option)">
							{{ option?.label ?? option?.name ?? '' }}
						</div>
					</template>
					<div v-else :class="$style['empty']">
						¯ \ _ (ツ) _ / ¯
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

const props = defineProps({
	options: {
		type: Array,
		required: true,
	},
	tabindex: {
		type: Number,
		default: 0,
	},
	default: {
		type: Object,
		default: () => ({}),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String,
		default: 'medium',
	},
	fill: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: '',
	},
	search: {
		type: String,
		default: 'Search',
	},
});

const emit = defineEmits<{
	(e: 'input', value: any): void
	(e: 'cardHold'): void
	(e: 'cardDrop'): void
}>();

const selected = ref(props.default
	? props.default
	: (props.options.length > 0
			? props.options[0]
			: null
	),
);
const open = ref(false);

const searchTerm = ref('');

const filteredOptions = computed(() => {
	return props.options.filter((option: any) => {
		const label = option?.label || option?.name || '';
		return label.toLowerCase().includes(searchTerm.value.toLowerCase());
	});
});

const handlerInput = (option: any) => {
	emit('input', option);
};

const onClick = (option: any) => {
	if (props.disabled) { return; }

	selected.value = option;
	open.value = false;
	handlerInput(option);
};

const onBlur = (e: any) => {
	if (props.disabled) { return; }

	if (!e.currentTarget.contains(e.relatedTarget)) {
		open.value = false;
	}
};

const onOpen = () => {
	if (props.disabled) { return; }
	open.value = !open.value;
};

onMounted(() => {
	// handlerInput(selected);
});

</script>

<style module lang="scss">
.root {
	display: inline-block;
}

.search-wrap {
	.search {
		width: 100%;
		padding: 6px 11px 5px;
		border: 1px solid #e8e8ed;
		border-radius: 4px;
		margin: 0 0 6px;
		z-index: 200;
		box-sizing: border-box;
		font-size: 12px;
		outline: none;

		&:focus {
			box-shadow: 0 0 0 3px #ebebfc;
		}
	}

	.search-clear {
		position: absolute;
		top: 3px;
		right: 10px;
		cursor: pointer;
		color: #A7ACBC;

		&:hover {
			color: #444444;
		}

		&:after {
			content: "\00D7";
			width: 10px;
			height: 10px;
			font-size: 20px;
		}
	}
}

.empty {
	text-align: center;
}

.select {
	color: #000;
	position: relative;
	min-width: 148px;
	text-align: left;
	outline: none;
	font-size: 12px;

	&.fill {
		display: block;
		width: 100px;
	}

	&.disabled {
		cursor: default;
		color: #A7ACBC;

		.selected {
			background: #e8e8ed;

			&:hover {
				border-color: #e8e8ed;
			}

			&:after {
				top: 15px;
			}
		}
	}
}

.selected {
	cursor: pointer;
	user-select: none;
	padding: 3px 32px 4px 11px;
	border-radius: 4px;
	background-color: #ffffff;
	border: 1px solid #e8e8ed;
	transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;

	&:hover {
		border-color: #A7ACBC;
	}

	&.open {
		border-color: #A7ACBC;
		box-shadow: 0 0 0 3px #ebebfc;

		&:after {
			border-color: transparent transparent #A7ACBC transparent;
			top: 10px;
		}
	}

	&:after {
		position: absolute;
		content: "";
		top: 15px;
		right: 10px;
		width: 0;
		height: 0;
		border: 4px solid;
		border-color: #e8e8ed transparent transparent transparent;
	}
}

.items {
	position: absolute;
	left: 0;
	right: 0;
	z-index: 100;
	margin-top: 8px;
	background-color: #fff;
	border-radius: 4px;
	border: 1px solid #e8e8ed;
	padding: 6px;
	box-shadow: 2px 2px 10px 0px #00000026;

	.inner {
		max-height: 170px;
		overflow-y: auto;
	}
}

.item {
	cursor: pointer;
	user-select: none;
	padding: 1px 22px 2px 12px;
	transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
	margin-right: 6px;
	border-radius: 4px;

	&:hover {
		background-color: #E4E4F1;
	}

	&.disabled {
		cursor: default;
		color: #A7ACBC;
		background: #e8e8ed;
	}
}

.hide {
	display: none;
}

</style>
