// === GAME STATE MANAGER ===

const GameState = {
  // Current game data
  data: null,

  // Create a new game
  newGame() {
    this.data = {
      hotelName: 'Mon Hotel',
      coins: 50,
      stars: 0,
      hotelLevel: 1,
      animals: [],
      quests: [],
      completedQuests: [],
      inventory: [],
      ownedDecor: [],
      vipUnlocked: false,
      totalAnimalsHelped: 0,
      dayCount: 1,
      lastEventTime: 0,
    };
    // Start with 2 animals
    this.addRandomAnimal();
    this.addRandomAnimal();
    // Generate initial quests
    this.generateQuests();
    this.save();
    return this.data;
  },

  // Save to localStorage
  save() {
    try {
      localStorage.setItem('hotelDesAnimaux', JSON.stringify(this.data));
    } catch(e) { console.warn('Save failed:', e); }
  },

  // Load from localStorage
  load() {
    try {
      const saved = localStorage.getItem('hotelDesAnimaux');
      if (saved) {
        this.data = JSON.parse(saved);
        return true;
      }
    } catch(e) { console.warn('Load failed:', e); }
    return false;
  },

  // Check if save exists
  hasSave() {
    return localStorage.getItem('hotelDesAnimaux') !== null;
  },

  // Delete save
  deleteSave() {
    localStorage.removeItem('hotelDesAnimaux');
    this.data = null;
  },

  // Add a random animal
  addRandomAnimal(forceVip = false) {
    const types = Object.entries(ANIMAL_TYPES).filter(([_, a]) => forceVip ? a.vip : !a.vip);
    const [typeId, typeData] = types[Math.floor(Math.random() * types.length)];
    const names = ANIMAL_NAMES[typeData.type] || ['Ami'];
    const name = names[Math.floor(Math.random() * names.length)];
    const owner = OWNER_NAMES[Math.floor(Math.random() * OWNER_NAMES.length)];

    const animal = {
      id: Date.now() + Math.random(),
      typeId,
      name,
      owner,
      hunger: 60 + Math.floor(Math.random() * 30),
      mood: 60 + Math.floor(Math.random() * 30),
      cleanliness: 60 + Math.floor(Math.random() * 30),
      energy: 60 + Math.floor(Math.random() * 30),
      affection: 30 + Math.floor(Math.random() * 20),
      arrivedDay: this.data.dayCount,
    };

    this.data.animals.push(animal);
    this.save();
    return animal;
  },

  // Get animal type info
  getAnimalType(animal) {
    return ANIMAL_TYPES[animal.typeId];
  },

  // Update animal stat
  updateAnimalStat(animalId, stat, change) {
    const animal = this.data.animals.find(a => a.id === animalId);
    if (animal) {
      animal[stat] = Math.max(0, Math.min(100, animal[stat] + change));
      this.save();
    }
  },

  // Get overall mood string
  getAnimalMood(animal) {
    const avg = (animal.hunger + animal.mood + animal.cleanliness + animal.energy) / 4;
    if (avg >= 70) return 'happy';
    if (avg >= 40) return 'ok';
    return 'sad';
  },

  // Get hotel level info
  getHotelLevel() {
    let level = HOTEL_LEVELS[0];
    for (const l of HOTEL_LEVELS) {
      if (this.data.stars >= l.stars) level = l;
    }
    return level;
  },

  // Add coins
  addCoins(amount) {
    this.data.coins += amount;
    this.save();
  },

  // Spend coins
  spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  },

  // Add stars
  addStars(amount) {
    this.data.stars += amount;
    // Check for VIP unlock
    if (this.data.stars >= 15 && !this.data.vipUnlocked) {
      this.data.vipUnlocked = true;
    }
    // Check hotel level up
    const newLevel = this.getHotelLevel();
    if (newLevel.level > this.data.hotelLevel) {
      this.data.hotelLevel = newLevel.level;
    }
    this.save();
  },

  // Generate quests
  generateQuests() {
    if (this.data.quests.length >= 3) return;

    const available = QUEST_TEMPLATES.filter(q => {
      if (q.requiresVip && !this.data.vipUnlocked) return false;
      if (this.data.quests.some(eq => eq.templateId === q.id)) return false;
      return true;
    });

    while (this.data.quests.length < 3 && available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      const template = available.splice(idx, 1)[0];

      // Pick a random animal for personalization
      const animal = this.data.animals.length > 0
        ? this.data.animals[Math.floor(Math.random() * this.data.animals.length)]
        : null;
      const animalName = animal ? animal.name : 'un animal';
      const ownerName = animal ? animal.owner : 'un proprietaire';

      this.data.quests.push({
        id: Date.now() + Math.random(),
        templateId: template.id,
        title: template.title,
        desc: template.desc.replace('{animal}', animalName).replace('{owner}', ownerName),
        objective: template.objective.replace('{animal}', animalName).replace('{owner}', ownerName),
        reward: { ...template.reward },
        type: template.type,
        action: template.action || null,
        location: template.location || null,
        targetAnimalId: animal ? animal.id : null,
        active: false,
        progress: 0,
        maxProgress: 1,
      });
    }
    this.save();
  },

  // Activate quest
  activateQuest(questId) {
    const quest = this.data.quests.find(q => q.id === questId);
    if (quest) {
      // Deactivate others
      this.data.quests.forEach(q => q.active = false);
      quest.active = true;
      this.save();
    }
  },

  // Complete quest
  completeQuest(questId) {
    const idx = this.data.quests.findIndex(q => q.id === questId);
    if (idx === -1) return null;

    const quest = this.data.quests[idx];
    this.data.quests.splice(idx, 1);
    this.data.completedQuests.push(quest.templateId);

    // Give rewards
    if (quest.reward.coins) this.addCoins(quest.reward.coins);
    if (quest.reward.stars) this.addStars(quest.reward.stars);
    if (quest.reward.newAnimal) this.addRandomAnimal(quest.type === 'vip');

    this.data.totalAnimalsHelped++;
    this.generateQuests();
    this.save();
    return quest;
  },

  // Get active quest
  getActiveQuest() {
    return this.data.quests.find(q => q.active) || null;
  },

  // Buy shop item
  buyItem(item) {
    if (!this.spendCoins(item.price)) return false;
    this.data.inventory.push(item.id);
    this.save();
    return true;
  },

  // Decay stats (simulate time passing)
  tickStats() {
    this.data.animals.forEach(a => {
      a.hunger = Math.max(0, a.hunger - 2);
      a.mood = Math.max(0, a.mood - 1);
      a.cleanliness = Math.max(0, a.cleanliness - 1);
      a.energy = Math.min(100, a.energy + 1);
    });
    this.save();
  },

  // Check for random event
  checkRandomEvent() {
    const now = Date.now();
    if (now - this.data.lastEventTime < 60000) return null; // Max 1 event per minute
    if (Math.random() > 0.15) return null; // 15% chance

    this.data.lastEventTime = now;
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    this.applyEventEffect(event.effect);
    this.save();
    return event;
  },

  // Apply event effect
  applyEventEffect(effect) {
    if (effect === 'newAnimal') {
      const level = this.getHotelLevel();
      if (this.data.animals.length < level.maxAnimals) {
        this.addRandomAnimal();
      }
      return;
    }

    const match = effect.match(/^(\w+)([+-])(\d+)$/);
    if (!match) return;
    const [, target, op, val] = match;
    const amount = parseInt(val) * (op === '+' ? 1 : -1);

    if (target === 'coins') this.data.coins = Math.max(0, this.data.coins + amount);
    else if (target === 'stars') this.data.stars = Math.max(0, this.data.stars + amount);
    else if (target === 'all_mood') {
      this.data.animals.forEach(a => a.mood = Math.max(0, Math.min(100, a.mood + amount)));
    } else if (target === 'random_mood' && this.data.animals.length > 0) {
      const a = this.data.animals[Math.floor(Math.random() * this.data.animals.length)];
      a.mood = Math.max(0, Math.min(100, a.mood + amount));
    }
  },
};
