<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Voice Input</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>voice input here</h1>
      <p>Hier der erkannte Text</p>
      <ion-nav-link router-direction="forward" :component="component">
        <ion-button>Continue</ion-button>
      </ion-nav-link>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import SaveMealPreset from "./SaveMealPreset.vue";
import AddMeal from "./AddMeal.vue";

const component = AddMeal;
</script>
