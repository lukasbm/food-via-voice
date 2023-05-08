<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>FoodViaVoice</ion-title>
      <ion-buttons slot="end">
        <ion-nav-link router-direction="forward" :component="FitbitLogin">
          <ion-button>
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-nav-link>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <Suspense>
      <VoiceInputButton />
      <template #fallback>
        <ion-spinner></ion-spinner>
      </template>
    </Suspense>
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
  IonSpinner,
} from "@ionic/vue";
import { settingsOutline } from "ionicons/icons";
import SaveMeal from "./SaveMeal.vue";
import VoiceInputButton from "../components/VoiceInputButton.vue";
import FitbitLogin from "./FitbitLogin.vue";

const commandProcessingComponent = SaveMeal;
</script>
