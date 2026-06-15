// WhatsApp plugin module tracks terminal auth facts observed by the live runtime.
import path from "node:path";

type WebAuthTerminalStateKey = {
  accountId: string;
  authDir: string;
};

const loggedOutWebAuthAccounts = new Set<string>();

function toWebAuthTerminalStateKey(params: WebAuthTerminalStateKey): string {
  return `${params.accountId}\0${path.resolve(params.authDir)}`;
}

// The monitor preserves auth files on terminal closes, so explicit relink flows
// need this process-local fact to distinguish stale logged-out creds from a
// healthy linked session without adding another steady-state storage path.
export function markWebAuthLoggedOut(params: WebAuthTerminalStateKey): void {
  loggedOutWebAuthAccounts.add(toWebAuthTerminalStateKey(params));
}

export function clearWebAuthLoggedOut(params: WebAuthTerminalStateKey): void {
  loggedOutWebAuthAccounts.delete(toWebAuthTerminalStateKey(params));
}

export function isWebAuthLoggedOut(params: WebAuthTerminalStateKey): boolean {
  return loggedOutWebAuthAccounts.has(toWebAuthTerminalStateKey(params));
}
