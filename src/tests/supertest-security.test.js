const fs = require('fs');
const path = require('path');
const { SQL_INJECTION } = require('../attack-types');

const dataPreparation = require('../data-preparation/data-preparation');
const SupertestSecurity = require('../supertest-security');

const app = require('./app');

describe('Supertest security', () => {
  it('should successfully send payloads in query params', async () => {
    const config = {
      endpoint: '/api/endpoint',
      method: 'get',
      headers: { authorization: 'Bearer auth string', custom: 'some value' },
    };

    const supertest = new SupertestSecurity(app, config);

    const queryFields = {
      page: 1,
    };

    const template = {
      page: SQL_INJECTION,
    };

    const tests = dataPreparation(queryFields, template);

    await supertest.testQueryParams(tests, (results) => {
      const pathOriginalValues = path.rootJoin('src', 'payloads', 'sql-injection.txt');

      const originalValues = fs
        .readFileSync(pathOriginalValues, { encoding: 'utf-8' })
        .split('\r\n')
        .sort((a, b) => a.localeCompare(b));

      const uniquePayloads = [...new Set(results.map(({ body }) => body.query.page))];

      expect(uniquePayloads).toHaveLength(originalValues.length);

      results
        .sort((a, b) => a.body.query.page.localeCompare(b.body.query.page))
        .forEach((result, index) => {
          const { query, headers } = result.body;
          const originalValue = originalValues[index];

          expect(query.page).toBe(originalValue);

          expect(headers.authorization).toBe(config.headers.authorization);
          expect(headers.custom).toBe(config.headers.custom);
        });
    });
  });

  it('should successfully send payloads in body fields', async () => {
    const config = {
      endpoint: '/api/endpoint',
      method: 'post',
      headers: { authorization: 'Bearer auth string', custom: 'some value' },
    };

    const supertest = new SupertestSecurity(app, config);

    const bodyFields = {
      name: 1,
    };

    const template = {
      name: SQL_INJECTION,
    };

    const tests = dataPreparation(bodyFields, template);

    await supertest.testBodyFields(tests, (results) => {
      const pathOriginalValues = path.rootJoin('src', 'payloads', 'sql-injection.txt');

      const originalValues = fs
        .readFileSync(pathOriginalValues, { encoding: 'utf-8' })
        .split('\r\n')
        .sort((a, b) => a.localeCompare(b));

      const uniquePayloads = [...new Set(results.map(({ body }) => body.body.name))];

      expect(uniquePayloads).toHaveLength(originalValues.length);

      results
        .sort((a, b) => a.body.body.name.localeCompare(b.body.body.name))
        .forEach((result, index) => {
          const { body, headers } = result.body;
          const originalValue = originalValues[index];

          expect(body.name).toBe(originalValue);

          expect(headers.authorization).toBe(config.headers.authorization);
          expect(headers.custom).toBe(config.headers.custom);
        });
    });
  });

  // eslint-disable-next-line jest/expect-expect, jest/no-commented-out-tests
  //   it('speedtest', async () => {
  //     const config = {
  //       endpoint: '/api/endpoint',
  //       method: 'post',
  //       headers: { authorization: 'Bearer auth string' },
  //     };

  //     const supertest = new SupertestSecurity(app, config);

  //     const bodyFields = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       age: '18',
  //       children: ['Chris', 'Elena', 'R2D2'],
  //       geolocation: {
  //         city: 'City',
  //         address: 'Long address name',
  //       },
  //     };

  //     const template = {
  //       firstName: [XSS, SQL_INJECTION],
  //       lastName: [XSS, SQL_INJECTION],
  //       age: [XSS, SQL_INJECTION],
  //       children: [XSS, SQL_INJECTION],
  //       geolocation: {
  //         city: [XSS, SQL_INJECTION],
  //         address: [XSS, SQL_INJECTION],
  //       },
  //     };

  //     const fieldsCount = 6;

  //     const pathXSS = path.rootJoin('src', 'payloads', 'xss.txt');
  //     const pathSQL = path.rootJoin('src', 'payloads', 'sql-injection.txt');

  //     const xssLength = fs.readFileSync(pathXSS, { encoding: 'utf-8' }).split('\r\n').length;
  //     const sqlLength = fs.readFileSync(pathSQL, { encoding: 'utf-8' }).split('\r\n').length;

  //     console.log(`Execution of ${(xssLength + sqlLength) * fieldsCount} payloads`);
  //     console.time(`Time`);
  //     const tests = dataPreparation(bodyFields, template);
  //     await supertest.testBodyFields(tests);
  //     console.timeEnd(`Time`);
  //   }, 120000);
});
