export interface FoodItem {
  name: string;
  unit: string;
  amount: number;
}

export interface FoodChoice {
  id: string;
  name: string;
  brand: string;
  unitId: string;
}

export interface IFood {
  /**
   * searches food database for possible options matching query
   */
  searchFoods(query: string): Promise<FoodChoice[]>;

  /**
   * TODO: also offer overloaded variant to include timestamp/date.
   * @param food FoodChoice merged with FoodItem to be logged
   */
  logFood(food: FoodChoice & FoodItem): Promise<void>;
}
