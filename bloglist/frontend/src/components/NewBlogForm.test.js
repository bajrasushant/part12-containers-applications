import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

test("<NewBlogForm /> updates and calls submit", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<NewBlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole("textbox");
  const submitButton = screen.getByText("create");
  await user.type(inputs[0], "testFromJest");
  await user.type(inputs[1], "jest");
  await user.type(inputs[2], "jest.com");

  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testFromJest");
  expect(createBlog.mock.calls[0][0].author).toBe("jest");
  expect(createBlog.mock.calls[0][0].url).toBe("jest.com");
});
