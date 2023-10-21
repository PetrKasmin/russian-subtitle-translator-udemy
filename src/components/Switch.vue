<template>
	<label :class="[$style['switch'], { [$style['disabled']]: disabled }]">
		<input
			type="checkbox"
			:checked="value"
			:disabled="disabled"
			@change="updateValue">
		<span :class="$style['slider']" />
		<span :class="$style['label']">{{ label }}</span>
	</label>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		}
	},
	methods: {
		updateValue(event) {
			this.$emit('input', event.target.checked);
		}
	}
}
</script>

<style module lang="scss">
.switch {
	position: relative;
	display: flex;
	align-items: center;

	height: 22px;
	font-size: 13px;
	user-select: none;

	input {
		opacity: 0;
		width: 46px;
		height: 0;

		&:checked + .slider {
			background-color: #3d7dff;
		}

		&:focus + .slider {
			box-shadow: 0 0 1px #3d7dff;
		}

		&:hover  + .slider{
			opacity: 0.8;
		}

		&:checked + .slider:before {
			transform: translateX(22px);
		}

		&:disabled {
			&:checked + .slider {
				background-color: #737171;
			}
		}
	}

	.label {
		cursor: pointer;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		width: 44px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 34px;

		&:before {
			position: absolute;
			content: "";
			height: 14px;
			width: 14px;
			left: 4px;
			bottom: 4px;
			background-color: white;
			transition: .4s;
			border-radius: 50%;
		}
	}

	&.disabled {
		.slider {
			opacity: 0.6;
			cursor: default;
		}

		.label {
			cursor: default;
		}
	}
}

</style>
