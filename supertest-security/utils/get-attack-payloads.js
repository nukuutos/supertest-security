const fs = require('fs');
const path = require('path');

require('../modules/path');

const getAttackPayloads = (vectors) => {
  const payloads = {};

  for (const vector of vectors) {
    const filename = `${vector}.txt`;
    const pathToFile = path.rootJoin('supertest-security', 'payloads', filename);
    const data = fs.readFileSync(pathToFile, { encoding: 'utf-8' }).split('\r\n');
    payloads[vector] = data;
  }

  return payloads;
};

module.exports = getAttackPayloads;
