import axios from 'axios';

const BASE_URL = 'https://potterapi-fedeperin.vercel.app/en';

export interface Spell {
  spell: string;
  use: string;
  index: number;
}

export interface Character {
  fullName: string;
  nickname: string;
  hogwartsHouse: string;
  interpretedBy: string;
  children: string[];
  image: string;
  birthdate: string;
  index: number;
}

export interface Book {
  number: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  description: string;
  pages: number;
  cover: string;
  index: number;
}

export interface House {
  house: string;
  emoji: string;
  founder: string;
  colors: string[];
  animal: string;
  index: number;
}

export interface Potion {
  name: string;
  effect: string;
  ingredients: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  brewingTime: string;
  color: string;
}

export const api = {
  spells: {
    getAll: async (): Promise<Spell[]> => {
      const response = await axios.get(`${BASE_URL}/spells`);
      return response.data;
    },
    getRandom: async (): Promise<Spell> => {
      const response = await axios.get(`${BASE_URL}/spells/random`);
      return response.data;
    },
  },
  characters: {
    getAll: async (): Promise<Character[]> => {
      const response = await axios.get(`${BASE_URL}/characters`);
      return response.data;
    },
    getRandom: async (): Promise<Character> => {
      const response = await axios.get(`${BASE_URL}/characters/random`);
      return response.data;
    },
    search: async (query: string): Promise<Character[]> => {
      const response = await axios.get(`${BASE_URL}/characters?search=${query}`);
      return response.data;
    },
  },
  books: {
    getAll: async (): Promise<Book[]> => {
      const response = await axios.get(`${BASE_URL}/books`);
      return response.data;
    },
    getRandom: async (): Promise<Book> => {
      const response = await axios.get(`${BASE_URL}/books/random`);
      return response.data;
    },
  },
  houses: {
    getAll: async (): Promise<House[]> => {
      const response = await axios.get(`${BASE_URL}/houses`);
      return response.data;
    },
    getRandom: async (): Promise<House> => {
      const response = await axios.get(`${BASE_URL}/houses/random`);
      return response.data;
    },
  },
  potions: {
    getAll: async (): Promise<Potion[]> => {
      // Simulated API call with more potions
      return [
        // Beginner Potions
        {
          name: "Potion of All-Purpose Magical Mess-Removing",
          effect: "Cleans magical messes",
          ingredients: ["Dragon Blood", "Unicorn Hair", "Phoenix Feather"],
          difficulty: "Beginner",
          brewingTime: "30 minutes",
          color: "Blue"
        },
        {
          name: "Forgetfulness Potion",
          effect: "Causes memory loss",
          ingredients: ["Lethe River Water", "Mistletoe Berries", "Valerian Sprigs", "Standard Ingredient"],
          difficulty: "Beginner",
          brewingTime: "45 minutes",
          color: "Blue"
        },
        {
          name: "Cure for Boils",
          effect: "Cures boils and skin conditions",
          ingredients: ["Snake Fangs", "Horned Slugs", "Porcupine Quills", "Flobberworm Mucus"],
          difficulty: "Beginner",
          brewingTime: "60 minutes",
          color: "Green"
        },
        {
          name: "Sleeping Draught",
          effect: "Induces deep sleep",
          ingredients: ["Valerian Root", "Lavender", "Chamomile", "Standard Ingredient"],
          difficulty: "Beginner",
          brewingTime: "45 minutes",
          color: "Purple"
        },
        {
          name: "Antidote to Common Poisons",
          effect: "Neutralizes common magical poisons",
          ingredients: ["Bezoar", "Unicorn Hair", "Mistletoe Berries", "Standard Ingredient"],
          difficulty: "Beginner",
          brewingTime: "90 minutes",
          color: "Clear"
        },
        {
          name: "Wiggenweld Potion",
          effect: "Restores health and energy",
          ingredients: ["Dittany", "Unicorn Hair", "Phoenix Feather", "Standard Ingredient"],
          difficulty: "Beginner",
          brewingTime: "75 minutes",
          color: "Golden"
        },
        
        // Intermediate Potions
        {
          name: "Draught of Peace",
          effect: "Relieves anxiety and agitation",
          ingredients: ["Powdered Moonstone", "Syrup of Hellebore", "Powdered Unicorn Horn", "Porcupine Quills"],
          difficulty: "Intermediate",
          brewingTime: "90 minutes",
          color: "Silver"
        },
        {
          name: "Skele-Gro",
          effect: "Regrows bones",
          ingredients: ["Dragon Blood", "Unicorn Hair", "Phoenix Feather"],
          difficulty: "Intermediate",
          brewingTime: "2 hours",
          color: "Green"
        },
        {
          name: "Wideye Potion",
          effect: "Prevents the drinker from falling asleep",
          ingredients: ["Wolfsbane", "Dried Billywig Stings", "Coffee", "Standard Ingredient"],
          difficulty: "Intermediate",
          brewingTime: "1 hour",
          color: "Orange"
        },
        {
          name: "Shrinking Solution",
          effect: "Causes the drinker to shrink in size",
          ingredients: ["Daisy Roots", "Shrivelfig", "Caterpillars", "Rat Spleen", "Leech Juice"],
          difficulty: "Intermediate",
          brewingTime: "2 hours",
          color: "Green"
        },
        {
          name: "Swelling Solution",
          effect: "Causes body parts to swell",
          ingredients: ["Puffer-fish Eyes", "Dried Nettles", "Dried Billywig Stings", "Standard Ingredient"],
          difficulty: "Intermediate",
          brewingTime: "1.5 hours",
          color: "Yellow"
        },
        {
          name: "Confusing Concoction",
          effect: "Causes confusion and disorientation",
          ingredients: ["Sneezewort", "Honeywater", "Valerian Sprigs", "Standard Ingredient"],
          difficulty: "Intermediate",
          brewingTime: "1 hour",
          color: "Pink"
        },
        {
          name: "Babbling Beverage",
          effect: "Causes uncontrollable babbling",
          ingredients: ["Sopophorous Bean", "Valerian Root", "Dittany", "Standard Ingredient"],
          difficulty: "Intermediate",
          brewingTime: "1.5 hours",
          color: "Blue"
        },
        
        // Advanced Potions
        {
          name: "Felix Felicis",
          effect: "Makes the drinker lucky for a period of time",
          ingredients: ["Ashwinder Eggs", "Squill Bulb", "Murtlap Tentacles", "Tincture of Thyme", "Occamy Eggshell", "Powdered Common Rue"],
          difficulty: "Advanced",
          brewingTime: "6 months",
          color: "Gold"
        },
        {
          name: "Polyjuice Potion",
          effect: "Transforms the drinker into another person",
          ingredients: ["Lacewing Flies", "Leeches", "Powdered Bicorn Horn", "Knotgrass", "Fluxweed", "Boomslang Skin", "Piece of the person you want to turn into"],
          difficulty: "Advanced",
          brewingTime: "1 month",
          color: "Muddy Brown"
        },
        {
          name: "Wolfsbane Potion",
          effect: "Eases the symptoms of lycanthropy",
          ingredients: ["Aconite", "Wolfsbane", "Silver", "Dittany"],
          difficulty: "Advanced",
          brewingTime: "3 weeks",
          color: "Blue"
        },
        {
          name: "Amortentia",
          effect: "Most powerful love potion in existence",
          ingredients: ["Pearl Dust", "Rose Thorns", "Moonstone", "Dragon Blood"],
          difficulty: "Advanced",
          brewingTime: "2 months",
          color: "Mother-of-Pearl"
        },
        {
          name: "Veritaserum",
          effect: "Forces the drinker to tell the truth",
          ingredients: ["Jobberknoll Feathers", "Dragon Blood", "Unicorn Hair", "Mandrake Root"],
          difficulty: "Advanced",
          brewingTime: "1 month",
          color: "Clear"
        },
        {
          name: "Draught of Living Death",
          effect: "Puts the drinker into a death-like sleep",
          ingredients: ["Asphodel", "Wormwood", "Valerian Root", "Sopophorous Bean", "Powdered Moonstone"],
          difficulty: "Advanced",
          brewingTime: "1 month",
          color: "Clear"
        },
        {
          name: "Elixir of Life",
          effect: "Extends life and grants immortality",
          ingredients: ["Philosopher's Stone", "Unicorn Blood", "Phoenix Tears", "Dragon Heartstring"],
          difficulty: "Advanced",
          brewingTime: "1 year",
          color: "Red"
        },
        {
          name: "Potion of Invisibility",
          effect: "Makes the drinker invisible",
          ingredients: ["Demiguise Hair", "Moonstone", "Silver", "Standard Ingredient"],
          difficulty: "Advanced",
          brewingTime: "3 months",
          color: "Clear"
        }
      ];
    },

    getRandom: async (): Promise<Potion> => {
      const allPotions = await api.potions.getAll();
      return allPotions[Math.floor(Math.random() * allPotions.length)];
    },

    getByDifficulty: async (difficulty: Potion['difficulty']): Promise<Potion[]> => {
      const allPotions = await api.potions.getAll();
      const filteredPotions = allPotions.filter(potion => potion.difficulty === difficulty);
      // Shuffle the array to ensure random order
      return filteredPotions.sort(() => Math.random() - 0.5);
    }
  },
}; 