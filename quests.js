// === QUEST & DIALOG SYSTEM ===

const QuestSystem = {

  // Show dialog box
  showDialog(speaker, text, choices = null, onChoice = null) {
    const npc = NPCS[speaker] || { name: speaker, emoji: '💬' };

    const html = `
      <div class="dialog-overlay" id="dialog-overlay">
        <div class="dialog-box">
          <div class="dialog-speaker">${npc.emoji} ${npc.name}</div>
          <div class="dialog-text">${text}</div>
          ${choices ? `
            <div class="dialog-choices">
              ${choices.map((c, i) => `
                <div class="dialog-choice" onclick="QuestSystem.handleChoice(${i})">${c.text}</div>
              `).join('')}
            </div>
          ` : `
            <button class="btn btn-blue btn-small" onclick="QuestSystem.closeDialog()" style="width:100%">OK</button>
          `}
        </div>
      </div>
    `;

    document.getElementById('game').insertAdjacentHTML('beforeend', html);
    this._choices = choices;
    this._onChoice = onChoice;
  },

  handleChoice(index) {
    const choice = this._choices?.[index];
    this.closeDialog();
    if (choice?.action) choice.action();
    if (this._onChoice) this._onChoice(index);
  },

  closeDialog() {
    const overlay = document.getElementById('dialog-overlay');
    if (overlay) overlay.remove();
  },

  // Quest interaction dialogs
  startQuestDialog(quest) {
    const dialogs = {
      care: () => {
        this.showDialog('vet', `J'ai besoin de ton aide ! ${quest.desc}`, [
          { text: '🎯 J\'y vais tout de suite !', action: () => { GameState.activateQuest(quest.id); App.render(); } },
          { text: '⏳ Plus tard peut-etre', action: () => {} },
        ]);
      },
      explore: () => {
        this.showDialog('postman', `Salut ! ${quest.desc}`, [
          { text: '🗺️ Je pars explorer !', action: () => { GameState.activateQuest(quest.id); App.render(); } },
          { text: '⏳ Pas maintenant', action: () => {} },
        ]);
      },
      mystery: () => {
        this.showDialog('neighbor', `Psst... ${quest.desc}`, [
          { text: '🔍 Interessant, j\'enquete !', action: () => { GameState.activateQuest(quest.id); App.render(); } },
          { text: '😰 Ca fait un peu peur...', action: () => {} },
        ]);
      },
      social: () => {
        this.showDialog('postman', `${quest.desc}`, [
          { text: '📱 Je m\'en occupe !', action: () => { GameState.activateQuest(quest.id); App.render(); } },
          { text: '⏳ J\'ai pas le temps la', action: () => {} },
        ]);
      },
      vip: () => {
        this.showDialog('neighbor', `✨ ${quest.desc}`, [
          { text: '✨ Mission acceptee !', action: () => { GameState.activateQuest(quest.id); App.render(); } },
          { text: '⏳ Plus tard', action: () => {} },
        ]);
      },
    };

    const showFn = dialogs[quest.type] || dialogs.care;
    showFn();
  },

  // Quest completion dialog
  showQuestComplete(quest) {
    const lines = [
      'Fantastique travail !',
      'Tu es un vrai champion !',
      'Les animaux t\'adorent !',
      'Incroyable ! Continue comme ca !',
      'Bravo, mission accomplie !',
    ];
    const line = lines[Math.floor(Math.random() * lines.length)];

    this.showDialog('vet', `${line}\n\nRecompenses :\n${quest.reward.coins ? `🪙 +${quest.reward.coins} pieces` : ''}\n${quest.reward.stars ? `⭐ +${quest.reward.stars} etoiles` : ''}\n${quest.reward.newAnimal ? '🐾 +1 nouvel animal !' : ''}`, null);
  },

  // Generic interaction for quest actions
  handleQuestAction(action) {
    const quest = GameState.getActiveQuest();
    if (!quest) return false;

    // Check if this action matches the quest
    if (quest.action === action) {
      return true; // Signal to the caller that this counts
    }
    return false;
  },

  // Investigation mini-quest
  investigateDialog() {
    const quest = GameState.getActiveQuest();
    if (!quest || (quest.action !== 'investigate' && quest.action !== 'report' && quest.action !== 'welcome' && quest.action !== 'hatch')) {
      this.showDialog('vet', 'Tout va bien a l\'hotel ! Pas de mystere pour le moment.');
      return;
    }

    if (quest.action === 'investigate') {
      this.showDialog('neighbor', 'Hmm... Tu as entendu ces bruits ? Regarde bien autour de toi...', [
        { text: '🔍 Verifier les chambres', action: () => {
          this.showDialog('neighbor', 'Ah ha ! C\'etait juste le hamster qui faisait sa roue la nuit ! Mystere resolu !', null);
          setTimeout(() => App.completeQuestWithReward(quest.id), 1500);
        }},
        { text: '👀 Regarder dehors', action: () => {
          this.showDialog('neighbor', 'Rien dehors... Le bruit vient de l\'interieur. Essaye les chambres !');
        }},
      ]);
    } else if (quest.action === 'report') {
      this.showDialog('postman', `Le proprietaire est au telephone. Dis-lui que tout va bien !`, [
        { text: '📱 "Votre animal est heureux et en forme !"', action: () => {
          this.showDialog('postman', 'Le proprietaire est rassure ! Merci !', null);
          setTimeout(() => App.completeQuestWithReward(quest.id), 1500);
        }},
        { text: '📱 "Il s\'amuse beaucoup ici !"', action: () => {
          this.showDialog('postman', 'Super nouvelle ! Le proprietaire est content.', null);
          setTimeout(() => App.completeQuestWithReward(quest.id), 1500);
        }},
      ]);
    } else if (quest.action === 'welcome') {
      this.showDialog('postman', 'Un nouveau client arrive ! Prepare une chambre.', [
        { text: '🛏️ Preparer la plus belle chambre', action: () => {
          this.showDialog('postman', 'Parfait ! Le nouveau pensionnaire est installe !', null);
          setTimeout(() => App.completeQuestWithReward(quest.id), 1500);
        }},
      ]);
    } else if (quest.action === 'hatch') {
      this.showDialog('neighbor', '✨ L\'oeuf brille de plus en plus...', [
        { text: '🔥 Le garder au chaud', action: () => {
          this.showDialog('neighbor', '✨ L\'oeuf eclot ! Un adorable dragon miniature apparait !', null);
          setTimeout(() => App.completeQuestWithReward(quest.id), 1500);
        }},
      ]);
    }
  },
};
