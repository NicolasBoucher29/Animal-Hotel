// === ANIMAL DATA ===
const ANIMAL_TYPES = {
  dog_golden: { name: 'Golden Retriever', emoji: '\u{1F415}', type: 'dog', food: ['bone', 'meat'], vip: false },
  dog_husky: { name: 'Husky', emoji: '\u{1F43A}', type: 'dog', food: ['bone', 'fish'], vip: false },
  dog_poodle: { name: 'Caniche', emoji: '\u{1F429}', type: 'dog', food: ['bone', 'biscuit'], vip: false },
  cat_orange: { name: 'Chat Roux', emoji: '\u{1F408}', type: 'cat', food: ['fish', 'milk'], vip: false },
  cat_black: { name: 'Chat Noir', emoji: '\u{1F408}\u200D\u2B1B', type: 'cat', food: ['fish', 'mouse_toy'], vip: false },
  cat_white: { name: 'Chat Blanc', emoji: '\u{1F431}', type: 'cat', food: ['fish', 'cream'], vip: false },
  rabbit: { name: 'Lapin', emoji: '\u{1F430}', type: 'rabbit', food: ['carrot', 'salad'], vip: false },
  hamster: { name: 'Hamster', emoji: '\u{1F439}', type: 'hamster', food: ['seed', 'carrot'], vip: false },
  parrot: { name: 'Perroquet', emoji: '\u{1F99C}', type: 'parrot', food: ['seed', 'fruit'], vip: false },
  turtle: { name: 'Tortue', emoji: '\u{1F422}', type: 'turtle', food: ['salad', 'fruit'], vip: false },
  // VIP
  unicorn: { name: 'Licorne', emoji: '\u{1F984}', type: 'unicorn', food: ['rainbow_candy', 'star_fruit'], vip: true, specialNeed: 'Besoin d\'arc-en-ciels' },
  fox_magic: { name: 'Renard Magique', emoji: '\u{1F98A}', type: 'fox', food: ['magic_berry', 'moon_cake'], vip: true, specialNeed: 'Aime la lune' },
  phoenix: { name: 'Phoenix', emoji: '\u{1F985}', type: 'phoenix', food: ['fire_fruit', 'sun_seed'], vip: true, specialNeed: 'Besoin de chaleur' },
  baby_dragon: { name: 'Dragon Miniature', emoji: '\u{1F409}', type: 'dragon', food: ['fire_fruit', 'gem_candy'], vip: true, specialNeed: 'Adore les pierres' },
  pegasus: { name: 'Pegase', emoji: '\u{1FAB6}', type: 'pegasus', food: ['cloud_cotton', 'star_fruit'], vip: true, specialNeed: 'Besoin de voler' },
};

const FOOD_ITEMS = {
  bone: { emoji: '\u{1F9B4}', name: 'Os' },
  meat: { emoji: '\u{1F356}', name: 'Viande' },
  fish: { emoji: '\u{1F41F}', name: 'Poisson' },
  biscuit: { emoji: '\u{1F36A}', name: 'Biscuit' },
  milk: { emoji: '\u{1F95B}', name: 'Lait' },
  cream: { emoji: '\u{1F368}', name: 'Creme' },
  carrot: { emoji: '\u{1F955}', name: 'Carotte' },
  salad: { emoji: '\u{1F957}', name: 'Salade' },
  seed: { emoji: '\u{1F33B}', name: 'Graines' },
  fruit: { emoji: '\u{1F34E}', name: 'Fruit' },
  mouse_toy: { emoji: '\u{1F42D}', name: 'Souris jouet' },
  // VIP foods
  rainbow_candy: { emoji: '\u{1F308}', name: 'Bonbon Arc-en-ciel' },
  star_fruit: { emoji: '\u2B50', name: 'Fruit Etoile' },
  magic_berry: { emoji: '\u{1FAD0}', name: 'Baie Magique' },
  moon_cake: { emoji: '\u{1F319}', name: 'Gateau Lunaire' },
  fire_fruit: { emoji: '\u{1F525}', name: 'Fruit de Feu' },
  sun_seed: { emoji: '\u2600\uFE0F', name: 'Graine de Soleil' },
  gem_candy: { emoji: '\u{1F48E}', name: 'Bonbon Gemme' },
  cloud_cotton: { emoji: '\u2601\uFE0F', name: 'Barbe a Papa Nuage' },
};

