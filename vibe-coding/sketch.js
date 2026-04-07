document.getElementById('randomBtn').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    openModal(tarotCards[randomIndex]);
});
