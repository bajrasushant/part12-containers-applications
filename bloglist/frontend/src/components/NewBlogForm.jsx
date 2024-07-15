import { useState } from "react";

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleTitleChange = ({ target }) => setTitle(target.value);

  const handleAuthorChange = ({ target }) => setAuthor(target.value);

  const handleUrlChange = ({ target }) => setUrl(target.value);

  return (
    <div>
      <form className="formDiv" onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title:
          <input
            id="title"
            type="text"
            name="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            name="Author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            name="URL"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button id="submit-new-blog" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default NewBlogForm;
