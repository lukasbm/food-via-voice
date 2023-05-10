<template>
  <ion-app>
    <ion-nav :root="starterComponent"></ion-nav>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonNav } from "@ionic/vue";
import ProcessStarter from "./views/ProcessStarter.vue";

const starterComponent = ProcessStarter;
</script>
