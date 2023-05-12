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

function handleInput(foodDescription: string) {
  navigate(ProcessingStep);
  processInput(foodDescription);
}

function processInput(foodDescription: string) {
  console.log("chillin now in processInput");
  // completeGPT(foodDescription);
}

// enum Step {
//   UNDEFINED = 0,
//   CAPTURING_INPUT = 1,
//   PROCESSING_INPUT = 2,
//   DONE = 3,
// }
// const step: Ref<Step> = ref(Step.CAPTURING_INPUT);

export { processNav, handleInput };
