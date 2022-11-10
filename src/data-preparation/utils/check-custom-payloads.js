const attackTypesModule = require('../../attack-types');

const attackTypes = Object.values(attackTypesModule);

const checkCustomPayloads = (customPayloads) => {
  const isObject = typeof customPayloads === 'object' && !Array.isArray(customPayloads);

  if (!isObject) {
    throw new Error('customPayloads must be an object!');
  }

  const customAttackTypes = Object.keys(customPayloads);

  const isSameAttackTypes = customAttackTypes.some((type) => attackTypes.includes(type));

  if (isSameAttackTypes) {
    throw new Error('customPayloads has same attack types as Supertest Security!');
  }
};

module.exports = checkCustomPayloads;
