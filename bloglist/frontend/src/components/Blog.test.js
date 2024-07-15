import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const newBlog = {
  title: "hello world",
  author: "test",
  likes: 0,
  url: "test.com",
  user: {
    username: "testing",
  },
};

const loggedUser = {
  username: "sus",
  name: "sushant",
};

describe("<Blog /> ", () => {
  let container;
  beforeEach(() => {
    ({ container } = render(<Blog blog={newBlog} signedInUser={loggedUser} />));
  });

  test("initially shows blog's title and author", () => {
    const div = container.querySelector(".title-and-author");
    expect(div).toHaveTextContent("hello world test");
  });

  test("doesn't initially show blog's other details", () => {
    const div = container.querySelector(".blog-extra-details");
    expect(div).toHaveStyle("display:none");
  });
});

describe("<Blog /> after clicking show button ", () => {
  let container;
  let user;
  let viewButton;
  beforeEach(async () => {
    ({ container } = render(<Blog blog={newBlog} signedInUser={loggedUser} />));
    user = userEvent.setup();
    viewButton = screen.getByText("view");
    await user.click(viewButton);
  });

  test("shows extra details", () => {
    const div = container.querySelector(".blog-extra-details");
    expect(div).not.toHaveStyle("display:none");
  });

  test("shows url", () => {
    const div = container.querySelector(".blogUrl");
    expect(div).toHaveTextContent("test.com");
  });

  test("shows likes", () => {
    const div = container.querySelector(".blogLikes");
    expect(div).toHaveTextContent("likes 0");
  });
});

describe("<Blog /> click like button", () => {
  test("twice calls function twice", async () => {
    const mockEditBlog = jest.fn();
    render(
      <Blog blog={newBlog} signedInUser={loggedUser} editBlog={mockEditBlog} />,
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText("view");

    await user.click(viewButton);

    const likeButton = screen.getByText("like");

    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockEditBlog.mock.calls).toHaveLength(2);
  });
});
