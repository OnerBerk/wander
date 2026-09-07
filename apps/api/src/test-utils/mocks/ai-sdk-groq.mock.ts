// Le paquet `@ai-sdk/groq` est ESM-only : Jest tourne en CommonJS et ne peut pas le charger.
// Mappé via `moduleNameMapper` pour que AppModule reste bootable dans les tests.
export const groq = jest.fn(() => ({}));
