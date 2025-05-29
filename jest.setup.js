const { connectTestDB, closeConnections } = require("./src/tests/setup");

beforeAll(async () => {
  await connectTestDB();
}, 20000);

afterAll(async () => {
  await closeConnections();
});
