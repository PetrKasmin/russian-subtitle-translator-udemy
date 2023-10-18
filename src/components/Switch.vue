<template>
  <label class="switch">
    <input type="checkbox" :checked="value" @change="updateValue">
    <span class="slider"></span>
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
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

<style scoped>
.switch {
  cursor: pointer;
  position: relative;
  display: flex;
  height: 22px;
  align-items: center;
  font-size: 14px;
}

.switch input {
  opacity: 0;
  width: 40px;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  width: 36px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
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

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(13px);
}
</style>
