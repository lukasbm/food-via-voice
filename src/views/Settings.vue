<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-item>
      <h1>Dark Mode Settings</h1>
      <dark-mode-toggle></dark-mode-toggle>
    </ion-item>

    <ion-item>
      <h1>FitBit Connection</h1>
      <fitbit-login></fitbit-login>
    </ion-item>
  </ion-content>
</template>

<script setup lang="ts">
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import FitbitLogin from "@/components/FitbitLogin.vue";
import {
  IonContent,
  IonBackButton,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonItem,
} from "@ionic/vue";
</script>
