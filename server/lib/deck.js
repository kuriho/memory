const deckSize = 12;
const cards = Array.from({length: deckSize}, (v, i) => ++i);

// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
const shuffleCards = (array) => array.map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x);
module.exports.getCards = () => { return shuffleCards(cards.concat(cards)); };
