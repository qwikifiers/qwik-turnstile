declare global {
  /* eslint no-var: off */
  var turnstile: any;
}

export function resetTurnstile() {
  const turnstile = globalThis.turnstile;
  if (turnstile && typeof turnstile.reset === "function") {
    turnstile.reset();
  }
}