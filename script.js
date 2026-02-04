document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const slots = [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3')
    ];
    const interpretationBox = document.getElementById('interpretation');
    const predictionText = document.getElementById('prediction-text');

    // Data - will implement full deck in next step
    const deck = [
        { name: "Svatba", icon: "💍", meaning: "Vidím tady velkou lásku, svatbu, děti... všechno bude." },
        { name: "Dopis", icon: "✉️", meaning: "Přijde ti zpráva. Možná dopis, možná SMS, ale bude to důležitý." },
        { name: "Peníze", icon: "💰", meaning: "Vidím velký peníze. Hodně peněz. Ale pozor, ať je neutratíš za blbosti." },
        { name: "Dům", icon: "🏠", meaning: "Stabilita. Budeš mít kde bydlet, nebo opravíš barák." },
        { name: "Dítě", icon: "👶", meaning: "Něco nového začíná. Může to být i projekt, nejenom harant." },
        { name: "Vdova", icon: "👵", meaning: "Nějaká starší paní ti poradí. Nebo ti chce zle. Musíš si dát pozor." },
        { name: "Vdovec", icon: "👴", meaning: "Starší pán, moudrý, ale smutný." },
        { name: "Myšlenky", icon: "💭", meaning: "Moc přemýšlíš. Neřeš to, ono to dopadne." },
        { name: "Cesta", icon: "🛤️", meaning: "Někam pojedeš. Možná daleko, možná jen do Kauflandu." },
        { name: "Dar", icon: "🎁", meaning: "Dostaneš něco zadarmo. To je vždycky dobrý, ne?" },
        { name: "Zloděj", icon: "🕵️", meaning: "Pozor na lidi kolem tebe. Někdo ti chce vzít to, co máš rád." },
        { name: "Faleš", icon: "🎭", meaning: "Někdo se tváří jako kamarád, ale není. Vidím tam faleš." },
        { name: "Smrt", icon: "💀", meaning: "Není to fyzická smrt! Je to konec něčeho starého. Změna." },
        { name: "Nemoc", icon: "🤒", meaning: "Necítíš se dobře? Vidím tady velký špatný, ale uzdravíš se." },
        { name: "Věrnost", icon: "🐕", meaning: "Máš kolem sebe někoho, kdo tě nezradí." },
        { name: "Nepřítel", icon: "⚔️", meaning: "Někdo ti nepřeje. Musíš být silný." },
        { name: "Štěstí", icon: "🍀", meaning: "Velký dobrý! Všechno se ti podaří." },
        { name: "Láska", icon: "❤️", meaning: "Srdíčko ti zaplesá. Láska jako trám." },
        { name: "Naděje", icon: "⚓", meaning: "Nevzdávej to. Ještě je tam naděje." },
        { name: "Ztráta", icon: "📉", meaning: "Něco ztratíš, ale možná to nepotřebuješ." },
        { name: "Důstojník", icon: "👮", meaning: "Úřady. Papírování. Někdo v uniformě." },
        { name: "Soudce", icon: "⚖️", meaning: "Spravedlnost. Dostaneš, co si zasloužíš." }
    ];

    drawBtn.addEventListener('click', () => {
        // Simple animation trigger for now
        drawCards();
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

        const intros = [
            "Vidím to jasně... ",
            "Karty nelžou, podívej se na to... ",
            "Tady to máš černé na bílém... ",
            "Jaj, co to tady vidím... ",
            "No toto... "
        ];
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
