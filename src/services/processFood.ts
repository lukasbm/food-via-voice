import type { Ref } from "vue";
import { ref } from "vue";
import { NavComponent, NavComponentWithProps } from "@ionic/core";

import InputStep from "../views/InputStep.vue";
import ProcessingStep from "../views/ProcessingStep.vue";
import SelectionStep from "../views/SelectionStep.vue";

import { completeGPT } from "./openai";

const processNav = ref();

function navigate(page: NavComponent | NavComponentWithProps) {
  processNav.value.push(page);
}

function navigateToRoot() {
  processNav.value.popToRoot();
}

function handleInput(foodDescription: string) {
  navigate(ProcessingStep);
  processInput(foodDescription);
}

function processInput(foodDescription: string) {
  console.log("chillin now in processInput");
  const cb = () => navigate(SelectionStep);
  setTimeout(cb, 500);
  // completeGPT(foodDescription);
}

async function saveToFitbit() {
}

export { processNav, handleInput, navigate, navigateToRoot, saveToFitbit };
