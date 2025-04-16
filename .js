document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const finalMovesDisplay = document.getElementById('final-moves');
    const restartBtn = document.getElementById('restart');
    const playAgainBtn = document.getElementById('play-again');
    const gameOverScreen = document.getElementById('game-over');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Variáveis do jogo
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let currentTheme = 'default';
    
    // Emojis para as cartas (pode ser personalizado)
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Inicializa o jogo
    function initGame() {
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        
        // Cria pares de cartas
        const cardValues = [...emojis, ...emojis];
        
        // Embaralha as cartas
        shuffleArray(cardValues);
        
        // Limpa o tabuleiro
        gameBoard.innerHTML = '';
        
        // Cria as cartas no DOM
        cardValues.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-face card-front">${emoji}</div>
                <div class="card-face card-back"></div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        
        // Atualiza a lista de cartas
        cards = document.querySelectorAll('.memory-card');
    }
    
    // Embaralha um array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Vira uma carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // Primeira carta virada
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Segunda carta virada
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        
        checkForMatch();
    }
    
    // Verifica se as cartas são iguais
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Verifica se o jogo acabou
            if (matchedPairs === emojis.length) {
                setTimeout(() => {
                    gameOverScreen.style.display = 'flex';
                    finalMovesDisplay.textContent = moves;
                }, 1000);
            }
        } else {
            unflipCards();
        }
    }
    
    // Desativa cartas combinadas
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    // Desvira cartas que não combinam
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
        }, 1000);
    }
    
    // Reseta o tabuleiro após cada jogada
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Reinicia o jogo
    function restartGame() {
        // Desvira todas as cartas
        cards.forEach(card => {
            card.classList.remove('flip', 'matched');
            card.addEventListener('click', flipCard);
        });
        
        // Espera as animações terminarem antes de reiniciar
        setTimeout(() => {
            initGame();
        }, 500);
    }
    
    // Muda o tema do jogo
    function changeTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Atualiza o botão ativo
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
    
    // Event Listeners
    restartBtn.addEventListener('click', restartGame);
    playAgainBtn.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        restartGame();
    });
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            changeTheme(button.dataset.theme);
        });
    });
    
    // Inicializa o jogo com o tema padrão
    changeTheme(currentTheme);
    initGame();
});