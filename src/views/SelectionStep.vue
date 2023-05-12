<template>
  <ion-header>
    <ion-toolbar>
      <ion-segment value="all" v-model="saveType">
        <ion-segment-button value="track-items">
          <ion-label>Track Items</ion-label>
        </ion-segment-button>
        <ion-segment-button value="save-meal">
          <ion-label>Save as Meal Preset</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-list>
      <ion-item v-for="item in foodItems" :key="item.name">
        <ion-checkbox justify="start" :checked="true">
          {{ item.name }} - {{ item.amount }} {{ item.unit }}
        </ion-checkbox>
      </ion-item>
    </ion-list>

    <ion-button id="open-toast" expand="block">Save to Fitbit</ion-button>
    <ion-toast
      trigger="open-toast"
      message="Successfully saved to FitBit"
      :duration="5000"
    ></ion-toast>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonCheckbox,
  IonItem,
  IonList,
  IonButton,
  IonHeader,
  IonContent,
  IonToast,
} from "@ionic/vue";
import { ref } from "vue";
import type { Ref } from "vue";

// types
interface FoodItem {
  name: string;
  unit: string;
  amount: number;
}
type SaveType = "track-items" | "save-meal";

// refs and variables
const saveType: Ref<SaveType> = ref("track-items");
const foodItems: Ref<FoodItem[]> = ref([]);
</script>
