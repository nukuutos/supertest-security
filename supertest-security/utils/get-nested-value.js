const getNestedValue = (object, path) => {
  let value = object;

  for (const key of path) {
    value = value[key];
  }

  return value;
};

module.exports = getNestedValue;
