const getNestedValue = require('../../data-preparation/utils/get-nested-value');

const checkCustomPayloads = ({
  payloads,
  attackVector,
  fieldPath,
  checkImmutability,
  correctData,
  originalValues,
}) => {
  for (const payload of payloads) {
    const { data, name } = payload;

    expect(name).toBe(attackVector);

    // check that there is only correctData keys in data (top level keys)
    const dataKeys = Object.keys(data);
    const correctDataKeys = Object.keys(correctData);

    expect(dataKeys).toHaveLength(correctDataKeys.length);

    dataKeys.some((key) => expect(dataKeys).toContain(key));

    checkImmutability(data, correctData);
  }

  for (let i = 0; i < payloads.length; i++) {
    const payloadData = payloads[i].data;
    const payloadValue = getNestedValue(payloadData, fieldPath);
    const originalValue = originalValues[i];

    if (Array.isArray(payloadValue)) {
      expect(payloadValue).toStrictEqual([originalValue]);
    } else {
      expect(payloadValue).toBe(originalValue);
    }
  }
};

module.exports = checkCustomPayloads;
