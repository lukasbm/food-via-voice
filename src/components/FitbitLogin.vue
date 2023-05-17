<template>
  <ion-button color="primary" @click="openLoginPage()">Log in</ion-button>
  <ion-button color="danger" @click="logout()">Log out</ion-button>
  <!-- current token: {{ fitbitAuth.getAccessToken() ?? "no token" }} -->
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { Browser } from "@capacitor/browser";
import { fitbitAuth } from "../services/fitbit";

const authUrl: string = fitbitAuth.buildAuthUrl().toString();

async function openLoginPage() {
  if (isPlatform("android")) {
    await Browser.open({ url: authUrl });
  } else {
    window.location.href = authUrl;
  }
}

function logout() {
  fitbitAuth.logout();
}
</script>
