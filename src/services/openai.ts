import { Configuration, OpenAIApi } from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const config = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(config);

async function completeGPT(foodDescription: string) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Ich werde dir gleich eine Beschreibungen meines Essens geben. Bitte schreibe mir die einzelnen Bestandteile der Mahlzeit als Json Liste auf. Jeder Eintrag der Liste sollte folgende Felder beinhalten: Einheit, Name des Bestandteils, Menge\nDie Beschreibung ist:" +
        foodDescription,
      max_tokens: 300,
    });
    if (response.status != 200) throw new Error("completion error");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

export { completeGPT };
