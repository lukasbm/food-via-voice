<!-- Component with a log in and log out button to register with fitbit. -->

<template>
  <a :href="authUrl">
    <ion-button color="primary">Log in</ion-button>
  </a>
  <ion-button color="danger" @click="fitbitAuth.logout()">Log out</ion-button>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";

import { fitbitAuth } from "../services/fitbit";

const authUrl: string = fitbitAuth.buildAuthUrl().toString();

fitbitAuth.extractToken();
</script>
