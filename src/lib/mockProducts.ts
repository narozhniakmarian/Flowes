import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: "1",
    id: "bouquet-001",
    image:
      "https://res.cloudinary.com/dodl6tqwz/image/upload/q_auto/f_auto/v1775487777/img521_k4le3b.jpg",
    name_ua: "Кремова Елегантність",
    name_pl: "Kremowa Elegancja",
    category_ua: "Весільні букети",
    category_pl: "Bukiety ślubne",
    price: 1490,
    ingredients: [
      { name_ua: "Троянда кремова", name_pl: "Róża kremowa", amount: "13 шт" },
      { name_ua: "Євкаліпт", name_pl: "Eukaliptus", amount: "2 гілки" },
      { name_ua: "Гіпсофіла", name_pl: "Gipsówka", amount: "0.5 уп" },
    ],
    tags_ua: ["кремовий букет", "елегантний стиль", "класика"],
    tags_pl: ["kremowy bukiet", "elegancki styl", "klasyka"],
    description_ua:
      "Стриманий та елегантний букет із кремових троянд — універсальний варіант для будь-якого стилю весілля.",
    description_pl:
      "Stonowany i elegancki bukiet z kremowych róż — uniwersalna propozycja na każdy styl ślubu.",
    seo_ua:
      "Кремовий весільний букет із троянд. Елегантна композиція для класичного та сучасного весілля.",
    seo_pl:
      "Kremowy bukiet ślubny z róż. Elegancka kompozycja na klasyczny lub nowoczesny ślub.",
  },
  {
    _id: "2",
    id: "bouquet-002",
    image:
      "https://images.unsplash.com/photo-1487530811015-780e7e0fe7fa?w=800&q=80",
    name_ua: "Рожева Весна",
    name_pl: "Różowa Wiosna",
    category_ua: "День матері",
    category_pl: "Dzień Matki",
    price: 890,
    ingredients: [
      { name_ua: "Піоноподібна троянда", name_pl: "Róża piwoniowa", amount: "9 шт" },
      { name_ua: "Лаванда", name_pl: "Lawenda", amount: "3 гілки" },
    ],
    tags_ua: ["рожевий букет", "весна", "мамі"],
    tags_pl: ["różowy bukiet", "wiosna", "dla mamy"],
    description_ua:
      "Ніжний весняний букет із піоноподібних троянд — ідеальний подарунок для мами.",
    description_pl:
      "Delikatny wiosenny bukiet z różowych róż piwoniowych — idealny prezent dla mamy.",
    seo_ua: "Рожевий букет на День матері. Піоноподібні троянди з доставкою в Ополе.",
    seo_pl: "Różowy bukiet na Dzień Matki. Róże piwoniowe z dostawą w Opolu.",
  },
  {
    _id: "3",
    id: "bouquet-003",
    image:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=800&q=80",
    name_ua: "Сонячний День",
    name_pl: "Słoneczny Dzień",
    category_ua: "Квіти до 8 березня",
    category_pl: "Kwiaty na 8 marca",
    price: 750,
    ingredients: [
      { name_ua: "Соняшник", name_pl: "Słonecznik", amount: "5 шт" },
      { name_ua: "Жовта фрезія", name_pl: "Frezja żółta", amount: "7 шт" },
      { name_ua: "Лимоніум", name_pl: "Limonium", amount: "1 уп" },
    ],
    tags_ua: ["жовтий букет", "соняшники", "яскравий"],
    tags_pl: ["żółty bukiet", "słoneczniki", "radosny"],
    description_ua:
      "Яскравий і позитивний букет із соняшників — заряд гарного настрою на будь-яке свято.",
    description_pl:
      "Radosny bukiet ze słoneczników — zastrzyk dobrego humoru na każde święto.",
    seo_ua: "Букет із соняшників до 8 березня. Яскраві квіти з доставкою в Ополе.",
    seo_pl: "Bukiet słoneczników na 8 marca. Żywe kwiaty z dostawą w Opolu.",
  },
  {
    _id: "4",
    id: "bouquet-004",
    image:
      "https://images.unsplash.com/photo-1523694576729-96e9e1e52e07?w=800&q=80",
    name_ua: "Лісова Казка",
    name_pl: "Leśna Baśń",
    category_ua: "Кошик квітів",
    category_pl: "Kosz kwiatów",
    price: 1850,
    ingredients: [
      { name_ua: "Гортензія", name_pl: "Hortensja", amount: "3 шт" },
      { name_ua: "Папороть", name_pl: "Paproć", amount: "4 гілки" },
      { name_ua: "Троянда зелена", name_pl: "Róża zielona", amount: "5 шт" },
      { name_ua: "Хризантема", name_pl: "Chryzantema", amount: "4 шт" },
    ],
    tags_ua: ["зелений кошик", "лісовий стиль", "натуральний"],
    tags_pl: ["zielony kosz", "leśny styl", "naturalny"],
    description_ua:
      "Розкішний кошик із зеленими відтінками — поєднання природи та витонченості.",
    description_pl:
      "Luksusowy kosz w zielonych odcieniach — połączenie natury i wyrafinowania.",
    seo_ua: "Кошик квітів із гортензіями. Зелена флористична композиція з доставкою.",
    seo_pl: "Kosz kwiatów z hortensjami. Zielona kompozycja florystyczna z dostawą.",
  },
  {
    _id: "5",
    id: "bouquet-005",
    image:
      "https://images.unsplash.com/photo-1563241527-3034482246c7?w=800&q=80",
    name_ua: "Пурпурна Пристрасть",
    name_pl: "Purpurowa Namiętność",
    category_ua: "Весільні букети",
    category_pl: "Bukiety ślubne",
    price: 1690,
    ingredients: [
      { name_ua: "Бордова троянда", name_pl: "Róża bordowa", amount: "11 шт" },
      { name_ua: "Евкаліпт", name_pl: "Eukaliptus", amount: "3 гілки" },
      { name_ua: "Аспарагус", name_pl: "Asparagus", amount: "2 гілки" },
    ],
    tags_ua: ["бордовий букет", "романтика", "весілля"],
    tags_pl: ["bordowy bukiet", "romantyczny", "ślubny"],
    description_ua:
      "Глибокий і пристрасний букет із бордових троянд — символ любові та відданості.",
    description_pl:
      "Głęboki i namiętny bukiet z bordowych róż — symbol miłości i oddania.",
    seo_ua: "Бордовий весільний букет із троянд. Романтична композиція для урочистих подій.",
    seo_pl: "Bordowy bukiet ślubny z róż. Romantyczna kompozycja na uroczystości.",
  },
  {
    _id: "6",
    id: "bouquet-006",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    name_ua: "Ніжна Хмаринка",
    name_pl: "Delikatna Chmurka",
    category_ua: "День матері",
    category_pl: "Dzień Matki",
    price: 670,
    ingredients: [
      { name_ua: "Гіпсофіла", name_pl: "Gipsówka", amount: "2 уп" },
      { name_ua: "Біла троянда", name_pl: "Róża biała", amount: "7 шт" },
    ],
    tags_ua: ["білий букет", "ніжний", "повітряний"],
    tags_pl: ["biały bukiet", "delikatny", "zwiewny"],
    description_ua:
      "Легкий і ніжний букет із білих троянд та гіпсофіли — наче хмаринка у твоїх руках.",
    description_pl:
      "Lekki i delikatny bukiet z białych róż i gipsówki — jak obłoczek w Twoich dłoniach.",
    seo_ua: "Ніжний білий букет із троянд і гіпсофіли. Легка композиція з доставкою.",
    seo_pl: "Delikatny biały bukiet z róż i gipsówki. Lekka kompozycja z dostawą.",
  },
  {
    _id: "7",
    id: "bouquet-007",
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    name_ua: "Помаранчевий Захід",
    name_pl: "Pomarańczowy Zachód",
    category_ua: "Квіти до 8 березня",
    category_pl: "Kwiaty na 8 marca",
    price: 820,
    ingredients: [
      { name_ua: "Помаранчева троянда", name_pl: "Róża pomarańczowa", amount: "9 шт" },
      { name_ua: "Жовтий тюльпан", name_pl: "Tulipan żółty", amount: "5 шт" },
      { name_ua: "Листя монстери", name_pl: "Liść monstery", amount: "2 шт" },
    ],
    tags_ua: ["помаранчевий букет", "тропічний", "яскравий"],
    tags_pl: ["pomarańczowy bukiet", "tropikalny", "jaskrawy"],
    description_ua:
      "Теплий і соковитий букет — наче захід сонця у квітах. Ідеально для свята.",
    description_pl:
      "Ciepły i soczysty bukiet — jak zachód słońca w kwiatach. Idealny na święto.",
    seo_ua: "Помаранчевий букет до 8 березня. Троянди та тюльпани з доставкою в Ополе.",
    seo_pl: "Pomarańczowy bukiet na 8 marca. Róże i tulipany z dostawą w Opolu.",
  },
  {
    _id: "8",
    id: "bouquet-008",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    name_ua: "Казкова Мозаїка",
    name_pl: "Bajkowa Mozaika",
    category_ua: "Кошик квітів",
    category_pl: "Kosz kwiatów",
    price: 2100,
    ingredients: [
      { name_ua: "Піон", name_pl: "Piwonia", amount: "4 шт" },
      { name_ua: "Троянда рожева", name_pl: "Róża różowa", amount: "6 шт" },
      { name_ua: "Ранункулюс", name_pl: "Jaskier", amount: "5 шт" },
      { name_ua: "Евкаліпт", name_pl: "Eukaliptus", amount: "3 гілки" },
      { name_ua: "Гіпсофіла", name_pl: "Gipsówka", amount: "0.5 уп" },
    ],
    tags_ua: ["рожевий кошик", "розкіш", "піони"],
    tags_pl: ["różowy kosz", "luksus", "piwonie"],
    description_ua:
      "Розкішна квіткова мозаїка з піонів і троянд — подарунок, що залишить незабутнє враження.",
    description_pl:
      "Luksusowa mozaika z piwonii i róż — prezent, który pozostawi niezapomniane wrażenie.",
    seo_ua: "Кошик квітів із піонами і трояндами. Розкішна композиція з доставкою.",
    seo_pl: "Kosz kwiatów z piwoniami i różami. Luksusowa kompozycja z dostawą.",
  },
  {
    _id: "9",
    id: "bouquet-009",
    image:
      "https://images.unsplash.com/photo-1573461160327-f94e37bb0b94?w=800&q=80",
    name_ua: "Блакитний Вітер",
    name_pl: "Błękitny Wiatr",
    category_ua: "Квіти до 8 березня",
    category_pl: "Kwiaty na 8 marca",
    price: 730,
    ingredients: [
      { name_ua: "Дельфіній", name_pl: "Delphinium", amount: "5 гілок" },
      { name_ua: "Ромашка", name_pl: "Rumianek", amount: "7 шт" },
      { name_ua: "Лаванда", name_pl: "Lawenda", amount: "4 гілки" },
    ],
    tags_ua: ["блакитний букет", "польові квіти", "лаванда"],
    tags_pl: ["niebieski bukiet", "kwiaty polne", "lawenda"],
    description_ua:
      "Свіжий і повітряний букет із польових квітів — мрія для любителів природної естетики.",
    description_pl:
      "Świeży i zwiewny bukiet z polnych kwiatów — marzenie dla miłośników naturalnej estetyki.",
    seo_ua: "Блакитний букет із лавандою. Польові квіти з доставкою в Ополе.",
    seo_pl: "Niebieski bukiet z lawendą. Kwiaty polne z dostawą w Opolu.",
  },
];
