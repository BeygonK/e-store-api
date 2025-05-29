const mongoose = require("mongoose");
const User = require("../../models/User");
const { clearTestDB } = require("../setup");

describe("User Model Test", () => {
  beforeAll(async () => {
    // No need to connectTestDB here
  }, 10000); // Increase timeout to 10 seconds

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    // No need to closeConnections here
  }, 10000); // Increase timeout to 10 seconds

  it("should create & save user successfully", async () => {
    const validUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe(validUser.firstName);
    expect(savedUser.lastName).toBe(validUser.lastName);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/); // Check if password is hashed
  });

  it("should fail to save user without required fields", async () => {
    const userWithoutRequiredField = new User({ firstName: "John" });
    let err;

    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.lastName).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should fail to save user with invalid email", async () => {
    const userWithInvalidEmail = new User({
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      password: "password123",
    });

    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it("should fail to save user with password less than 6 characters", async () => {
    const userWithShortPassword = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "12345",
    });

    let err;
    try {
      await userWithShortPassword.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should compare password correctly", async () => {
    const user = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    await user.save();

    const isMatch = await user.comparePassword("password123");
    const isNotMatch = await user.comparePassword("wrongpassword");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });
});
