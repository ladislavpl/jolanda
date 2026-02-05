document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const slots = [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3')
    ];
    const interpretationBox = document.getElementById('interpretation');
    const predictionText = document.getElementById('prediction-text');

    let deck = [];
    let intros = [];

    // Load Data
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            deck = data.deck;
            intros = data.intros;

            // Enable interaction only after data is loaded
            drawBtn.addEventListener('click', () => {
                drawCards();
            });
        })
        .catch(err => {
            console.error('Error loading data:', err);
            predictionText.innerHTML = '<p class="intro">Chyba v matrixu! (Nepodařilo se načíst karty)</p>';
        });

    function drawCards() {
        // Reset slots
        slots.forEach(slot => {
            slot.innerHTML = '';
        });
        interpretationBox.classList.remove('visible');
        interpretationBox.classList.add('hidden');

        // Unique random cards
        const shuffled = [...deck].sort(() => 0.5 - Math.random());
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
        }, 1500);
    }

    function renderCard(card, slot) {
        const cardElem = document.createElement('div');
        cardElem.className = 'card';
        cardElem.innerHTML = `
            <div class="card-inner">
                <div class="card-back">Jobto</div>
                <div class="card-front">
                    <div class="card-icon">${card.icon}</div>
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