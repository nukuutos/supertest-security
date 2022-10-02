const fs = require('fs');
const path = require('path');
const getNestedValue = require('../../utils/get-nested-value');

const checkPayloadValues = ({
  payloads,
  attackVector,
  fieldPath,
  checkImmutability,
  correctData,
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

  const pathOriginalValues = path.rootJoin('supertest-security', 'payloads', `${attackVector}.txt`);
  const originalValues = fs.readFileSync(pathOriginalValues, { encoding: 'utf-8' }).split('\r\n');

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

module.exports = checkPayloadValues;
