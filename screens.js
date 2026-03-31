// === SCREEN RENDERERS ===

const Screens = {

  // === TITLE SCREEN ===
  titleScreen() {
    const hasSave = GameState.hasSave();
    return `
      <div class="screen title-screen">
        <div class="title-animals">🏨</div>
        <div class="title-logo">Hotel des Animaux</div>
        <div class="title-subtitle">Prends soin de tes pensionnaires !</div>
        <div class="title-buttons">
          ${hasSave ? `<button class="btn btn-pink btn-large" onclick="App.continueGame()">▶ Continuer</button>` : ''}
          <button class="btn btn-green btn-large" onclick="App.newGame()">🌟 Nouvelle Partie</button>
          ${hasSave ? `<button class="btn btn-small btn-red" onclick="App.deleteGame()" style="opacity:0.7">Supprimer la sauvegarde</button>` : ''}
        </div>
      </div>
    `;
  },

  // === STATUS BAR ===
  statusBar() {
    const d = GameState.data;
    const level = GameState.getHotelLevel();
    return `
      <div class="status-bar">
        <div class="status-item"><span class="status-icon">🪙</span> ${d.coins}</div>
        <div class="status-item"><span class="status-icon">${level.icon}</span> ${level.name}</div>
        <div class="status-item"><span class="status-icon">⭐</span> ${d.stars}</div>
      </div>
    `;
  },

  // === NAV BAR ===
  navBar(active = 'lobby') {
    const tabs = [
      { id: 'lobby', icon: '🏨', label: 'Hotel' },
      { id: 'animals', icon: '🐾', label: 'Animaux' },
      { id: 'quests', icon: '📜', label: 'Quetes' },
      { id: 'village', icon: '🗺️', label: 'Village' },
      { id: 'shop', icon: '🛍️', label: 'Boutique' },
    ];
    return `
      <div class="nav-bar">
        ${tabs.map(t => `
          <button class="nav-btn ${active === t.id ? 'active' : ''}" onclick="App.navigate('${t.id}')">
            <span class="nav-icon">${t.icon}</span>
            ${t.label}
          </button>
        `).join('')}
      </div>
    `;
  },

  // === HOTEL LOBBY ===
  hotelLobby() {
    const d = GameState.data;
    const level = GameState.getHotelLevel();
    const activeQuest = GameState.getActiveQuest();

    const doors = [
      { icon: '🛏️', label: 'Chambres', desc: `${d.animals.length} animaux`, screen: 'animals', color: '#FFE0EC' },
      { icon: '🌿', label: 'Jardin', desc: 'Jouer dehors', screen: 'garden', color: '#E0FFE8' },
      { icon: '🍳', label: 'Cuisine', desc: 'Preparer les repas', screen: 'kitchen', color: '#FFF8E0' },
      { icon: '📜', label: 'Quetes', desc: `${d.quests.length} disponibles`, screen: 'quests', color: '#E0F0FF' },
      { icon: '🗺️', label: 'Village', desc: 'Explorer', screen: 'village', color: '#E8FFE0' },
      { icon: '🛍️', label: 'Boutique', desc: 'Acheter', screen: 'shop', color: '#FFF0E0' },
    ];

    const vipDoor = d.vipUnlocked
      ? { icon: '✨', label: 'Zone VIP', desc: 'Animaux magiques', screen: 'vip', color: '#F0E0FF' }
      : { icon: '🔒', label: 'Zone VIP', desc: '15 etoiles requises', screen: null, color: '#F0E0FF', locked: true };

    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="lobby-content">
          <div class="lobby-welcome">
            <h2>🏨 ${d.hotelName}</h2>
            <p style="color:#999;font-size:0.85rem">Jour ${d.dayCount} — ${level.name}</p>
            ${activeQuest ? `<p style="margin-top:8px;font-size:0.85rem;color:var(--blue)">📌 ${activeQuest.title}</p>` : ''}
          </div>

          <div class="lobby-grid">
            ${doors.map(d => `
              <div class="lobby-door" style="border-color:${d.color}" onclick="App.navigate('${d.screen}')">
                <div class="door-icon">${d.icon}</div>
                <div class="door-label">${d.label}</div>
                <div class="door-desc">${d.desc}</div>
              </div>
            `).join('')}
            <div class="lobby-door ${vipDoor.locked ? 'locked' : ''}" style="border-color:${vipDoor.color}"
                 onclick="${vipDoor.screen ? `App.navigate('${vipDoor.screen}')` : ''}">
              <div class="door-icon">${vipDoor.icon}</div>
              <div class="door-label">${vipDoor.label}</div>
              <div class="door-desc">${vipDoor.desc}</div>
              ${vipDoor.locked ? `<div class="door-lock">🔒 ${15 - GameState.data.stars} etoiles manquantes</div>` : ''}
            </div>
          </div>
        </div>
        ${this.navBar('lobby')}
      </div>
    `;
  },

  // === ANIMALS LIST ===
  animalsList() {
    const animals = GameState.data.animals;
    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <h2>🐾 Mes Pensionnaires</h2>
        </div>
        ${animals.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🐾</div>
            <div class="empty-text">Aucun animal pour le moment.<br>Complete des quetes pour en accueillir !</div>
          </div>
        ` : `
          <div class="animals-grid">
            ${animals.map(a => {
              const type = GameState.getAnimalType(a);
              const mood = GameState.getAnimalMood(a);
              return `
                <div class="animal-card ${type.vip ? 'vip' : ''}" onclick="App.openAnimalRoom(${JSON.stringify(a.id).replace(/"/g, '&quot;')})">
                  ${type.vip ? '<div class="vip-badge">VIP ✨</div>' : ''}
                  <div class="animal-emoji">${type.emoji}</div>
                  <div class="animal-name">${a.name}</div>
                  <div class="animal-breed">${type.name}</div>
                  <div class="animal-mood mood-${mood}">
                    ${mood === 'happy' ? '😊 Content' : mood === 'ok' ? '😐 Moyen' : '😢 Triste'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
        ${this.navBar('animals')}
      </div>
    `;
  },

  // === ANIMAL ROOM ===
  animalRoom(animalId) {
    const animal = GameState.data.animals.find(a => a.id === animalId);
    if (!animal) return this.animalsList();
    const type = GameState.getAnimalType(animal);

    const statBar = (label, value, icon) => {
      const cls = value >= 60 ? 'high' : value >= 30 ? 'mid' : 'low';
      return `
        <div class="stat-item">
          <div class="stat-label">${icon} ${label}</div>
          <div class="stat-bar"><div class="stat-fill ${cls}" style="width:${value}%"></div></div>
        </div>
      `;
    };

    return `
      <div class="screen">
        <div class="screen-header">
          <button class="back-btn" onclick="App.navigate('animals')">←</button>
          <h2>${type.emoji} ${animal.name}</h2>
        </div>
        <div class="room-content">
          <div class="room-animal">${type.emoji}</div>
          <div class="room-name">${animal.name}</div>
          <div class="room-owner">Proprietaire : ${animal.owner}</div>
          ${type.vip ? `<div style="color:var(--purple);font-weight:700;font-size:0.85rem">✨ ${type.specialNeed}</div>` : ''}

          <div class="stats-grid">
            ${statBar('Faim', animal.hunger, '🍖')}
            ${statBar('Humeur', animal.mood, '😊')}
            ${statBar('Proprete', animal.cleanliness, '🛁')}
            ${statBar('Energie', animal.energy, '⚡')}
          </div>

          <div style="width:100%;max-width:400px;text-align:center">
            <div class="stat-label">💕 Affection</div>
            <div class="stat-bar" style="height:14px"><div class="stat-fill high" style="width:${animal.affection}%;background:linear-gradient(90deg,var(--pink),var(--purple))"></div></div>
          </div>

          <div class="room-actions">
            <button class="btn btn-orange" onclick="App.startMinigame('feed', ${JSON.stringify(animalId).replace(/"/g, '&quot;')})">🍖 Nourrir</button>
            <button class="btn btn-blue" onclick="App.startMinigame('wash', ${JSON.stringify(animalId).replace(/"/g, '&quot;')})">🛁 Laver</button>
            <button class="btn btn-green" onclick="App.startMinigame('play', ${JSON.stringify(animalId).replace(/"/g, '&quot;')})">🎾 Jouer</button>
            <button class="btn btn-purple" onclick="App.petAnimal(${JSON.stringify(animalId).replace(/"/g, '&quot;')})">💕 Caresser</button>
          </div>
        </div>
      </div>
    `;
  },

  // === GARDEN ===
  garden() {
    const activities = [
      { icon: '🎾', name: 'Lancer la balle', desc: 'Les chiens adorent !', action: 'play_ball' },
      { icon: '🦋', name: 'Chasse aux papillons', desc: 'Pour les chats', action: 'play_butterfly' },
      { icon: '🏃', name: 'Course d\'obstacles', desc: 'Tous les animaux', action: 'play_race' },
      { icon: '🎵', name: 'Concert', desc: 'Les perroquets chantent !', action: 'play_music' },
    ];

    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <button class="back-btn" onclick="App.navigate('lobby')">←</button>
          <h2>🌿 Le Jardin</h2>
        </div>
        <div class="garden-content">
          <p style="text-align:center;color:#999;font-weight:600">Choisis une activite pour tes animaux !</p>
          ${activities.map(a => `
            <div class="garden-activity" onclick="App.gardenActivity('${a.action}')">
              <div class="garden-activity-icon">${a.icon}</div>
              <div class="garden-activity-name">${a.name}</div>
              <div style="font-size:0.8rem;color:#999">${a.desc}</div>
            </div>
          `).join('')}
        </div>
        ${this.navBar('lobby')}
      </div>
    `;
  },

  // === KITCHEN ===
  kitchen() {
    const animals = GameState.data.animals;
    const recipes = animals.slice(0, 4).map(a => {
      const type = GameState.getAnimalType(a);
      const favFood = type.food[0];
      const foodInfo = FOOD_ITEMS[favFood];
      return { animal: a, type, foodInfo };
    });

    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <button class="back-btn" onclick="App.navigate('lobby')">←</button>
          <h2>🍳 La Cuisine</h2>
        </div>
        <div class="kitchen-content">
          <p style="text-align:center;color:#999;font-weight:600">Prepare les repas de tes pensionnaires !</p>
          ${recipes.map(r => `
            <div class="recipe-card" onclick="App.startMinigame('feed', ${JSON.stringify(r.animal.id).replace(/"/g, '&quot;')})">
              <div class="recipe-icon">${r.type.emoji}</div>
              <div>
                <div class="recipe-name">Repas de ${r.animal.name}</div>
                <div class="recipe-desc">Prefere : ${r.foodInfo.emoji} ${r.foodInfo.name}</div>
                <div class="recipe-for">Faim : ${r.animal.hunger}%</div>
              </div>
            </div>
          `).join('')}
          ${animals.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">🍳</div>
              <div class="empty-text">Pas d'animaux a nourrir</div>
            </div>
          ` : ''}
        </div>
        ${this.navBar('lobby')}
      </div>
    `;
  },

  // === QUEST BOARD ===
  questBoard() {
    const quests = GameState.data.quests;
    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <h2>📜 Tableau des Quetes</h2>
        </div>
        <div class="quest-list">
          ${quests.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">📜</div>
              <div class="empty-text">Pas de quete disponible.<br>Reviens plus tard !</div>
            </div>
          ` : ''}
          ${quests.map(q => `
            <div class="quest-card ${q.active ? 'active' : ''} ${q.type === 'vip' ? 'vip-quest' : ''}"
                 onclick="App.selectQuest(${JSON.stringify(q.id).replace(/"/g, '&quot;')})">
              <div class="quest-title">
                ${q.active ? '✅' : '📋'} ${q.title}
                ${q.type === 'vip' ? ' ✨' : ''}
              </div>
              <div class="quest-desc">${q.desc}</div>
              <div style="font-size:0.8rem;color:var(--blue);margin-top:4px;font-weight:700">
                🎯 ${q.objective}
              </div>
              <div class="quest-reward">
                ${q.reward.coins ? `<span>🪙 +${q.reward.coins}</span>` : ''}
                ${q.reward.stars ? `<span>⭐ +${q.reward.stars}</span>` : ''}
                ${q.reward.newAnimal ? `<span>🐾 +1 animal</span>` : ''}
              </div>
              ${q.active ? `<button class="btn btn-green btn-small" style="margin-top:8px"
                onclick="event.stopPropagation(); App.tryCompleteQuest(${JSON.stringify(q.id).replace(/"/g, '&quot;')})">
                Terminer la quete</button>` : ''}
            </div>
          `).join('')}
        </div>
        ${this.navBar('quests')}
      </div>
    `;
  },

  // === VILLAGE MAP ===
  villageMap() {
    const stars = GameState.data.stars;
    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <h2>🗺️ Le Village</h2>
        </div>
        <div class="village-content">
          <div class="village-title">Explore les alentours !</div>
          <div class="village-places">
            ${VILLAGE_PLACES.map(p => {
              const locked = stars < p.unlockStars;
              return `
                <div class="place-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `App.visitPlace('${p.id}')`}">
                  <div class="place-icon">${p.emoji}</div>
                  <div class="place-name">${p.name}</div>
                  <div class="place-desc">${locked ? `🔒 ${p.unlockStars} etoiles` : p.desc}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ${this.navBar('village')}
      </div>
    `;
  },

  // === SHOP ===
  shop() {
    const categories = [
      { key: 'food', title: '🍖 Nourriture', items: SHOP_ITEMS.food },
      { key: 'toys', title: '🎾 Jouets', items: SHOP_ITEMS.toys },
      { key: 'decor', title: '🏠 Decoration', items: SHOP_ITEMS.decor },
    ];

    if (GameState.data.vipUnlocked) {
      categories.push({ key: 'vip', title: '✨ VIP', items: SHOP_ITEMS.vip });
    }

    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <h2>🛍️ Boutique</h2>
        </div>
        <div class="shop-content">
          ${categories.map(cat => `
            <div class="shop-category">${cat.title}</div>
            <div class="shop-items">
              ${cat.items.map(item => {
                const owned = GameState.data.inventory.includes(item.id);
                return `
                  <div class="shop-item ${owned ? 'owned' : ''}" onclick="${owned ? '' : `App.buyItem('${cat.key}', '${item.id}')`}">
                    <div class="shop-item-icon">${item.emoji}</div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">${owned ? '✓ Achete' : `🪙 ${item.price}`}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
        ${this.navBar('shop')}
      </div>
    `;
  },

  // === VIP ZONE ===
  vipZone() {
    const vipAnimals = GameState.data.animals.filter(a => ANIMAL_TYPES[a.typeId].vip);
    const allVipTypes = Object.entries(ANIMAL_TYPES).filter(([_, t]) => t.vip);

    return `
      <div class="screen">
        ${this.statusBar()}
        <div class="screen-header">
          <button class="back-btn" onclick="App.navigate('lobby')">←</button>
          <h2>✨ Zone VIP</h2>
        </div>
        <div class="vip-content">
          <div class="vip-header">
            <h2>✨ Animaux Magiques ✨</h2>
            <p style="color:#999;font-size:0.9rem">Des creatures extraordinaires !</p>
          </div>

          ${vipAnimals.length > 0 ? `
            <div class="animals-grid" style="padding:0">
              ${vipAnimals.map(a => {
                const type = GameState.getAnimalType(a);
                const mood = GameState.getAnimalMood(a);
                return `
                  <div class="animal-card vip" onclick="App.openAnimalRoom(${JSON.stringify(a.id).replace(/"/g, '&quot;')})">
                    <div class="vip-badge">VIP ✨</div>
                    <div class="animal-emoji">${type.emoji}</div>
                    <div class="animal-name">${a.name}</div>
                    <div class="animal-breed">${type.name}</div>
                    <div style="font-size:0.75rem;color:var(--purple)">${type.specialNeed}</div>
                    <div class="animal-mood mood-${mood}">
                      ${mood === 'happy' ? '😊 Content' : mood === 'ok' ? '😐 Moyen' : '😢 Triste'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-icon">✨</div>
              <div class="empty-text">Aucun animal VIP pour l'instant.<br>Complete des quetes speciales pour en debloquer !</div>
            </div>
          `}

          <div style="margin-top:20px;text-align:center">
            <div class="shop-category">Collection VIP</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px">
              ${allVipTypes.map(([id, t]) => {
                const owned = vipAnimals.some(a => a.typeId === id);
                return `
                  <div style="padding:12px;border-radius:16px;background:${owned ? '#F0E0FF' : '#F5F5F5'};text-align:center;min-width:80px">
                    <div style="font-size:2rem;${owned ? '' : 'filter:grayscale(1);opacity:0.4'}">${t.emoji}</div>
                    <div style="font-size:0.75rem;font-weight:700;${owned ? 'color:var(--purple)' : 'color:#CCC'}">${t.name}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        ${this.navBar('lobby')}
      </div>
    `;
  },

  // === PLACE SCREEN (exploration) ===
  placeScreen(placeId) {
    const place = VILLAGE_PLACES.find(p => p.id === placeId);
    if (!place) return this.villageMap();

    const descriptions = {
      forest: 'Les arbres murmurent des secrets. Des lumieres dansent entre les branches...',
      market: 'Les etals debordent de bonnes choses ! Que vas-tu trouver ?',
      beach: 'Le sable est chaud et les vagues apaisantes. Parfait pour se detendre !',
      mountain: 'L\'air frais de la montagne ! On voit tout le village d\'ici.',
      cave: 'Il fait sombre... mais quelque chose brille au fond !',
      rainbow_field: 'Un champ magique ou poussent des fleurs de toutes les couleurs !',
    };

    const items = {
      forest: ['🍄', '🌸', '🦎', '🪵', '🍃', '🐛'],
      market: ['🧀', '🥕', '🍯', '🧶', '🪴', '🎁'],
      beach: ['🐚', '🦀', '⭐', '🪸', '🥥', '🐠'],
      mountain: ['🪨', '🦅', '❄️', '💎', '🌿', '🍂'],
      cave: ['💎', '🦇', '🕯️', '🗝️', '🪙', '✨'],
      rainbow_field: ['🌈', '🦄', '🌸', '⭐', '🦋', '✨'],
    };

    return `
      <div class="screen">
        <div class="screen-header">
          <button class="back-btn" onclick="App.navigate('village')">←</button>
          <h2>${place.emoji} ${place.name}</h2>
        </div>
        <div style="flex:1;padding:16px;display:flex;flex-direction:column;gap:16px;align-items:center">
          <div style="font-size:4rem">${place.emoji}</div>
          <p style="text-align:center;color:#666;max-width:300px">${descriptions[placeId] || ''}</p>
          <button class="btn btn-green" onclick="App.startMinigame('search', '${placeId}')">🔍 Explorer</button>

          <div style="margin-top:12px;text-align:center">
            <p style="font-size:0.85rem;color:#999;font-weight:600">Objets a trouver :</p>
            <div style="font-size:2rem;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px">
              ${(items[placeId] || []).map(i => `<span>${i}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