const OWNER_NAMES = [
  'Marie', 'Lucas', 'Emma', 'Hugo', 'Lea', 'Tom', 'Chloe', 'Nathan',
  'Camille', 'Theo', 'Manon', 'Enzo', 'Jade', 'Louis', 'Lina', 'Raphael',
  'Zoé', 'Arthur', 'Alice', 'Gabriel'
];

const ANIMAL_NAMES = {
  dog: ['Rex', 'Buddy', 'Max', 'Charlie', 'Rocky', 'Milo', 'Caramel', 'Cookie'],
  cat: ['Moustache', 'Felix', 'Luna', 'Minou', 'Tigrou', 'Noisette', 'Minette', 'Pacha'],
  rabbit: ['Pompon', 'Flocon', 'Caramel', 'Noisette', 'Choupi', 'Cotton'],
  hamster: ['Biscuit', 'Noisette', 'Caramel', 'Boulette', 'Grignotin'],
  parrot: ['Coco', 'Kiwi', 'Rio', 'Plume', 'Perle', 'Bijou'],
  turtle: ['Speedy', 'Leonardo', 'Sheldon', 'Crush', 'Franklin'],
  unicorn: ['Etoile', 'Celeste', 'Aurora', 'Prisme'],
  fox: ['Flamme', 'Mystere', 'Lueur', 'Eclipse'],
  phoenix: ['Soleil', 'Braise', 'Etincelle', 'Aurore'],
  dragon: ['Rubis', 'Ecaille', 'Flamby', 'Saphir'],
  pegasus: ['Nuage', 'Zephyr', 'Aile', 'Comete'],
};

