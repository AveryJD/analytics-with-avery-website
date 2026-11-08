// Guide cards: hovering over a part of the card highlights it and shows its explanation (until the cursor leaves it), and clicking or tapping it keeps the explanation up
document.querySelectorAll('[data-guide-card]').forEach((card) => {
  const boxes = card.querySelectorAll('[data-spot-box]');
  const notes = card.querySelectorAll('[data-spot-note]');

  function select(number) {
    boxes.forEach((box) => box.classList.toggle('active', box.dataset.spotBox === number));
    notes.forEach((note) => { note.hidden = note.dataset.spotNote !== number; });
  }

  // A click or tap pins a part's explanation so it stays up until the same part is clicked again, another part is clicked, or the empty card is clicked
  let pinned = null;

  boxes.forEach((box) => {
    box.addEventListener('mouseenter', () => {
      if (pinned === null) select(box.dataset.spotBox);
    });
    box.addEventListener('mouseleave', () => {
      if (pinned === null) select('0');
    });
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      pinned = pinned === box.dataset.spotBox ? null : box.dataset.spotBox;
      select(box.dataset.spotBox);
    });
  });

  const stage = card.querySelector('.guide-card-stage');
  stage.addEventListener('click', () => {
    pinned = null;
    select('0');
  });

  card.classList.add('guide-card-ready');
  select('0');
});

// Skater and goalie tabs on the player card guide
document.querySelectorAll('[data-card-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('[data-card-tab]').forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
    document.querySelectorAll('[data-card-tab-panel]').forEach((panel) => { panel.hidden = panel.id !== tab.dataset.cardTab; });
  });
});

// Give the explanation panel of every card in a tab group the height of the tallest one, so switching tabs never moves what is below
document.querySelectorAll('.guide-card-tab-stack').forEach((stack) => {
  const panels = stack.querySelectorAll('.guide-card-panel');

  function equalize() {
    panels.forEach((panel) => { panel.style.minHeight = ''; });
    const tallest = Math.max(...Array.from(panels, (panel) => panel.offsetHeight));
    panels.forEach((panel) => { panel.style.minHeight = `${tallest}px`; });
  }

  equalize();
  window.addEventListener('resize', equalize);
  document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', equalize));
  if (document.fonts) document.fonts.ready.then(equalize);
});
