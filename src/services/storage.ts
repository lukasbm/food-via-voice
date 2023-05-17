import { Storage } from "@ionic/storage";

let storage: Storage = new Storage();

(async function () {
  storage = await storage.create();
})();

export default storage;
