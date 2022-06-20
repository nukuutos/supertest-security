const fs = require("fs");
const path = require("path");
const cloneDeep = require("lodash.clonedeep");

require("./modules/path");

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

const getAttackVectors = (template) => {
  const vectors = [];

  const handleObjectCase = (template) => {
    const keys = Object.keys(template);

    for (const key of keys) {
      const value = template[key];

      if (typeof value === "string") vectors.push(value);
      else if (typeof value === "object") helper(value);
    }
  };

  const handleArrayCase = (arrayTemplate) => {
    const areValuesObjects = typeof arrayTemplate[0] === "object";

    if (!areValuesObjects) {
      return arrayTemplate.forEach((value) => vectors.push(value));
    }

    arrayTemplate.forEach((object) => helper(object));
  };

  const helper = (template) => {
    if (Array.isArray(template)) {
      return handleArrayCase(template);
    } else if (typeof template === "object") {
      return handleObjectCase(template);
    }

    throw Error(`Incorrect template type: ${typeof template}. \nTemplate: ${template}`);
  };

  helper(template);

  const vectorsWithoutDuplicates = [...new Set(vectors)];

  return vectorsWithoutDuplicates;
};

const getAttackPayloads = (vectors) => {
  const payloads = {};

  for (const vector of vectors) {
    const filename = `${vector}.txt`;
    const pathToFile = path.rootJoin("supertest-security", "payloads", filename);
    const data = fs.readFileSync(pathToFile, { encoding: "utf-8" }).split("\r\n");
    payloads[vector] = data;
  }

  return payloads;
};

const getValue = (object, path) => {
  let value = object;

  for (const key of path) {
    value = value[key];
  }

  return value;
};

const dataPrepation = (data, template) => {
  // need to check attack vectors end get it
  const attackVectors = getAttackVectors(template);
  const attackPayloads = getAttackPayloads(attackVectors);
  const tests = [];

  const helper = (keyPath = []) => {
    const currentTemplateLevel = getValue(template, keyPath);
    const fields = Object.keys(currentTemplateLevel);

    const handleStringCase = (templateValue, field) => {
      const payloads = attackPayloads[templateValue];

      // check ref for undefined
      for (const payload of payloads) {
        const testData = cloneDeep(data);
        const ref = getValue(testData, keyPath);
        if (Array.isArray(ref[field])) ref[field] = [payload];
        else ref[field] = payload;

        tests.push({ name: templateValue, data: testData });
      }
    };

    const handleArrayCase = (templateValue, field, currentPath) => {
      const isAttackVectors = templateValue[0] && typeof templateValue[0] === "string";
      if (!isAttackVectors) {
        currentPath = [...currentPath, 0];
        return helper(currentPath);
      }

      for (const vector of templateValue) {
        const payloads = attackPayloads[vector];

        // check ref for undefined

        for (const payload of payloads) {
          const testData = cloneDeep(data);
          const ref = getValue(testData, keyPath);
          if (Array.isArray(ref[field])) ref[field] = [payload];
          else ref[field] = payload;

          tests.push({ name: vector, data: testData });
        }
      }
    };

    for (const field of fields) {
      let currentPath = [...keyPath, field];

      const templateValue = getValue(template, currentPath);

      if (typeof templateValue === "string") {
        handleStringCase(templateValue, field);
      } else if (Array.isArray(templateValue)) {
        handleArrayCase(templateValue, field, currentPath);
      } else if (typeof templateValue === "object") {
        helper(currentPath);
      }
    }
  };

  helper();

  // const pathToFile = path.rootJoin("results.json");
  // fs.writeFileSync(pathToFile, JSON.stringify(tests), { encoding: "utf-8" });

  return tests;
};

module.exports = dataPrepation;