// === QUEST DATA ===
const QUEST_TEMPLATES = [
  // Care quests
  {
    id: 'lost_appetite',
    type: 'care',
    title: '\u{1F37D}\uFE0F Le repas mystere',
    desc: '{animal} ne mange plus depuis ce matin. Trouve ce qu\'il aime !',
    objective: 'Nourris {animal} avec son plat prefere',
    reward: { coins: 15, stars: 1 },
    action: 'feed',
  },
  {
    id: 'bath_time',
    type: 'care',
    title: '\u{1F6C1} L\'heure du bain',
    desc: '{animal} s\'est roule dans la boue ! Il faut le laver.',
    objective: 'Donne un bain a {animal}',
    reward: { coins: 10, stars: 1 },
    action: 'wash',
  },
  {
    id: 'lonely_pet',
    type: 'care',
    title: '\u{1F494} Un ami triste',
    desc: '{animal} se sent seul. Joue avec lui pour le remonter !',
    objective: 'Joue avec {animal} dans le jardin',
    reward: { coins: 10, stars: 1 },
    action: 'play',
  },
  // Exploration quests
  {
    id: 'escaped_pet',
    type: 'explore',
    title: '\u{1F43E} Fugue au village !',
    desc: 'Un chiot s\'est echappe de l\'hotel ! Retrouve-le dans le village.',
    objective: 'Cherche dans le village',
    reward: { coins: 25, stars: 2 },
    location: 'village',
  },
  {
    id: 'rare_flower',
    type: 'explore',
    title: '\u{1F33A} La fleur rare',
    desc: 'La veterinaire a besoin d\'une fleur speciale dans la foret.',
    objective: 'Explore la foret enchantee',
    reward: { coins: 20, stars: 1 },
    location: 'forest',
  },
  {
    id: 'market_supplies',
    type: 'explore',
    title: '\u{1F6D2} Courses au marche',
    desc: 'L\'hotel manque de provisions ! Va au marche acheter de la nourriture.',
    objective: 'Va au marche du village',
    reward: { coins: 15, stars: 1 },
    location: 'market',
  },
  // Mystery quests
  {
    id: 'night_sounds',
    type: 'mystery',
    title: '\u{1F319} Bruits dans la nuit',
    desc: 'Des bruits etranges resonnent dans l\'hotel la nuit. Enquete !',
    objective: 'Enquete dans les chambres',
    reward: { coins: 30, stars: 2 },
    action: 'investigate',
  },
  {
    id: 'missing_toy',
    type: 'mystery',
    title: '\u{1F50D} Le jouet disparu',
    desc: 'Le jouet prefere de {animal} a disparu ! Qui l\'a pris ?',
    objective: 'Interroge les animaux',
    reward: { coins: 20, stars: 1 },
    action: 'investigate',
  },
  // Social quests
  {
    id: 'worried_owner',
    type: 'social',
    title: '\u{1F4DE} Proprietaire inquiet',
    desc: '{owner} appelle pour savoir si {animal} va bien. Montre-lui !',
    objective: 'Fais un rapport a {owner}',
    reward: { coins: 20, stars: 2 },
    action: 'report',
  },
  {
    id: 'new_guest',
    type: 'social',
    title: '\u{1F3E8} Nouveau pensionnaire',
    desc: 'Un nouveau client arrive avec son animal. Accueille-le !',
    objective: 'Prepare la chambre',
    reward: { coins: 15, stars: 1, newAnimal: true },
    action: 'welcome',
  },
  // VIP quests
  {
    id: 'unicorn_sad',
    type: 'vip',
    title: '\u{1F984} La licorne triste',
    desc: 'Etoile la licorne ne brille plus. Trouve la fleur arc-en-ciel dans la foret !',
    objective: 'Trouve la fleur arc-en-ciel',
    reward: { coins: 50, stars: 3 },
    location: 'forest',
    requiresVip: true,
  },
  {
    id: 'dragon_egg',
    type: 'vip',
    title: '\u{1F95A} L\'oeuf mysterieux',
    desc: 'Un oeuf brillant est apparu dans le jardin. Qu\'est-ce que c\'est ?',
    objective: 'Garde l\'oeuf au chaud',
    reward: { coins: 40, stars: 2, newAnimal: true },
    action: 'hatch',
    requiresVip: true,
  },
];

// === SHOP ITEMS ===
const SHOP_ITEMS = {
  food: [
    { id: 'premium_kibble', name: 'Croquettes Premium', emoji: '\u{1F35A}', price: 10, effect: 'hunger+30' },
    { id: 'gourmet_fish', name: 'Poisson Gourmet', emoji: '\u{1F3A3}', price: 15, effect: 'hunger+50' },
    { id: 'magic_treat', name: 'Friandise Magique', emoji: '\u{1F36D}', price: 25, effect: 'hunger+40,mood+20' },
  ],
  toys: [
    { id: 'ball', name: 'Balle Rebondissante', emoji: '\u26BD', price: 20, effect: 'mood+30' },
    { id: 'feather', name: 'Plume Chatouille', emoji: '\u{1FAB6}', price: 15, effect: 'mood+20' },
    { id: 'puzzle', name: 'Puzzle Friandise', emoji: '\u{1F9E9}', price: 30, effect: 'mood+40' },
  ],
  decor: [
    { id: 'carpet', name: 'Tapis Douillet', emoji: '\u{1F9F6}', price: 35, effect: 'comfort+1' },
    { id: 'fountain', name: 'Fontaine a Eau', emoji: '\u26F2', price: 50, effect: 'comfort+2' },
    { id: 'garden_flowers', name: 'Fleurs du Jardin', emoji: '\u{1F33B}', price: 25, effect: 'beauty+1' },
    { id: 'fairy_lights', name: 'Guirlande Lumineuse', emoji: '\u2728', price: 40, effect: 'beauty+2' },
  ],
  vip: [
    { id: 'rainbow_arch', name: 'Arche Arc-en-ciel', emoji: '\u{1F308}', price: 100, effect: 'vip_comfort+2' },
    { id: 'cloud_bed', name: 'Lit de Nuage', emoji: '\u2601\uFE0F', price: 80, effect: 'vip_comfort+1' },
    { id: 'crystal_ball', name: 'Boule de Cristal', emoji: '\u{1F52E}', price: 120, effect: 'vip_beauty+2' },
  ],
};

