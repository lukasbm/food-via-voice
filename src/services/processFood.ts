import type { Ref } from "vue";
import { ref } from "vue";
import {
  NavComponent,
  NavComponentWithProps,
  ComponentProps,
} from "@ionic/core";

import InputStep from "../views/InputStep.vue";
import ProcessingStep from "../views/ProcessingStep.vue";
import SelectionStep from "../views/SelectionStep.vue";

import { completeGPT } from "./openai";
import fitbit from "./fitbit";

const processNav = ref();

function navigate(page: NavComponent, props?: ComponentProps<any>): void {
  if (props) {
    processNav.value.push(page, props);
  } else {
    processNav.value.push(page);
  }
}

function navigateToRoot() {
  processNav.value.popToRoot();
}

function handleInput(foodDescription: string) {
  navigate(ProcessingStep);
  processInput(foodDescription);
}

async function processInput(foodDescription: string) {
  console.log("chillin now in processInput");

  let completion = await completeGPT(foodDescription);

  completion.forEach(async (item) => {
    const choices = await fitbit.searchFoods(item.name);
    console.log("=========");
    console.log(item);
    console.log(choices);
  });

  navigate(SelectionStep, {
    choices: "test", // TODO: work here
  });
}

async function saveToFitbit() {
  console.log("savign to ftibit now");
}

export { processNav, handleInput, navigate, navigateToRoot, saveToFitbit };
