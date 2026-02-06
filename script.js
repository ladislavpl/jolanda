document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    const drawBtn = document.getElementById('draw-btn');
    const slots = [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3')
    ];
    const interpretationBox = document.getElementById('interpretation');
    const predictionText = document.getElementById('prediction-text');
    const tvClock = document.getElementById('tv-clock');

    // Clock Logic
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        if (tvClock) {
            tvClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    let deck = [];
    let intros = [];
    let isDrawing = false;

    // Load Data
    async function loadData() {
        try {
            const response = await fetch('./data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            deck = data.deck;
            intros = data.intros;

            // Enable interaction only after data is loaded
            drawBtn.addEventListener('click', () => {
                if (!isDrawing) drawCards();
            });
        } catch (err) {
            console.error('Error loading data:', err);
            predictionText.innerHTML = '<p class="intro">Chyba v matrixu! (Nepodařilo se načíst karty)</p>';
            interpretationBox.classList.remove('hidden');
            interpretationBox.classList.add('visible');
        }
    }

    loadData();

    function shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function drawCards() {
        if (deck.length < 3) return;
        isDrawing = true;
        drawBtn.disabled = true;
        drawBtn.style.opacity = '0.5';

        // Reset slots
        slots.forEach(slot => {
            slot.innerHTML = '';
        });
        interpretationBox.classList.remove('visible');
        interpretationBox.classList.add('hidden');

        // Unique random cards using Fisher-Yates shuffle
        const shuffled = shuffle(deck);
        const drawnCards = shuffled.slice(0, 3);

        // Render cards (with delay for effect)
        drawnCards.forEach((card, index) => {
            setTimeout(() => {
                renderCard(card, slots[index]);
            }, index * 300);
        });

        // Show interpretation
        setTimeout(() => {
            showInterpretation(drawnCards);
            isDrawing = false;
            drawBtn.disabled = false;
            drawBtn.style.opacity = '1';
        }, 1500);
    }

    function renderCard(card, slot) {
        const cardElem = document.createElement('div');
        cardElem.className = 'card';
        cardElem.innerHTML = `
            <div class="card-inner">
                <div class="card-back">Jobto</div>
                <div class="card-front">
                    <div class="card-icon" role="img" aria-label="${card.name}">${card.icon}</div>
                    <div class="card-title">${card.name}</div>
                </div>
            </div>
        `;
        slot.appendChild(cardElem);

        // Force reflow
        void cardElem.offsetWidth;

        // Flip
        setTimeout(() => {
            cardElem.classList.add('flipped');
        }, 100);
    }

    function showInterpretation(cards) {
        interpretationBox.classList.remove('hidden');
        // Small delay to allow display block to take effect before opacity transition
        setTimeout(() => {
            interpretationBox.classList.add('visible');
        }, 10);

        const randomIntro = intros[Math.floor(Math.random() * intros.length)];

        const text = `
            <p class="intro">${randomIntro}</p>
            <p><strong>1. ${cards[0].name}:</strong> ${cards[0].meaning}</p>
            <p><strong>2. ${cards[1].name}:</strong> ${cards[1].meaning}</p>
            <p><strong>3. ${cards[2].name}:</strong> ${cards[2].meaning}</p>
            <p class="outro"><em>Tak jsem to řekla a tak to bude.</em></p>
        `;
        predictionText.innerHTML = text;
    }
});
