<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>FoodViaVoice</ion-title>
      <ion-buttons slot="end">
        <ion-nav-link router-direction="forward" :component="Settings">
          <ion-button>
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-nav-link>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-textarea
      placeholder="Describe your food here"
      v-model="recognizedText"
    ></ion-textarea>
    <ion-button expand="block" @click="completeInput">Continue</ion-button>
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
  IonTextarea,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import { settingsOutline } from "ionicons/icons";
import { ref } from "vue";
import type { Ref } from "vue";
import Settings from "./Settings.vue";
import { handleInput } from "@/services/processFood";

const recognizedText: Ref<string> = ref("");

function completeInput() {
  handleInput(recognizedText.value);
}
</script>
