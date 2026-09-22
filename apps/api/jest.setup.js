require('reflect-metadata');

// Nest remplace le logger au compile() par TestingLogger, qui affiche encore les ERROR.
// On mute ça une fois pour toute, ici — rien à toucher dans les specs.
const { TestingLogger } = require('@nestjs/testing/services/testing-logger.service');
TestingLogger.prototype.error = () => undefined;
