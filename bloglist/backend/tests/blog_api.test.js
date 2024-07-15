const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);


let authToken;
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
  const userToCreate = {
    username: "bajrasushant",
    name: "Sushant Bajracharya",
    password: "sushant"
  };
  await User.deleteMany({});
  await api.post("/api/users").send(userToCreate);

  const responseToken = await api.post("/api/login").send({
    username: userToCreate.username,
    password: userToCreate.password
  });

  authToken = responseToken.body.token;
}, 30000);


describe("GET testing", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs").set("Authorization", `Bearer ${authToken}`);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier is named id", async () => {
    const response = await api.get("/api/blogs").set("Authorization", `Bearer ${authToken}`);
    const item = response.body[0];
    expect(item.id).toBeDefined();
  });
});

describe("POST testing", () => {

  test("POST request testing with valid token", async () => {
    const newBlog =
      {
        title: "test",
        author: "test",
        url: "test.com",
        likes: 5,
      };
    const response = await api.post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // verifying length
    const blogsAtEnd = await api.get("/api/blogs").set("Authorization", `Bearer ${authToken}`);

    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1);

    // verifying content added
    const addedBody = blogsAtEnd.body.find(blog => blog.id === response.body.id);
    expect(addedBody.title).toBe(newBlog.title);
    expect(addedBody.author).toBe(newBlog.author);
    expect(addedBody.url).toBe(newBlog.url);
  });

  test("no likes property will default to 0", async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "test.com"
    };
    const response = await api.post("/api/blogs/").set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201);
    expect(response.body.likes).toBe(0);
  });

  test("no accept no title or url", async () => {
    const newBlogs = [{
      author: "test"
    },
    {
      title: "test",
      author: "test",
    },
    { author: "test",
      url: "test.com"
    }];

    const resObjects = await Promise.all(
      newBlogs.map(blog => {
        return api.post("/api/blogs/").send(blog).set("Authorization", `Bearer ${authToken}`);
      })
    );
    resObjects.forEach(pro => expect(pro.status).toBe(400));
  });

  test("fail when trying to add blog without token", async () => {
    const newBlog = {
      author: "test",
      title: "test",
      url: "test.com"
    };
    await api.post("/api/blogs").send(newBlog).expect(401);
  });

});

describe("DELETE testing", () => {
  test("Deleting", async () => {
    const blogsAtFirst = await helper.blogsInDb();
    const idBlogsToDel = blogsAtFirst[0].id;

    api.delete(`/api/blogs/${idBlogsToDel}`).set("Authorization", `Bearer ${authToken}`).expect(204);
  });
});

describe("PUT testing", () => {
  test("Updating data", async () => {
    const blogsAtFirst = await helper.blogsInDb();
    const updatedBlog = {
      title: "test",
      author: "Sushant Bajracharya",
    };
    await api.put(`/api/blogs/${blogsAtFirst[0].id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedBlog)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].author).toBe(updatedBlog.author);
    expect(blogsAtEnd).toHaveLength(blogsAtFirst.length);
  });
});


afterAll(async () => { await mongoose.connection.close();
});
