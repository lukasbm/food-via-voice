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
import { processNav } from "@/services/navigation";
import { onMounted } from "vue";
import type { Nav } from "@ionic/core/dist/types/components/nav/nav";

const starterComponent = InputStep;

onMounted(() => {
  const v = document.getElementById("processNav");
  // @ts-expect-error
  processNav.value = v as Nav;
});
</script>
