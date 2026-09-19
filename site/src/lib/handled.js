import { useSyncExternalStore } from "react";

// "Handled" = you have already opened this thing in this tab. It backs one
// very quiet static mark (see .v4-handled in v4-interaction.css). Nothing
// here is analytics: no timestamps, no counts, no user data, and it lives
// in sessionStorage only, so a new tab or browser session starts clean.
//
// Storage can be missing or throw (private modes, blocked site data). The
// in-memory set keeps the mark working for the life of the page in that
// case, and every storage call is wrapped so a failure can never get in
// the way of navigation.

const PREFIX = "portfolio:handled:";
const memory = new Set();
const listeners = new Set();

export const workKey = (projectId, kind) => `work:${projectId}:${kind}`;
export const RESUME_KEY = "resume";

function isHandled(key) {
  if (memory.has(key)) return true;
  try {
    return window.sessionStorage.getItem(PREFIX + key) === "1";
  } catch {
    return false;
  }
}

export function markHandled(key) {
  if (memory.has(key)) return;
  memory.add(key);
  try {
    window.sessionStorage.setItem(PREFIX + key, "1");
  } catch {
    // Storage unavailable: the in-memory mark above is enough.
  }
  listeners.forEach((notify) => notify());
}

const subscribe = (notify) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export function useHandled(key) {
  return useSyncExternalStore(
    subscribe,
    () => isHandled(key),
    () => false,
  );
}
