import type { Ref } from "vue";
import { NavComponent, ComponentProps } from "@ionic/core";
import type { Nav } from "@ionic/core/dist/types/components/nav/nav";
import { ref } from "vue";

// @ts-expect-error
import InputStep from "../views/InputStep.vue";
// @ts-expect-error
import ProcessingStep from "../views/ProcessingStep.vue";
// @ts-expect-error
import SelectionStep from "../views/SelectionStep.vue";
import { completeGPT } from "./openai";
import fitbit from "./fitbit";

// @ts-expect-error
let processNav: Ref<Nav> = ref({} as Nav);

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

  const completion = await completeGPT(foodDescription);
  let res = completion;
  res.map(async (item) => {
    const choices = await fitbit.searchFoods(item.name);
    console.log("=========");
    console.log(item);
    console.log(choices[0]); // TODO: select better one

    const merged = { ...item, ...choices[0] };
    return merged;
  });

  navigate(SelectionStep, {
    foodItems: res,
  });
}

async function saveToFitbit() {
  console.log("savign to ftibit now");
}

export {
  navigate,
  navigateToRoot,
  processInput,
  processNav,
  handleInput,
  saveToFitbit,
};
