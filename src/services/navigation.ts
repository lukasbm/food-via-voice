import type { Ref } from "vue";
import { NavComponent, ComponentProps } from "@ionic/core";
import type { Nav } from "@ionic/core/dist/types/components/nav/nav";
import { ref } from "vue";

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

export { processNav, navigate, navigateToRoot };
