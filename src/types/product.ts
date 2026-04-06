export type Ingredient = {
  name_ua: string;
  name_pl: string;
  amount: string;
};

export type Product = {
  _id: string;
  id: string;
  image: string;
  name_ua: string;
  name_pl: string;
  category_ua: string;
  category_pl: string;
  price: number;
  ingredients: Ingredient[];
  tags_ua: string[];
  tags_pl: string[];
  description_ua: string;
  description_pl: string;
  seo_ua: string;
  seo_pl: string;
};
