const getTimeForExecution = async (cb) => {
  const startAt = Date.now();
  await cb();
  const endAt = Date.now();

  const resultInSeconds = (endAt - startAt) / 1000;

  console.log(resultInSeconds, "seconds");
};

module.exports = { getTimeForExecution };
