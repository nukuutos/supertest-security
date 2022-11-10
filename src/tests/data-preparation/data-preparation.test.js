const { XSS, SQL_INJECTION } = require('../../attack-types');
const dataPreparation = require('../../data-preparation/data-preparation');
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
});
