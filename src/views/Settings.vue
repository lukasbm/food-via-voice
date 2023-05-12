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
      <h3>Dark Mode Settings</h3>
      <br />
      <dark-mode-toggle></dark-mode-toggle>
    </ion-item>

    <ion-item>
      <h3>FitBit Connection</h3>
      <br />
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
