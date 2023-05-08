<template>
  <ion-fab-button
    v-if="voiceInputAvailable"
    @click="recognize"
    :color="isRecording ? 'danger' : 'primary'"
  >
    <ion-icon :icon="micOutline"></ion-icon>
  </ion-fab-button>
  <ion-textarea
    v-else
    placeholder="Describe your food here"
    v-model="recognizedText"
  ></ion-textarea>

  <h5>erkannter text</h5>
  <p>{{ recognizedText }}</p>
</template>

<script setup lang="ts">
import { IonFabButton, IonIcon, IonTextarea } from "@ionic/vue";
import { micOutline } from "ionicons/icons";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { ref } from "vue";
import type { Ref } from "vue";

const isRecording: Ref<boolean> = ref(false);
const recognizedText: Ref<string> = ref("");
const voiceInputAvailable: Ref<Boolean> = ref(false);

try {
  const { available } = await SpeechRecognition.available();
  if (available) {
    voiceInputAvailable.value = true;
    await SpeechRecognition.requestPermission();
  }
} catch {
  console.log("voice input not available, fallback using keyboard");
}

function recognize() {
  if (isRecording.value) stopRecognition();
  else startRecognition();
}

async function startRecognition() {
  const { permission } = await SpeechRecognition.hasPermission();

  if (isRecording.value || !permission || !voiceInputAvailable) return;

  isRecording.value = true;
  SpeechRecognition.start({
    language: "de-DE",
    maxResults: 3,
    partialResults: false,
    popup: false,
  });

  // listen now
  SpeechRecognition.addListener("partialResults", (data: any) => {
    const d = data.matches || data.value; // matches on ios and value on android
    if (d && d.length > 0) {
      recognizedText.value = d;
    }
  });
}

async function stopRecognition() {
  await SpeechRecognition.removeAllListeners();
  await SpeechRecognition.stop();
  isRecording.value = false;
}
</script>
