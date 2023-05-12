<template>
  <ion-app>
    <ion-nav
      id="processNav"
      :root="starterComponent"
      :swipe-gesture="true"
    ></ion-nav>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonNav } from "@ionic/vue";
import InputStep from "./views/InputStep.vue";
import { processNav } from "@/services/processFood";
import { onMounted } from "vue";

const starterComponent = InputStep;

onMounted(() => {
  const v = document.getElementById("processNav");
  processNav.value = v;
});
</script>
