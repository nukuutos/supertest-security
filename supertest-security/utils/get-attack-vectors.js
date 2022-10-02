const handleObjectCase = (template, vectors) => {
  const keys = Object.keys(template);

  for (const key of keys) {
    const value = template[key];

    if (typeof value === "string") vectors.push(value);
    else if (typeof value === "object") helper(value, vectors);
  }
};

const handleArrayCase = (arrayTemplate, vectors) => {
  const areValuesObjects = typeof arrayTemplate[0] === "object";

  if (!areValuesObjects) {
    return arrayTemplate.forEach((value) => vectors.push(value));
  }

  arrayTemplate.forEach((object) => helper(object, vectors));
};

const helper = (template, vectors) => {
  if (Array.isArray(template)) {
    return handleArrayCase(template, vectors);
  } else if (typeof template === "object") {
    return handleObjectCase(template, vectors);
  }

  throw Error(`Incorrect template type: ${typeof template}. \nTemplate: ${template}`);
};

const getAttackVectors = (template) => {
  const vectors = [];

  helper(template, vectors);

  const vectorsWithoutDuplicates = [...new Set(vectors)];

  return vectorsWithoutDuplicates;
};

module.exports = getAttackVectors;
