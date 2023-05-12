import { Configuration, OpenAIApi } from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const config = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(config);

interface FoodItem {
  name: string;
  unit: string;
  amount: number;
}

async function completeGPT(foodDescription: string): Promise<FoodItem[]> {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Ich werde dir gleich eine Beschreibungen meines Essens geben. Bitte schreibe mir die einzelnen Bestandteile der Mahlzeit als Json Liste auf. Jeder Eintrag der Liste sollte folgende Felder beinhalten: unit, name, amount\nDie Beschreibung ist:" +
      foodDescription,
    max_tokens: 500,
  });

  const completion: string = response.data.choices[0].text ?? "";
  let foods: FoodItem[] = JSON.parse(completion);
  return foods;
}

export { completeGPT };
