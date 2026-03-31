// === MINI-GAMES ===

const MiniGames = {

  // === FEEDING GAME ===
  feedingGame(animalId) {
    const animal = GameState.data.animals.find(a => a.id === animalId);
    if (!animal) return;
    const type = GameState.getAnimalType(animal);
    const correctFoods = type.food;

    // Mix correct + wrong foods
    const allFoodKeys = Object.keys(FOOD_ITEMS).filter(f => !ANIMAL_TYPES[animal.typeId].vip || FOOD_ITEMS[f]);
    const wrongFoods = allFoodKeys.filter(f => !correctFoods.includes(f));
    const shuffledWrong = wrongFoods.sort(() => Math.random() - 0.5).slice(0, 4);
    const choices = [...correctFoods, ...shuffledWrong].sort(() => Math.random() - 0.5);

    const html = `
      <div class="minigame-overlay" onclick="if(event.target===this)App.closeMinigame()">
        <div class="minigame-container">
          <div class="minigame-title">🍖 Nourrir ${animal.name}</div>
          <div class="feeding-area">
            <div class="feeding-animal">${type.emoji}</div>
            <p style="font-size:0.9rem;color:#666;text-align:center">
              Quel est le plat prefere de ${animal.name} ?<br>
              <span style="font-size:0.8rem;color:var(--green)">Indice : c'est un ${type.name}</span>
            </p>
            <div class="food-choices">
              ${choices.map(foodKey => {
                const food = FOOD_ITEMS[foodKey];
                return `
                  <div class="food-item" data-food="${foodKey}"
                       onclick="MiniGames.selectFood(this, '${foodKey}', ${JSON.stringify(animalId)}, ${JSON.stringify(correctFoods)})">
                    ${food.emoji}
                    <div style="font-size:0.65rem;margin-top:4px">${food.name}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
  },

  selectFood(el, foodKey, animalId, correctFoods) {
    const correct = correctFoods.includes(foodKey);
    el.classList.add(correct ? 'correct' : 'wrong');

    if (correct) {
      GameState.updateAnimalStat(animalId, 'hunger', 30);
      GameState.updateAnimalStat(animalId, 'mood', 10);
      GameState.updateAnimalStat(animalId, 'affection', 5);

      // Check quest completion
      const quest = GameState.getActiveQuest();
      if (quest && quest.action === 'feed' && quest.targetAnimalId === animalId) {
        setTimeout(() => {
          App.closeMinigame();
          App.completeQuestWithReward(quest.id);
        }, 800);
        return;
      }

      setTimeout(() => {
        App.closeMinigame();
        App.showResult('🎉', 'Miam !', `${GameState.data.animals.find(a=>a.id===animalId)?.name} a adore !`, '+5 🪙');
        GameState.addCoins(5);
        App.render();
      }, 800);
    } else {
      setTimeout(() => el.classList.remove('wrong'), 500);
    }
  },

  // === WASHING GAME ===
  washingGame(animalId) {
    const animal = GameState.data.animals.find(a => a.id === animalId);
    if (!animal) return;
    const type = GameState.getAnimalType(animal);

    const dirtCount = 5;
    const spots = Array.from({length: dirtCount}, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    }));

    const html = `
      <div class="minigame-overlay" onclick="if(event.target===this)App.closeMinigame()">
        <div class="minigame-container">
          <div class="minigame-title">🛁 Laver ${animal.name}</div>
          <div class="washing-area">
            <p style="font-size:0.9rem;color:#666;text-align:center">
              Clique sur les taches de boue pour nettoyer ${animal.name} !
            </p>
            <div class="dirt-spots" id="wash-area" style="background:linear-gradient(135deg,#FFF0E0,#FFE0D0);border-radius:50%">
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3.5rem">${type.emoji}</div>
              ${spots.map(s => `
                <div class="dirt-spot" id="dirt-${s.id}" style="left:${s.x}%;top:${s.y}%"
                     onclick="MiniGames.cleanSpot(${s.id}, ${animalId}, ${dirtCount})">
                  💩
                </div>
              `).join('')}
            </div>
            <div class="wash-progress" id="wash-progress">0 / ${dirtCount} nettoye</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
    this._washCount = 0;
    this._washTotal = dirtCount;
  },

  cleanSpot(spotId, animalId, total) {
    const spot = document.getElementById(`dirt-${spotId}`);
    if (!spot || spot.classList.contains('cleaned')) return;
    spot.classList.add('cleaned');
    this._washCount++;
    const progress = document.getElementById('wash-progress');
    if (progress) progress.textContent = `${this._washCount} / ${total} nettoye`;

    if (this._washCount >= total) {
      GameState.updateAnimalStat(animalId, 'cleanliness', 40);
      GameState.updateAnimalStat(animalId, 'mood', 15);
      GameState.updateAnimalStat(animalId, 'affection', 5);

      const quest = GameState.getActiveQuest();
      if (quest && quest.action === 'wash' && quest.targetAnimalId === animalId) {
        setTimeout(() => {
          App.closeMinigame();
          App.completeQuestWithReward(quest.id);
        }, 600);
        return;
      }

      setTimeout(() => {
        App.closeMinigame();
        App.showResult('✨', 'Tout propre !', `${GameState.data.animals.find(a=>a.id===animalId)?.name} brille !`, '+5 🪙');
        GameState.addCoins(5);
        App.render();
      }, 600);
    }
  },

  // === PLAY GAME ===
  playGame(animalId) {
    const animal = GameState.data.animals.find(a => a.id === animalId);
    if (!animal) return;
    const type = GameState.getAnimalType(animal);

    let clicks = 0;
    const target = 8;

    const html = `
      <div class="minigame-overlay" onclick="if(event.target===this)App.closeMinigame()">
        <div class="minigame-container">
          <div class="minigame-title">🎾 Jouer avec ${animal.name}</div>
          <div style="text-align:center">
            <p style="font-size:0.9rem;color:#666">
              Lance la balle a ${animal.name} ! Clique vite !
            </p>
            <div id="play-ball" style="font-size:4rem;cursor:pointer;margin:20px;transition:all 0.1s;display:inline-block"
                 onclick="MiniGames.throwBall(${JSON.stringify(animalId)}, ${target})">
              🎾
            </div>
            <div style="font-size:3rem;margin:10px" id="play-animal">${type.emoji}</div>
            <div id="play-progress" style="font-family:'Fredoka One',cursive;color:var(--green);font-size:1.2rem">
              0 / ${target} lancers
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
    this._playCount = 0;
    this._playTarget = target;
  },

  throwBall(animalId, target) {
    this._playCount++;
    const ball = document.getElementById('play-ball');
    const animalEl = document.getElementById('play-animal');
    const progress = document.getElementById('play-progress');

    if (ball) {
      ball.style.transform = `translateY(-30px) rotate(${this._playCount * 45}deg)`;
      setTimeout(() => { if (ball) ball.style.transform = ''; }, 200);
    }
    if (animalEl) {
      animalEl.style.animation = 'none';
      animalEl.offsetHeight;
      animalEl.style.animation = 'bounce 0.5s';
    }
    if (progress) progress.textContent = `${this._playCount} / ${target} lancers`;

    if (this._playCount >= target) {
      GameState.updateAnimalStat(animalId, 'mood', 35);
      GameState.updateAnimalStat(animalId, 'energy', -15);
      GameState.updateAnimalStat(animalId, 'affection', 8);

      const quest = GameState.getActiveQuest();
      if (quest && quest.action === 'play' && quest.targetAnimalId === animalId) {
        setTimeout(() => {
          App.closeMinigame();
          App.completeQuestWithReward(quest.id);
        }, 500);
        return;
      }

      setTimeout(() => {
        App.closeMinigame();
        App.showResult('🎉', 'Super partie !', `${GameState.data.animals.find(a=>a.id===animalId)?.name} est ravi !`, '+5 🪙');
        GameState.addCoins(5);
        App.render();
      }, 500);
    }
  },

  // === SEARCH GAME ===
  searchGame(placeId) {
    const place = VILLAGE_PLACES.find(p => p.id === placeId);
    const itemSets = {
      forest: ['🍄', '🌸', '🦎', '🪵', '🍃', '🐛', '🌰', '🦉'],
      market: ['🧀', '🥕', '🍯', '🧶', '🪴', '🎁', '🍎', '🥖'],
      beach: ['🐚', '🦀', '⭐', '🪸', '🥥', '🐠', '🦑', '🌊'],
      mountain: ['🪨', '🦅', '❄️', '💎', '🌿', '🍂', '🐺', '⛰️'],
      cave: ['💎', '🦇', '🕯️', '🗝️', '🪙', '✨', '🪨', '🐀'],
      rainbow_field: ['🌈', '🦄', '🌸', '⭐', '🦋', '✨', '💐', '🌺'],
    };

    const items = (itemSets[placeId] || itemSets.forest).sort(() => Math.random() - 0.5).slice(0, 6);
    const targetItem = items[Math.floor(Math.random() * items.length)];

    const positions = items.map(() => ({
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 75,
    }));

    const bgColors = {
      forest: 'linear-gradient(180deg, #E8F5E9, #A5D6A7)',
      market: 'linear-gradient(180deg, #FFF8E1, #FFCC80)',
      beach: 'linear-gradient(180deg, #E0F7FA, #80DEEA)',
      mountain: 'linear-gradient(180deg, #ECEFF1, #B0BEC5)',
      cave: 'linear-gradient(180deg, #37474F, #546E7A)',
      rainbow_field: 'linear-gradient(180deg, #F3E5F5, #CE93D8)',
    };

    const html = `
      <div class="minigame-overlay" onclick="if(event.target===this)App.closeMinigame()">
        <div class="minigame-container">
          <div class="minigame-title">🔍 Explorer ${place ? place.name : ''}</div>
          <div class="search-hint">Trouve le ${targetItem} !</div>
          <div class="search-area" style="background:${bgColors[placeId] || bgColors.forest}">
            ${items.map((item, i) => `
              <div class="search-item" style="left:${positions[i].x}%;top:${positions[i].y}%"
                   onclick="MiniGames.findItem(this, '${item}', '${targetItem}', '${placeId}')">
                ${item}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    document.getElementById('game').insertAdjacentHTML('beforeend', html);
  },

  findItem(el, item, target, placeId) {
    if (item === target) {
      el.classList.add('found');
      GameState.addCoins(10);

      // Check exploration quest
      const quest = GameState.getActiveQuest();
      if (quest && quest.location === placeId) {
        setTimeout(() => {
          App.closeMinigame();
          App.completeQuestWithReward(quest.id);
        }, 600);
        return;
      }

      setTimeout(() => {
        App.closeMinigame();
        App.showResult('🎉', 'Trouve !', `Tu as trouve ${target} !`, '+10 🪙');
        App.render();
      }, 500);
    } else {
      el.style.animation = 'wiggle 0.5s';
      setTimeout(() => el.style.animation = '', 500);
    }
  },
};
