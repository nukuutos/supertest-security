const supertest = require('supertest');

class SupertestSecurity {
  constructor(app, { endpoint, headers, method = 'post' }) {
    this.app = app;
    this.method = method;
    this.endpoint = endpoint;
    this.headers = headers;
  }

  static #setHeaders(request, headers) {
    const entries = Object.entries(headers);
    for (const [key, value] of entries) {
      request.set(key, value);
    }
  }

  // type is "query" or "send"
  #createGetResponse(type) {
    const { app, method, endpoint, headers } = this;

    const getResponse = (data) => {
      const request = supertest(app)[method](endpoint);
      SupertestSecurity.#setHeaders(request, headers);
      return request[type](data);
    };

    return getResponse;
  }

  async #test({ tests, getResponse, cb }) {
    const promises = [];

    for (const test of tests) {
      const { data } = test;
      const promise = getResponse(data);
      promises.push(promise);
    }

    const results = await Promise.all(promises);

    if (cb) await cb(results);

    return this;
  }

  async testBodyFields(tests, cb) {
    const getResponse = this.#createGetResponse('send');
    await this.#test({ tests, cb, getResponse });
    return this;
  }

  async testQueryParams(tests, cb) {
    const getResponse = this.#createGetResponse('query');
    await this.#test({ tests, cb, getResponse });
    return this;
  }
}

module.exports = SupertestSecurity;
