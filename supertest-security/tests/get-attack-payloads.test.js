const { XSS, SQL_INJECTION } = require('../attack-types');
const getAttackPayloads = require('../utils/get-attack-payloads');

describe('getAttackPayloads', () => {
  it('should successfully get attack payloads', () => {
    const attackVectors = [XSS, SQL_INJECTION];

    const payloads = getAttackPayloads(attackVectors);

    const payloadsVectors = Object.keys(payloads);

    expect(payloadsVectors).toHaveLength(2);

    for (const vector of payloadsVectors) {
      expect(attackVectors).toContain(vector);

      const payloadsVector = payloads[vector];

      expect(payloadsVector.length).toBeGreaterThan(100);
    }
  });
});
