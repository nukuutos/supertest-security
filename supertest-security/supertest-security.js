const supertest = require("supertest");
const app = require("../app");

class SupertestSecurity {
  constructor(app, { template, routeParams, method = "post" }) {
    this.app = app;
    this.template = template;
    this.routeParams = routeParams;
    this.method = method;
  }

  getUrl() {
    const { routeParams, template } = this;

    const templateArray = template.split("/");

    for (const param in routeParams) {
      const paramIndex = templateArray.indexOf(`:${param}`);
      if (paramIndex === -1) throw new Error(`:${param} - no route param in template!`);
      templateArray[paramIndex] = routeParams[param];
    }

    return encodeURI(templateArray.join("/"));
  }

  async testBodyFields(tests, cb) {
    const promises = [];

    const { method } = this;
    const url = this.getUrl();

    for (const test of tests) {
      const promise = supertest(app)[method](url).send(test.data);
      promises.push(promise);
    }

    let results = await Promise.all(promises);

    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }

  async testQueryParams(tests, cb) {
    const promises = [];

    const { method } = this;
    const url = this.getUrl();

    for (const test of tests) {
      const promise = supertest(app)[method](url).query(test.data);
      promises.push(promise);
    }

    let results = await Promise.allSettled(promises);
    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }

  async testRouteParams(tests) {
    const promises = [];

    const { method } = this;

    for (const test of tests) {
      const url = this.getUrl(test.data);
      const promise = supertest(app)[method](url)(test.data);
      promises.push(promise);
    }

    let results = await Promise.allSettled(promises);
    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }
}

module.exports = SupertestSecurity;
