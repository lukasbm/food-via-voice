<template>
  <ion-app>
    <ion-nav :root="starterComponent"></ion-nav>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonNav } from "@ionic/vue";
import VoiceInput from "./views/VoiceInput.vue";

const starterComponent = VoiceInput;
</script>
