const { XSS, SQL_INJECTION, NOSQL_INJECTION } = require("../attack-types");
const getAttackVectors = require("../utils/get-attack-vectors");

describe("getAttackVectors", () => {
  it("should successfully get unique attack vectors", () => {
    const template = {
      array: [XSS, SQL_INJECTION],
      string: SQL_INJECTION,
      nested: {
        nestedNested: {
          something: XSS,
          array: [SQL_INJECTION],
          arrayOfObjects: [{ array: SQL_INJECTION }, { arrayOfObjects: NOSQL_INJECTION }],
        },
      },
    };

    const attackVectors = getAttackVectors(template);

    expect(attackVectors.length).toBe(3);
  });
});
