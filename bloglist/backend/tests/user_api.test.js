const app = require("../app");
const supertest = require("supertest");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
}, 20000);

describe("Success testing", () => {
  test("creation success with fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "bajrasushant",
      name: "Sushant Bajracharya",
      password: "sushant"
    };

    await api.post("/api/users").send(newUser).expect(201).expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

});

describe("Failure testing", () => {
  test("creation fails with duplicate username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "Sushant Bajracharya",
      password: "sushant"
    };

    const result =  await api.post("/api/users").send(newUser).expect(400).expect("Content-Type", /application\/json/);
    expect(result.body.error).toContain("expected `username` to be unique");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails if username and password have less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    // testing for new user with short password
    const userWithShortPW = helper.createUser({ password: "pw" });
    const resultShortPW = await api.post("/api/users").send(userWithShortPW).expect(401).expect("Content-Type", /application\/json/);
    expect(resultShortPW.body.error).toBe("username and password should contain atleast 3 characters");

    // testing for new user with short username
    const userWithShortUsername = helper.createUser({ username: "un" });
    const resultShortUsername = await api.post("/api/users").send(userWithShortUsername).expect(401).expect("Content-Type", /application\/json/);
    expect(resultShortUsername.body.error).toBe("username and password should contain atleast 3 characters");


    // testing for new user with short fields
    const userWithShortFields = helper.createUser({ username: "un", password: "pw" });
    const resultShortFields = await api.post("/api/users").send(userWithShortFields).expect(401).expect("Content-Type", /application\/json/);
    expect(resultShortFields.body.error).toBe("username and password should contain atleast 3 characters");


    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails if username or password either or both is not given", async () => {
    const usersAtStart = await helper.usersInDb();
    let newUser = {
      name: "Default User",
      password: "defaultPassword",
    };

    let result = await api.post("/api/users").send(newUser).expect(401).expect("Content-Type", /application\/json/);
    expect(result.body.error).toBe("username and password both required");

    newUser = {
      username: "defaultUsername",
      name: "Default User",
    };
    result = await api.post("/api/users").send(newUser).expect(401).expect("Content-Type", /application\/json/);
    expect(result.body.error).toBe("username and password both required");

    newUser = {
      name: "Default User",
    };
    result = await api.post("/api/users").send(newUser).expect(401).expect("Content-Type", /application\/json/);
    expect(result.body.error).toBe("username and password both required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
