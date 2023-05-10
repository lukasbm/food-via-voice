<template>
  <ion-content :fullscreen="true" class="ion-padding">
    <div class="container">
      <ion-spinner class="large-spinner"></ion-spinner>
      <p>Hold on, processing ...</p>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonSpinner } from "@ionic/vue";
</script>

<style scoped>
.container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.large-spinner {
  transform: scale(3);
  margin: 2em;
}
</style>
