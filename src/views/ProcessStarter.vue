<template>
  <ion-nav id="processNav" :root="InputStep"></ion-nav>
</template>

<script setup lang="ts">
import { IonNav } from "@ionic/vue";
import { onMounted } from "vue";
import InputStep from "./InputStep.vue";
import { processNav } from "@/services/processFood";

onMounted(() => {
  const v = document.getElementById("processNav");
  processNav.value = v;
});
</script>
