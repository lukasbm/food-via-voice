<template>
  <ion-header>
    <ion-toolbar>
      <ion-segment value="all">
        <ion-segment-button value="all">
          <ion-label>Track Items</ion-label>
        </ion-segment-button>
        <ion-segment-button value="favorites">
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
    <p>Successfully saved to FitBit</p>
    <ion-toast
      trigger="open-toast"
      message="This toast will disappear after 5 seconds"
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

const foodItems = [
  {
    name: "Tomato",
    amount: "500",
    unit: "g",
  },
  {
    name: "Milch",
    amount: "150",
    unit: "ml",
  },
  {
    name: "Rice",
    amount: "1",
    unit: "cup",
  },
];
</script>
