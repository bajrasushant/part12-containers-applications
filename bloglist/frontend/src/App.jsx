import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import { setNotification } from "./reducers/notificationReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false);

  useEffect(() => {
    if (user) {
      blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      // setMessage({ message: "wrong credentials, try again", status: "error" });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
      dispatch(
        setNotification({
          message: "wrong credentials, try again",
          status: "error",
        }),
      );
      // setNotification({message: `
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("loggedUser");
      window.location.reload();
    } catch {
      dispatch(
        setNotification({ message: "something went wrong", status: "error" }),
      );
      // setMessage({ message: "something went wrong", status: "error" });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);
      blogService.getAll().then((blogs) => setBlogs(blogs));
      dispatch(
        setNotification({
          message: `a new blog ${blog.title} by ${blog.author} added`,
          status: "success",
        }),
      );
      // setMessage({
      //   message: `a new blog ${blog.title} by ${blog.author} added`,
      //   status: "success",
      // });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    } catch (error) {
      dispatch(
        setNotification({ message: "Something went wrong", status: "error" }),
      );
      // setMessage({ message: "Something went wrong", status: "error" });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    } finally {
      setNewBlogFormVisible(false);
    }
  };

  const newBlogForm = () => {
    const hideWhenVisible = { display: newBlogFormVisible ? "none" : "" };
    const showWhenVisible = { display: newBlogFormVisible ? "" : "none" };
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogFormVisible(true)}>new form</button>
        </div>
        <div style={showWhenVisible}>
          <NewBlogForm createBlog={addBlog} />
          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const updateBlog = async (updatedBlog) => {
    try {
      await blogService.edit(updatedBlog);
      setBlogs(
        blogs
          .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
          .sort((a, b) => b.likes - a.likes),
      );
      dispatch(
        setNotification({
          message: `Blog ${updatedBlog.title} was successfully updated`,
          status: "success",
        }),
      );
      // setMessage({
      //   message: `Blog ${updatedBlog.title} was successfully updated`,
      //   status: "success",
      // });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    } catch (e) {
      dispatch(
        setNotification({ message: "Couldn't update blog", status: "error" }),
      );
      // setMessage({ message: "Couldn't update blog", status: "error" });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    }
  };

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.deleteBlog(blogToDelete.id);
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      dispatch(
        setNotification({
          message: `${blogToDelete.title} successfully deleted`,
          status: "success",
        }),
      );
      // setMessage({
      //   message: `${blogToDelete.title} successfully deleted`,
      //   status: "success",
      // });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    } catch (error) {
      dispatch(
        setNotification({ message: "Couldn't delete blog", status: "error" }),
      );
      // setMessage({ message: "Couldn't delete blog", status: "error" });
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
    }
  };

  const blogsComp = () => {
    return (
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            editBlog={updateBlog}
            deleteBlog={deleteBlog}
            signedInUser={user}
          />
        ))}
      </div>
    );
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login to the application</h2>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  return (
    <div>
      <Notification message={message} />
      {user === null && loginForm()}
      {user !== null && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} is logged in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {newBlogForm()}
          {blogsComp()}
        </div>
      )}
    </div>
  );
};
export default App;
