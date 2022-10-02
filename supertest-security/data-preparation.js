const cloneDeep = require('lodash.clonedeep');

const getAttackVectors = require('./utils/get-attack-vectors');
const getAttackPayloads = require('./utils/get-attack-payloads');
const getNestedValue = require('./utils/get-nested-value');

// const bodyFields = {
//   firstName: "Nikita",
//   lastName: "Voloshin",
//   siblings: ["uncle"],
//   nested: {
//     age: 22,
//     nestedNested: {
//       something: "value",
//       array: ["good"],
//     },
//   },
//   arrayObjects: [{ wan: "super" }],
// };

const dataPreparation = (data, template) => {
  // need to check attack vectors end get it
  const attackVectors = getAttackVectors(template);
  const attackPayloads = getAttackPayloads(attackVectors);
  const tests = [];

  const helper = (keyPath = []) => {
    const currentTemplateLevel = getNestedValue(template, keyPath);
    const fields = Object.keys(currentTemplateLevel);

    const handleStringCase = (templateValue, field) => {
      const payloads = attackPayloads[templateValue];

      // check ref for undefined
      for (const payload of payloads) {
        const testData = cloneDeep(data);
        const ref = getNestedValue(testData, keyPath);
        if (Array.isArray(ref[field])) ref[field] = [payload];
        else ref[field] = payload;

        tests.push({ name: templateValue, data: testData });
      }
    };

    const handleArrayCase = (templateValue, field, currentPath) => {
      const isAttackVectors = templateValue[0] && typeof templateValue[0] === 'string';
      if (!isAttackVectors) {
        currentPath = [...currentPath, 0];
        return helper(currentPath);
      }

      for (const vector of templateValue) {
        const payloads = attackPayloads[vector];

        // check ref for undefined

        for (const payload of payloads) {
          const testData = cloneDeep(data);
          const ref = getNestedValue(testData, keyPath);
          if (Array.isArray(ref[field])) ref[field] = [payload];
          else ref[field] = payload;

          tests.push({ name: vector, data: testData });
        }
      }
    };

    for (const field of fields) {
      const currentPath = [...keyPath, field];

      const templateValue = getNestedValue(template, currentPath);

      if (typeof templateValue === 'string') {
        handleStringCase(templateValue, field);
      } else if (Array.isArray(templateValue)) {
        handleArrayCase(templateValue, field, currentPath);
      } else if (typeof templateValue === 'object') {
        helper(currentPath);
      }
    }
  };

  helper();

  // const pathToFile = path.rootJoin("results.json");
  // fs.writeFileSync(pathToFile, JSON.stringify(tests), { encoding: "utf-8" });

  return tests;
};

module.exports = dataPreparation;
