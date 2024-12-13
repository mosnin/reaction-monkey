document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    let targetColor;
    let score = 0;
    let interval;
    let timeInterval;
    let gameSettings = {
        time: 30,
        difficulty: 'easy',
        intervalSpeed: 2000,
        soundEnabled: true
    };

    // Sound effects
    const sounds = {
        correct: new Audio('./assets/sounds/correct.mp3'),
        wrong: new Audio('./assets/sounds/wrong.wav'),
        gameOver: new Audio('./assets/sounds/gameover.mp3')
    };

    // Dummy leaderboard data
    const leaderboardData = [
        { rank: 1, player: "MonkeyMaster", score: 500 },
        { rank: 2, player: "BananaKing", score: 450 },
        { rank: 3, player: "ReflexPro", score: 400 },
        { rank: 4, player: "SpeedDemon", score: 350 },
        { rank: 5, player: "QuickClicker", score: 300 }
    ];

    // Initialize button event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        hideAllContainers();
        document.getElementById('menu-container').style.display = 'flex';
    });
    document.getElementById('instructions-btn').addEventListener('click', showInstructions);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('leaderboard-btn').addEventListener('click', showLeaderboard);
    
    // Instructions buttons
    document.getElementById('instructions-start-btn').addEventListener('click', () => {
        hideAllContainers();
        document.getElementById('menu-container').style.display = 'flex';
    });
    document.getElementById('instructions-back-btn').addEventListener('click', showStartScreen);
    
    // Menu buttons
    document.getElementById('menu-start-btn').addEventListener('click', startGame);
    document.getElementById('menu-back-btn').addEventListener('click', showStartScreen);
    
    // Settings buttons
    document.getElementById('sound-settings-back-btn').addEventListener('click', showStartScreen);
    
    // Leaderboard button
    document.getElementById('leaderboard-back-btn').addEventListener('click', showStartScreen);
    
    // Game over buttons
    document.getElementById('retry-btn').addEventListener('click', startGame);
    document.getElementById('home-btn').addEventListener('click', showStartScreen);
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    
    initializeSettings();
    populateLeaderboard();

    function playSound(soundName) {
        if (gameSettings.soundEnabled) {
            // Reset sound to start
            sounds[soundName].currentTime = 0;
            // Play the sound
            sounds[soundName].play().catch(error => {
                console.log('Sound play failed:', error);
            });
        }
    }

    function toggleSound() {
        gameSettings.soundEnabled = !gameSettings.soundEnabled;
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.textContent = gameSettings.soundEnabled ? 'ON' : 'OFF';
        soundToggle.classList.toggle('off', !gameSettings.soundEnabled);
    }

    function showSettings() {
        hideAllContainers();
        document.getElementById('settings-container').style.display = 'flex';
    }

    function showLeaderboard() {
        hideAllContainers();
        document.getElementById('leaderboard-container').style.display = 'flex';
    }

    function populateLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboard-body');
        leaderboardBody.innerHTML = '';
        
        leaderboardData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.rank}</td>
                <td>${entry.player}</td>
                <td>${entry.score}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    function hideAllContainers() {
        const containers = [
            'start-screen',
            'menu-container',
            'instructions-container',
            'settings-container',
            'leaderboard-container',
            'game-container',
            'game-over-container'
        ];
        containers.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    }

    function showStartScreen() {
        hideAllContainers();
        document.getElementById('start-screen').style.display = 'flex';
        resetGame();
    }

    function showInstructions() {
        hideAllContainers();
        document.getElementById('instructions-container').style.display = 'flex';
    }

    function startGame() {
        hideAllContainers();
        initializeGame();
    }

    function initializeSettings() {
        // Time button listeners
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                gameSettings.time = parseInt(e.target.dataset.time);
            });
        });

        // Difficulty button listeners
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                gameSettings.difficulty = e.target.dataset.difficulty;
                setDifficultySpeed();
            });
        });
    }

    function setDifficultySpeed() {
        switch(gameSettings.difficulty) {
            case 'easy':
                gameSettings.intervalSpeed = 2000;
                break;
            case 'medium':
                gameSettings.intervalSpeed = 1500;
                break;
            case 'expert':
                gameSettings.intervalSpeed = 1000;
                break;
        }
    }

    function initializeGame() {
        // Show game container
        document.getElementById('game-container').style.display = 'flex';
        
        // Reset score
        score = 0;
        document.getElementById('scoreDisplay').textContent = score;
        
        // Setup timer if not unlimited
        if (gameSettings.time > 0) {
            document.getElementById('time-display').style.display = 'inline-block';
            document.getElementById('timeDisplay').textContent = gameSettings.time;
            startTimer();
        }

        // Initialize game grid and colors
        generateGrid();
        updateTargetColor();
        
        // Start color change interval
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            updateSquareColors();
            updateTargetColor();
        }, gameSettings.intervalSpeed);
    }

    function startTimer() {
        if (timeInterval) clearInterval(timeInterval);
        let timeLeft = gameSettings.time;
        timeInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timeDisplay').textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(interval);
        clearInterval(timeInterval);
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('game-over-container').style.display = 'flex';
        document.getElementById('finalScoreDisplay').textContent = score;
        playSound('gameOver');
    }

    function resetGame() {
        score = 0;
        document.getElementById('scoreDisplay').textContent = score;
        document.getElementById('finalScoreDisplay').textContent = score;
        if (interval) clearInterval(interval);
        if (timeInterval) clearInterval(timeInterval);
    }

    function generateGrid() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.addEventListener('click', handleSquareClick);
            gridContainer.appendChild(square);
        }
        updateSquareColors();
    }

    function updateSquareColors() {
        const squares = document.querySelectorAll('.square');
        const squaresArray = Array.from(squares);
        
        // First, fill all squares with non-target colors
        squaresArray.forEach(square => {
            let randomColor;
            do {
                randomColor = colors[Math.floor(Math.random() * colors.length)];
            } while (randomColor === targetColor);
            square.style.backgroundColor = randomColor;
        });

        // Then, randomly select 1-3 squares to show target color
        const targetSquareCount = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
        const shuffledSquares = squaresArray.sort(() => Math.random() - 0.5);
        
        // Set target color to selected squares
        for (let i = 0; i < targetSquareCount; i++) {
            shuffledSquares[i].style.backgroundColor = targetColor;
        }
    }

    function updateTargetColor() {
        // Ensure new target color is different from current
        let newColor;
        do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === targetColor && colors.length > 1);
        
        targetColor = newColor;
        const targetSquare = document.getElementById('target-color-square');
        targetSquare.style.backgroundColor = targetColor;
    }

    function handleSquareClick(event) {
        const clickedColor = event.target.style.backgroundColor;
        const hexClickedColor = rgbToHex(clickedColor);
        
        if (hexClickedColor === targetColor) {
            score += 10;
            document.getElementById('scoreDisplay').textContent = score;
            playSound('correct');
            // Immediately update colors on correct click
            updateSquareColors();
            updateTargetColor();
        } else {
            score -= 5;
            document.getElementById('scoreDisplay').textContent = score;
            playSound('wrong');
        }
    }

    function rgbToHex(rgb) {
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return '';
        
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
});
