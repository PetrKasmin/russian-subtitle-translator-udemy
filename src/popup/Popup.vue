<template>
  <header>
    <div class="wrapper">
      <div class="settings">
        <h3>Субтитры на русском для udemy.com</h3>
<!--        <button @click="changeSetting('subtitleEnabled')">-->
<!--          {{ settings.subtitleEnabled ? 'Выключить перевод' : 'Включить перевод' }}-->
<!--        </button>-->
<!--        <button @click="changeSetting('originalEnabled')">-->
<!--          {{ settings.originalEnabled ? 'Скрывать оригинал' : 'Показывать оригинал' }}-->
<!--        </button>-->
<!--        <br>-->
        <Switch
            :value="settings.subtitleEnabled"
            label="Переводить субтитры на русский"
            @input="changeSetting('subtitleEnabled')" />
        <Switch
            :value="settings.originalEnabled"
            label="Показывать оригинальные субтитры"
            @input="changeSetting('originalEnabled')" />
      </div>
      <div class="help">
        <div class="text">
          <span class="heart">&#9829;</span>
          Тинькофф
        </div>
        <div class="bank">2200 7009 3056 2839</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Switch from '/src/components/Switch.vue';

const settings = ref({
  subtitleEnabled: false,
  originalEnabled: true,
});

const keys = Object.keys(settings.value);

const changeSetting = (prop: string) => {
  const newSettingValue = !(settings.value as any)[prop];
  chrome.storage.sync.set({ [prop]: newSettingValue }, function() {
    (settings.value as any)[prop] = newSettingValue;
  });
}

chrome.storage.sync.get(keys, ({ subtitleEnabled, originalEnabled }) => {
  settings.value.subtitleEnabled = subtitleEnabled;
  settings.value.originalEnabled = originalEnabled;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  const { subtitleEnabled, originalEnabled } = changes;

  if (subtitleEnabled) {
    settings.value.subtitleEnabled = Boolean(subtitleEnabled.newValue);
  }

  if (originalEnabled) {
    settings.value.originalEnabled = Boolean(originalEnabled.newValue);
  }
});

</script>


<style lang="scss" scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

.settings {
  text-align: center;
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.help {
  padding: 0 20px 20px;
  font-weight: 600;
  text-align: right;

  .heart {
    color: red;
    font-size: 18px;
    vertical-align: sub;
  }

  .text {

  }

  .bank {

  }
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
