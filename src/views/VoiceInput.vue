<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Voice Input</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <VoiceInputButton />
    <p>Hier der erkannte Text</p>
    <ion-nav-link
      router-direction="forward"
      :component="commandProcessingComponent"
    >
      <ion-button>Continue</ion-button>
    </ion-nav-link>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import SaveMeal from "./SaveMeal.vue";
import VoiceInputButton from "../components/VoiceInputButton.vue";

const commandProcessingComponent = SaveMeal;
</script>
