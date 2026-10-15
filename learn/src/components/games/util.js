/* Shared helpers for the games. */

export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Shuffle, but never hand back the answer already solved — a puzzle that
   starts finished teaches nothing. `same` decides what counts as solved. */
export function shuffleAway(list, same) {
  if (list.length < 2) return list.slice();
  for (let tries = 0; tries < 20; tries++) {
    const a = shuffle(list);
    if (!same(a)) return a;
  }
  return list.slice(1).concat(list[0]);
}
