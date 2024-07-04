const Todo = ({ todo }) => {
  return (
    <>
      <h1 className="todo-text">Todo:{todo.text}</h1>
      <div className="todo-status">
        {todo.done ? <h3>Done</h3> : <h3>Not done</h3>}
      </div>
    </>
  );
};

export default Todo;
