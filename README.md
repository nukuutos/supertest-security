# Supertest Security

<img src="./ss.png" alt="Supertest Security" align="right" width="240" height="240" />

It's a library that allows us to test api endpoints by fuzzing them with malicious payloads that you can choose. It bases on `supertest` package.

## Installation

```bash
npm i -D supertest-security
```

## How to test body fields

For example we want to test:

- `firstName` field for `XSS` and `SQLi`
- `lastName` field for `XSS`
- `siblings.children` for `unix command injection`

```js
const { SupertestSecurity, dataPreparation, attacks } = require('supertest-security');

const { SQL_INJECTION, XSS, UNIX_COMMAND_INJECTION } = attacks;

const config = {
  endpoint: '/api/endpoint',
  method: 'post',
  // possibility to add custom headers
  headers: { authorization: 'Bearer authString' },
};

const supertest = new SupertestSecurity(app, config);

// we need to provide a valid data
const bodyFields = {
  firstName: 'John',
  lastName: 'Doe',
  siblings: {
    children: ['Chris', 'Alex'],
  },
};

const template = {
  name: SQL_INJECTION,
  firstName: [SQL_INJECTION, XSS],
  lastName: XSS,
  siblings: {
    children: UNIX_COMMAND_INJECTION,
  },
};

// creating tests
const tests = dataPreparation(bodyFields, template);

supertest.testBodyFields(tests, (results) => {
  // your custom checks for results
});
```

## How to test query parameters

For example we want to test:

- `page` param for `XSS` and `SQLi`
- `search` param for `XSS`

```js
const { SupertestSecurity, dataPreparation, attacks } = require('supertest-security');

const { SQL_INJECTION, XSS } = attacks;

const config = {
  endpoint: '/api/endpoint',
  method: 'get',
  // possibility to add custom headers
  headers: { authorization: 'Bearer authString' },
};

const supertest = new SupertestSecurity(app, config);

// we need to provide a valid data
const queryParams = {
  page: 0,
  search: '',
};

const template = {
  page: [SQL_INJECTION, XSS],
  search: XSS,
};

// creating tests
const tests = dataPreparation(queryParams, template);

supertest.testQueryParams(tests, (results) => {
  // your custom checks for results
});
```

## How to test with custom payloads

```js
const { SupertestSecurity, dataPreparation, attacks } = require('supertest-security');

const { XSS } = attacks;

const CUSTOM_XSS = 'CUSTOM_XSS';

const customPayloads = {
  [CUSTOM_XSS]: ['fast', 'and', 'malicious'],
};

const config = {
  endpoint: '/api/endpoint',
  method: 'get',
  // possibility to add custom headers
  headers: { authorization: 'Bearer authString' },
};

const supertest = new SupertestSecurity(app, config);

// we need to provide a valid data
const queryParams = {
  page: 0,
  search: '',
};

const template = {
  page: [XSS, CUSTOM_XSS],
  search: CUSTOM_XSS,
};

// creating tests
const payloads = dataPreparation(correctData, template, customPayloads);

supertest.testQueryParams(tests, (results) => {
  // your custom checks for results
});
```

There's one rule: your custom payloads name shouldn't be same as attacks of `supertest-security`! Our suggestion is to add `CUSTOM_` to your payloads name.

## Contributing

- [x] We love pull requests!
- [x] Adding or updating payloads is cool!
- [x] Adding or updating features is awesome!
