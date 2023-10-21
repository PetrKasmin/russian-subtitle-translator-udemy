<template>
	<div :class="[$style['slider'], { [$style['disabled']]: disabled }]">
		<div :class="[$style['value'], { [$style['row']]: iconRow }]">
			<div :class="$style['icon']">
				{{ icon }}
			</div>
			<div :class="$style['size']">
				{{ localValue }}
			</div>
		</div>
		<input
			type="range"
			v-model="localValue"
			:min="min"
			:max="max"
			:step="step"
			:disabled="disabled"
			@input="emit('input', localValue)"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
	value: {
		type: Number,
		default: 16,
	},
	min: {
		type: Number,
		default: 11,
	},
	max: {
		type: Number,
		default: 50,
	},
	step: {
		type: Number,
		default: 1,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: String,
		default: '',
	},
	iconRow: {
		type: Boolean,
		default: false,
	},
});

watch(() => props.value, (value) => {
	localValue.value = value;
});

const localValue = ref(props.value as number);

const emit = defineEmits<{
	(e: 'input', value: any): void
}>();
</script>

<style module lang="scss">
.slider {
	margin: 0;
	display: flex;

	.value {
		border-radius: 10px;
		font-size: 12px;
		color: #535353;
		font-weight: 600;
		user-select: none;
		display: flex;
		min-width: 44px;
		flex-direction: column;
		line-height: .7;
		border: 1px solid #ccc;
		text-align: center;
		height: 28px;
		margin-right: 8px;
		gap: 0;

		&.row {
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 2px;
		}

		.icon {
			font-size: 18px;
		}

		.size {

		}
	}

	&.disabled {
		.value {
			opacity: 0.6;
		}
	}

	input[type="range"] {
		width: 100%;
		cursor: pointer;
	}

	input[type="range"]:disabled {
		opacity: 0.6;
		cursor: default;
	}
}


</style>
