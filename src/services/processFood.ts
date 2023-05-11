import type { Ref } from "vue";
import { ref } from "vue";

import InputStep from "../views/InputStep.vue";
import ProcessingStep from "../views/ProcessingStep.vue";
import SelectionStep from "../views/SelectionStep.vue";

import { completeGPT } from "./openai";

const processNav: Ref<any> = ref(null);

enum ProcessingStep {
  UNDEFINED = 0,
  CAPTURING_INPUT = 1,
  PROCESSING_INPUT = 2,
  DONE = 3,
}
const step: Ref<ProcessingStep> = ref(ProcessingStep.CAPTURING_INPUT);

function handleInput(foodDescription: string) {
  processNav.value.push(ProcessingStep);
  processInput(foodDescription);
}

function processInput(foodDescription: string) {
  console.log("chillin now in processInput");
  // completeGPT(foodDescription);
}

export { processNav, handleInput };
