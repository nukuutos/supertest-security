const app = require('./app');
const SupertestSecurity = require('./supertest-security/supertest-security');
const dataPreparation = require('./supertest-security/data-preparation');

const { getTimeForExecution } = require('./utils');

const config = {
  template: '/user/:userId',
  method: 'put',
  routeParams: { userId: '123' },
  headers: { Authorization: 'Bearer authstring' },
};

const supertest = new SupertestSecurity(app, config);

const bodyFields = {
  firstName: 'Nikita',
  lastName: 'Voloshin',
  siblings: ['uncle'],
  nested: {
    age: 22,
    nestedNested: {
      something: 'value',
      array: ['good'],
    },
  },
  objectArray: [{ property: 'haha' }],
};

const template = {
  firstName: ['xss', 'sql-injection'],
  lastName: 'sql-injection',
  nested: {
    nestedNested: {
      somthing: 'xss',
      array: 'sql-injection',
    },
  },
};

const tests = dataPreparation(bodyFields, template);

// supertest.testBodyFields(tests, (responses) => {
//   for (const response of responses) {
//     console.log(response.statusCode);
//   }
// });

// 5844 per 15.256s
getTimeForExecution(() =>
  supertest.testBodyFields(tests, (responses) => console.log(responses.length))
);
