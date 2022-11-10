const { XSS } = require('../attack-types');
const checkCustomPayloads = require('../data-preparation/utils/check-custom-payloads');

describe('checkCustomPayloads', () => {
  it('should fail with existing attack', () => {
    const customPayloads = { something: [], [XSS]: [] };

    const testFunction = () => checkCustomPayloads(customPayloads);

    expect(testFunction).toThrow();
  });
});
