const supertest = require("supertest");
const app = require("../app");

class SupertestSecurity {
  constructor(app, { template, routeParams, method = "post" }) {
    this.agent = supertest.agent(app);
    this.template = template;
    this.routeParams = routeParams;
    this.method = method;
  }

  getUrl(customRouteParams) {
    const { routeParams, template } = this;

    const urlRouteParams = { ...routeParams, ...customRouteParams };

    const templateArray = template.split("/");

    for (const param in urlRouteParams) {
      const paramIndex = templateArray.indexOf(`:${param}`);
      if (paramIndex === -1) throw new Error(`:${param} - no route param in template!`);
      templateArray[paramIndex] = urlRouteParams[param];
    }

    return encodeURI(templateArray.join("/"));
  }

  // setHeaders(request) {
  //   const headers = Object.keys(this.headers);

  //   for (const header of headers) {
  //     request.set(header, this.headers[header]);
  //   }

  //   return request;
  // }

  request(customRouteParams = {}) {
    const { agent, method } = this;

    const url = this.getUrl(customRouteParams);

    console.log(method, url);

    return agent[method](url);
  }

  async testBodyFields(tests, cb) {
    const promises = [];

    for (const test of tests) {
      const promise = this.request().send(test.data);
      // const promise = supertest(app).put("/user/123").send(test.data);
      promises.push(promise);
    }

    // let results = await Promise.all(promises.map((p) => p.catch((e) => console.log(e))));
    let results = await Promise.all(promises);

    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }

  async testQueryParams(tests, cb) {
    const promises = [];

    for (const test of tests) {
      const promise = this.request().query(test.data);
      promises.push(promise);
    }

    let results = await Promise.allSettled(promises);
    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }

  async testRouteParams(tests) {
    const promises = [];

    for (const test of tests) {
      const promise = this.request(test.data);
      promises.push(promise);
    }

    let results = await Promise.allSettled(promises);
    results = results.map(({ value }) => value);

    if (cb) await cb(results);

    return this;
  }
}

module.exports = SupertestSecurity;
