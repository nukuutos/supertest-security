const { XSS, SQL_INJECTION } = require('../../attack-types');
const dataPreparation = require('../../data-preparation/data-preparation');
const checkCustomPayloads = require('./check-custom-payloads');
const checkPayloadValues = require('./check-payload-values');

const correctData = {
  firstName: 'Nikita',
  nested: {
    age: 22,
    nestedNested: {
      something: 'value',
      array: ['good'],
    },
  },
  array: [{ property: 'haha' }],
};

describe('dataPreparation', () => {
  it('should successfully add xss payloads to primitive not nested field', () => {
    const template = {
      firstName: XSS,
    };

    const payloads = dataPreparation(correctData, template);

    const parameters = {
      payloads,
      attackVector: XSS,
      fieldPath: ['firstName'],
      correctData,
      checkImmutability: (data) => {
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested).toStrictEqual(correctData.nested);
        expect(data.firstName).not.toBe(correctData.firstName);
      },
    };

    checkPayloadValues(parameters);
  });

  it('should successfully add xss and sql payloads to primitive not nested field', () => {
    const template = {
      firstName: [XSS, SQL_INJECTION],
    };

    const payloads = dataPreparation(correctData, template);

    const xssPayloads = [];
    const sqlPayloads = [];

    payloads.forEach((payload) => {
      if (payload.name === XSS) xssPayloads.push(payload);
      else if (payload.name === SQL_INJECTION) sqlPayloads.push(payload);
    });

    expect(xssPayloads).not.toHaveLength(0);
    expect(sqlPayloads).not.toHaveLength(0);

    const parameters = {
      payloads: xssPayloads,
      attackVector: XSS,
      fieldPath: ['firstName'],
      correctData,
      checkImmutability: (data) => {
        expect(data.nested).toStrictEqual(correctData.nested);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.firstName).not.toBe(correctData.firstName);
      },
    };

    checkPayloadValues(parameters);

    const sqlParameters = {
      payloads: sqlPayloads,
      attackVector: SQL_INJECTION,
      fieldPath: ['firstName'],
      correctData,
      checkImmutability: (data) => {
        expect(data.nested).toStrictEqual(correctData.nested);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.firstName).not.toBe(correctData.firstName);
      },
    };

    checkPayloadValues(sqlParameters);
  });

  it('should successfully add xss payloads to primitive nested field', () => {
    const template = {
      nested: {
        age: XSS,
      },
    };

    const payloads = dataPreparation(correctData, template);

    const parameters = {
      payloads,
      attackVector: XSS,
      fieldPath: ['nested', 'age'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.nested.nestedNested).toStrictEqual(correctData.nested.nestedNested);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).not.toBe(correctData.nested.age);
      },
    };

    checkPayloadValues(parameters);
  });

  it('should successfully add xss and sql payloads to primitive nested field', () => {
    const template = {
      nested: {
        age: [XSS, SQL_INJECTION],
      },
    };

    const payloads = dataPreparation(correctData, template);

    const xssPayloads = [];
    const sqlPayloads = [];

    payloads.forEach((payload) => {
      if (payload.name === XSS) xssPayloads.push(payload);
      else if (payload.name === SQL_INJECTION) sqlPayloads.push(payload);
    });

    expect(xssPayloads).not.toHaveLength(0);
    expect(sqlPayloads).not.toHaveLength(0);

    const parameters = {
      payloads: xssPayloads,
      attackVector: XSS,
      fieldPath: ['nested', 'age'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.nested.nestedNested).toStrictEqual(correctData.nested.nestedNested);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).not.toBe(correctData.nested.age);
      },
    };

    checkPayloadValues(parameters);

    const sqlParameters = {
      payloads: sqlPayloads,
      attackVector: SQL_INJECTION,
      fieldPath: ['nested', 'age'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.nested.nestedNested).toStrictEqual(correctData.nested.nestedNested);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).not.toBe(correctData.nested.age);
      },
    };

    checkPayloadValues(sqlParameters);
  });

  it('should successfully add xss payloads to array nested x2 field', () => {
    const template = {
      nested: {
        nestedNested: {
          array: XSS,
        },
      },
    };

    const payloads = dataPreparation(correctData, template);

    const parameters = {
      payloads,
      attackVector: XSS,
      fieldPath: ['nested', 'nestedNested', 'array'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).toStrictEqual(correctData.nested.age);
        expect(data.nested.nestedNested.array).not.toStrictEqual(
          correctData.nested.nestedNested.array
        );
      },
    };

    checkPayloadValues(parameters);
  });

  it('should successfully add xss and sql payloads to array nested x2 field', () => {
    const template = {
      nested: {
        nestedNested: {
          array: [XSS, SQL_INJECTION],
        },
      },
    };

    const payloads = dataPreparation(correctData, template);

    const xssPayloads = [];
    const sqlPayloads = [];

    payloads.forEach((payload) => {
      if (payload.name === XSS) xssPayloads.push(payload);
      else if (payload.name === SQL_INJECTION) sqlPayloads.push(payload);
    });

    expect(xssPayloads).not.toHaveLength(0);
    expect(sqlPayloads).not.toHaveLength(0);

    const xssParameters = {
      payloads: xssPayloads,
      attackVector: XSS,
      fieldPath: ['nested', 'nestedNested', 'array'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).toStrictEqual(correctData.nested.age);
        expect(data.nested.nestedNested.array).not.toStrictEqual(
          correctData.nested.nestedNested.array
        );
      },
    };

    checkPayloadValues(xssParameters);

    const sqlParameters = {
      payloads: sqlPayloads,
      attackVector: SQL_INJECTION,
      fieldPath: ['nested', 'nestedNested', 'array'],
      correctData,
      checkImmutability: (data) => {
        expect(data.firstName).toBe(correctData.firstName);
        expect(data.array).toStrictEqual(correctData.array);
        expect(data.nested.age).toStrictEqual(correctData.nested.age);
        expect(data.nested.nestedNested.array).not.toStrictEqual(
          correctData.nested.nestedNested.array
        );
      },
    };

    checkPayloadValues(sqlParameters);
  });

  it('should successfully use custom payloads', () => {
    const CUSTOM_SUPER_ATTACK = 'CUSTOM_SUPER_ATTACK';
    const CUSTOM_SQL = 'CUSTOM_SQL';

    const customPayloads = {
      [CUSTOM_SUPER_ATTACK]: ['fast', 'and', 'malicious'],
      [CUSTOM_SQL]: ['critical', 'and', 'strong'],
    };

    const bodyFields = {
      name: 1,
    };

    const template = {
      name: [CUSTOM_SUPER_ATTACK, CUSTOM_SQL],
    };

    const payloads = dataPreparation(bodyFields, template, customPayloads);

    const sendedPayloads = [];

    for (const payload of payloads) {
      sendedPayloads.push(payload.data);
    }

    expect([...new Set(sendedPayloads)]).toHaveLength(6);
  });
});

