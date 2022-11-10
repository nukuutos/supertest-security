const fs = require('fs');
const path = require('path');

require('../../modules/path');

const getAttackPayloads = (vectors, customPayloads = {}) => {
  const payloads = {};
  const customAttackVectors = Object.keys(customPayloads);

  for (const vector of vectors) {
    const isCustomAttackVector = customAttackVectors.includes(vector);
    if (isCustomAttackVector) continue;

    const filename = `${vector}.txt`;
    const pathToFile = path.rootJoin('src', 'payloads', filename);
    const data = fs.readFileSync(pathToFile, { encoding: 'utf-8' }).split('\r\n');
    payloads[vector] = data;
  }

  return { ...payloads, ...customPayloads };
};

module.exports = getAttackPayloads;
