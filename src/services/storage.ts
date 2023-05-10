import { Storage } from "@ionic/storage";

const storage: Storage = new Storage();

await storage.create();

export default storage;
