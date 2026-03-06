import { render } from "@testing-library/react";
import Note from "../components/Note";

test("renders Note component - snapshot", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const { container } = render(
    <Note note={note} toggleImportance={() => {}} />,
  );

  expect(container).toMatchSnapshot();
});

test("renders Note component with important false - snapshot", () => {
  const note = {
    content: "This is not important",
    important: false,
  };

  const { container } = render(
    <Note note={note} toggleImportance={() => {}} />,
  );

  expect(container).toMatchSnapshot();
});
