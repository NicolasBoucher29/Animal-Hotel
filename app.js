// === MAIN APP ===

const App = {
  currentScreen: 'title',
  currentAnimalId: null,
  currentPlaceId: null,
  tickInterval: null,

  // Initialize
  init() {
    this.render();
  },

  // Main render
  render() {
    const game = document.getElementById('game');
    switch (this.currentScreen) {
      case 'title':
        game.innerHTML = Screens.titleScreen();
        break;
      case 'lobby':
        game.innerHTML = Screens.hotelLobby();
        break;
      case 'animals':
        game.innerHTML = Screens.animalsList();
        break;
      case 'animalRoom':
        game.innerHTML = Screens.animalRoom(this.currentAnimalId);
        break;
      case 'garden':
        game.innerHTML = Screens.garden();
        break;
      case 'kitchen':
        game.innerHTML = Screens.kitchen();
        break;
      case 'quests':
        game.innerHTML = Screens.questBoard();
        break;
      case 'village':
        game.innerHTML = Screens.villageMap();
        break;
      case 'place':
        game.innerHTML = Screens.placeScreen(this.currentPlaceId);
        break;
      case 'shop':
        game.innerHTML = Screens.shop();
        break;
      case 'vip':
        game.innerHTML = Screens.vipZone();
        break;
    }
  },

  // Navigation
  navigate(screen) {
    this.currentScreen = screen;
    this.render();
  },

  // New game
  newGame() {
    GameState.newGame();
    this.startGameLoop();
    this.currentScreen = 'lobby';
    this.render();
    this.showEvent({
      icon: '🏨',
      title: 'Bienvenue !',
      text: 'Tu es le nouveau gerant de l\'Hotel des Animaux ! Prends bien soin de tes pensionnaires.',
    });
  },

  // Continue game
  continueGame() {
    if (GameState.load()) {
      this.startGameLoop();
      this.currentScreen = 'lobby';
      this.render();
    }
  },

  // Delete game
  deleteGame() {
    GameState.deleteSave();
    this.render();
  },

  // Start game loop (stat decay + events)
  startGameLoop() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => {
      GameState.tickStats();

      // Random events
      const event = GameState.checkRandomEvent();
      if (event && this.currentScreen !== 'title') {
        this.showEvent(event);
      }

      // Re-render if on a stats screen
      if (this.currentScreen === 'animalRoom' || this.currentScreen === 'animals') {
        this.render();
      }
    }, 15000); // Every 15 seconds
  },

  // Open animal room
  openAnimalRoom(animalId) {
    this.currentAnimalId = animalId;
    this.currentScreen = 'animalRoom';
    this.render();
  },

  // Pet an animal
  petAnimal(animalId) {
    GameState.updateAnimalStat(animalId, 'mood', 10);
    GameState.updateAnimalStat(animalId, 'affection', 8);
    const animal = GameState.data.animals.find(a => a.id === animalId);
    this.showResult('💕', 'Caresse !', `${animal?.name} ronronne de plaisir !`, '+10 humeur');
    this.render();
  },

  // Start a minigame
  startMinigame(type, id) {
    switch (type) {
      case 'feed': MiniGames.feedingGame(id); break;
      case 'wash': MiniGames.washingGame(id); break;
      case 'play': MiniGames.playGame(id); break;
      case 'search': MiniGames.searchGame(id); break;
    }
  },

  // Close minigame overlay
  closeMinigame() {
    const overlay = document.querySelector('.minigame-overlay');
    if (overlay) overlay.remove();
  },

  // Garden activity
  gardenActivity(action) {
    const animals = GameState.data.animals;
    if (animals.length === 0) {
      this.showResult('😅', 'Oups !', 'Il n\'y a pas d\'animaux a faire jouer !', '');
      return;
    }

    const messages = {
      play_ball: { emoji: '🎾', title: 'Balle !', text: 'Tous les animaux courent apres la balle !' },
      play_butterfly: { emoji: '🦋', title: 'Papillons !', text: 'Les chats adorent chasser les papillons !' },
      play_race: { emoji: '🏃', title: 'Course !', text: 'C\'est parti pour une course folle !' },
      play_music: { emoji: '🎵', title: 'Concert !', text: 'Quelle belle melodie !' },
    };

    const msg = messages[action] || messages.play_ball;

    // Boost all animals mood
    animals.forEach(a => {
      GameState.updateAnimalStat(a.id, 'mood', 15);
      GameState.updateAnimalStat(a.id, 'energy', -10);
    });
    GameState.addCoins(3);

    this.showResult(msg.emoji, msg.title, msg.text, '+15 humeur pour tous !');

    // Check play quest
    const quest = GameState.getActiveQuest();
    if (quest && quest.action === 'play') {
      setTimeout(() => this.completeQuestWithReward(quest.id), 2000);
    }
  },

  // Visit a place
  visitPlace(placeId) {
    this.currentPlaceId = placeId;
    this.currentScreen = 'place';
    this.render();
  },

  // Select a quest
  selectQuest(questId) {
    const quest = GameState.data.quests.find(q => q.id === questId);
    if (!quest) return;

    if (quest.active) {
      // Already active, show info
      QuestSystem.showDialog('vet', `Mission en cours : ${quest.objective}\n\nRecompense : 🪙 ${quest.reward.coins || 0} | ⭐ ${quest.reward.stars || 0}`);
    } else {
      // Start quest dialog
      QuestSystem.startQuestDialog(quest);
    }
  },

  // Try to complete quest (from button)
  tryCompleteQuest(questId) {
    const quest = GameState.data.quests.find(q => q.id === questId);
    if (!quest) return;

    // If quest has a specific action, check
    if (quest.action === 'investigate' || quest.action === 'report' || quest.action === 'welcome' || quest.action === 'hatch') {
      QuestSystem.investigateDialog();
      return;
    }

    if (quest.action === 'feed' || quest.action === 'wash' || quest.action === 'play') {
      QuestSystem.showDialog('vet', `Tu dois d'abord ${quest.action === 'feed' ? 'nourrir' : quest.action === 'wash' ? 'laver' : 'jouer avec'} l'animal pour terminer cette quete ! Va dans sa chambre.`);
      return;
    }

    if (quest.location) {
      QuestSystem.showDialog('postman', `Tu dois explorer ${VILLAGE_PLACES.find(p => p.id === quest.location)?.name || 'le lieu'} pour terminer cette quete ! Va au Village.`);
      return;
    }

    // Fallback: complete directly
    this.completeQuestWithReward(questId);
  },

  // Complete quest with fanfare
  completeQuestWithReward(questId) {
    const quest = GameState.completeQuest(questId);
    if (!quest) return;

    this.showResult(
      '🎉',
      'Quete terminee !',
      quest.title,
      `🪙 +${quest.reward.coins || 0}  ⭐ +${quest.reward.stars || 0}${quest.reward.newAnimal ? '  🐾 +1 animal' : ''}`
    );

    // Check for hotel level up
    const level = GameState.getHotelLevel();
    if (level.level > 1) {
      setTimeout(() => {
        const levelInfo = HOTEL_LEVELS.find(l => l.level === level.level);
        if (levelInfo && GameState.data.hotelLevel === level.level && GameState.data.stars === levelInfo.stars + (quest.reward.stars || 0)) {
          this.showEvent({
            icon: '⭐',
            title: 'Hotel ameliore !',
            text: `Ton hotel est maintenant un ${levelInfo.name} ! Tu peux accueillir plus d'animaux.`,
          });
        }
      }, 2500);
    }

    // Check VIP unlock
    if (GameState.data.vipUnlocked && GameState.data.stars >= 15 && GameState.data.stars < 15 + (quest.reward.stars || 0) + 1) {
      setTimeout(() => {
        this.showEvent({
          icon: '✨',
          title: 'Zone VIP debloquee !',
          text: 'Tu as deverrouille la Zone VIP ! Des animaux magiques t\'attendent !',
        });
      }, 3000);
    }

    this.render();
  },

  // Buy item from shop
  buyItem(category, itemId) {
    const items = SHOP_ITEMS[category];
    const item = items?.find(i => i.id === itemId);
    if (!item) return;

    if (GameState.data.inventory.includes(item.id)) {
      this.showResult('😅', 'Deja achete !', `Tu as deja ${item.name}.`, '');
      return;
    }

    if (GameState.buyItem(item)) {
      this.showResult('🛍️', 'Achete !', `Tu as achete ${item.emoji} ${item.name} !`, `-${item.price} 🪙`);
      this.render();
    } else {
      this.showResult('😢', 'Pas assez !', `Il te faut ${item.price} pieces pour ${item.name}.`, `Tu as ${GameState.data.coins} 🪙`);
    }
  },

  // Show result popup
  showResult(emoji, title, text, reward) {
    const html = `
      <div class="result-overlay" id="result-overlay" onclick="App.closeResult()">
        <div class="result-card" onclick="event.stopPropagation()">
          <div class="result-emoji">${emoji}</div>
          <div class="result-title">${title}</div>
          <div class="result-text">${text}</div>
          ${reward ? `<div class="result-reward">${reward}</div>` : ''}
          <button class="btn btn-green" onclick="App.closeResult()">Super !</button>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
  },

  closeResult() {
    const overlay = document.getElementById('result-overlay');
    if (overlay) overlay.remove();
  },

  // Show event popup
  showEvent(event) {
    const html = `
      <div class="event-overlay" id="event-overlay">
        <div class="event-popup">
          <div class="event-icon">${event.icon}</div>
          <div class="event-title">${event.title}</div>
          <div class="event-text">${event.text}</div>
          <button class="btn btn-pink" onclick="App.closeEvent()">OK !</button>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
  },

  closeEvent() {
    const overlay = document.getElementById('event-overlay');
    if (overlay) overlay.remove();
    this.render();
  },
};

// === START ===
document.addEventListener('DOMContentLoaded', () => App.init());