// === VILLAGE PLACES ===
const VILLAGE_PLACES = [
  { id: 'forest', name: 'Foret Enchantee', emoji: '\u{1F332}', desc: 'Pleine de mysteres', unlockStars: 0 },
  { id: 'market', name: 'Marche', emoji: '\u{1F6D2}', desc: 'Provisions et tresors', unlockStars: 0 },
  { id: 'beach', name: 'Plage', emoji: '\u{1F3D6}\uFE0F', desc: 'Sable et coquillages', unlockStars: 5 },
  { id: 'mountain', name: 'Montagne', emoji: '\u26F0\uFE0F', desc: 'Vue panoramique', unlockStars: 10 },
  { id: 'cave', name: 'Grotte Secrete', emoji: '\u{1F573}\uFE0F', desc: 'Qu\'y a-t-il dedans ?', unlockStars: 15 },
  { id: 'rainbow_field', name: 'Champ Arc-en-ciel', emoji: '\u{1F308}', desc: 'Lieu magique VIP', unlockStars: 20 },
];

// === EVENTS ===
const RANDOM_EVENTS = [
  { icon: '\u26C8\uFE0F', title: 'Orage !', text: 'Un orage fait peur aux animaux ! Va les rassurer vite !', effect: 'all_mood-20' },
  { icon: '\u{1F382}', title: 'Anniversaire !', text: 'C\'est l\'anniversaire d\'un animal ! Faisons la fete !', effect: 'random_mood+30' },
  { icon: '\u{1F48C}', title: 'Courrier !', text: 'Le facteur apporte une lettre d\'un proprietaire reconnaissant.', effect: 'coins+20' },
  { icon: '\u{1F31F}', title: 'Etoile filante !', text: 'Une etoile filante ! Fais un voeu pour l\'hotel !', effect: 'stars+1' },
  { icon: '\u{1F33A}', title: 'Fleurs !', text: 'De jolies fleurs ont pousse dans le jardin de l\'hotel !', effect: 'beauty+1' },
  { icon: '\u{1F436}', title: 'Visiteur !', text: 'Un animal perdu se presente a la porte. L\'accueilles-tu ?', effect: 'newAnimal' },
];

// === HOTEL LEVELS ===
const HOTEL_LEVELS = [
  { level: 1, name: 'Pension Modeste', stars: 0, maxAnimals: 3, icon: '\u2B50' },
  { level: 2, name: 'Hotel Confortable', stars: 10, maxAnimals: 5, icon: '\u2B50\u2B50' },
  { level: 3, name: 'Hotel de Charme', stars: 25, maxAnimals: 8, icon: '\u2B50\u2B50\u2B50' },
  { level: 4, name: 'Palace Animal', stars: 50, maxAnimals: 12, icon: '\u2B50\u2B50\u2B50\u2B50' },
  { level: 5, name: 'Resort Legendaire', stars: 100, maxAnimals: 16, icon: '\u2B50\u2B50\u2B50\u2B50\u2B50' },
];

// === NPC CHARACTERS ===
const NPCS = {
  vet: { name: 'Dr. Claire', emoji: '\u{1F469}\u200D\u2695\uFE0F', role: 'Veterinaire' },
  postman: { name: 'Paul', emoji: '\u{1F4EE}', role: 'Facteur' },
  neighbor: { name: 'Mme Mystere', emoji: '\u{1F9D9}\u200D\u2640\uFE0F', role: 'Voisine mysterieuse' },
  chef: { name: 'Chef Bruno', emoji: '\u{1F468}\u200D\u{1F373}', role: 'Cuisinier' },
};
