<template>
  <a :href="authUrl">
    <ion-button color="primary">Log in</ion-button>
  </a>
  <ion-button color="danger" @click="fitbitAuth.logout()">Log out</ion-button>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";

import { fitbitAuth } from "../services/fitbit";
import { AuthenticationStatus } from "../services/auth";

const authUrl: string = fitbitAuth.buildAuthUrl().toString();
</script>
