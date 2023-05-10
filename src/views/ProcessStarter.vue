<template>
  <ion-nav :root="InputStep"></ion-nav>
</template>

<script setup lang="ts">
import { IonNav } from "@ionic/vue";
import { ref } from "vue";
import type { Ref } from "vue";
import InputStep from "./InputStep.vue";

enum ProcessingStep {
  UNDEFINED = 0,
  CAPTURING_INPUT = 1,
  PROCESSING_INPUT = 2,
  DONE = 3,
}
const step: Ref<ProcessingStep> = ref(ProcessingStep.CAPTURING_INPUT);
</script>
