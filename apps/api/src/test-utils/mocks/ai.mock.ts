// Le paquet `ai` est ESM-only : Jest tourne en CommonJS et ne peut pas le charger.
// Mappé via `moduleNameMapper` — aucun appel réel au provider.
export const generateText = jest.fn(async () => ({ text: '' }));
export const stepCountIs = jest.fn(() => () => true);
export const tool = <T>(definition: T): T => definition;
