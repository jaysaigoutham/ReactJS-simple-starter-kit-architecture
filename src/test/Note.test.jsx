import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "../components/Note";

test("renders content", async () => {
  const mockHandler = vi.fn();
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  render(<Note note={note} toggleImportance={mockHandler} />);

  const element = screen.getByText(
    "Component testing is done with react-testing-library",
  );

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});

test("renders content 2", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const { container } = render(
    <Note note={note} toggleImportance={() => {}} />,
  );

  const div = container.querySelector(".note");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library",
  );
});

test("does not render this", () => {
  const note = {
    content: "This is a reminder",
    important: true,
  };

  render(<Note note={note} toggleImportance={() => {}} />);
  const element = screen.queryByText("do not want this thing to be rendered");
  expect(element).toBeNull();
});