it('should successfully add xss payloads and custom  payloads to primitive not nested field', () => {
  const CUSTOM_SUPER_ATTACK = 'CUSTOM_SUPER_ATTACK';

  const customMaliciousValues = ['fast', 'and', 'malicious'];

  const custom = {
    [CUSTOM_SUPER_ATTACK]: customMaliciousValues,
  };

  const template = {
    firstName: [XSS, CUSTOM_SUPER_ATTACK],
  };

  const payloads = dataPreparation(correctData, template, custom);

  const xssPayloads = [];
  const customPayloads = [];

  payloads.forEach((payload) => {
    if (payload.name === XSS) xssPayloads.push(payload);
    else if (payload.name === CUSTOM_SUPER_ATTACK) customPayloads.push(payload);
  });

  expect(xssPayloads).not.toHaveLength(0);
  expect(customPayloads).not.toHaveLength(0);

  const xssParameters = {
    payloads: xssPayloads,
    attackVector: XSS,
    fieldPath: ['firstName'],
    correctData,
    checkImmutability: (data) => {
      expect(data.array).toStrictEqual(correctData.array);
      expect(data.nested).toStrictEqual(correctData.nested);
      expect(data.firstName).not.toBe(correctData.firstName);
    },
  };

  checkPayloadValues(xssParameters);

  const customParameters = {
    payloads: customPayloads,
    attackVector: CUSTOM_SUPER_ATTACK,
    originalValues: customMaliciousValues,
    fieldPath: ['firstName'],
    correctData,
    checkImmutability: (data) => {
      expect(data.array).toStrictEqual(correctData.array);
      expect(data.nested).toStrictEqual(correctData.nested);
      expect(data.firstName).not.toBe(correctData.firstName);
    },
  };

  checkCustomPayloads(customParameters);
});
