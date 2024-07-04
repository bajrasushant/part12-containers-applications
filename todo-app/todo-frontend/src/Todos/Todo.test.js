import Todo from "./Todo";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

const todo = {
  id: 1,
  text: "Test todo",
  done: false,
};

describe("<Todo /> component test", () => {
  let container;
  beforeEach(() => {
    const rendered = render(<Todo todo={todo} />)
    container = rendered.container;
  });
  test("shows Todo text", () => {
    const div = container.querySelector(".todo-text");
    expect(div).toHaveTextContent("Test todo");
  });

  test("shows Todo text", () => {
    const div = container.querySelector(".todo-status");
    expect(div).toHaveTextContent("Not done");
  });
});
