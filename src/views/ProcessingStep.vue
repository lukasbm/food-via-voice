<template>
  <!-- FIXME: problems with fullscreen? -->
  <ion-content :fullscreen="false" class="ion-padding">
    <p>processing tasjdlkasjdlkajsd test</p>
    <!-- <div class="container">
      <ion-spinner class="large-spinner"></ion-spinner>
      <p>Hold on, processing ...</p>
    </div> -->
  </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonSpinner } from "@ionic/vue";
</script>

<style scoped>
/* TODO: is there a container class in the ionic css utils? */
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
