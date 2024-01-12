import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const res = await axios.get('http://localhost:3000/todo');
    setTodos(res.data);
    console.log(res.data);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    const dueDate = e.target[2].value;
    const res = await axios.post('http://localhost:3000/todo', {
      title,
      description,
      due_date: dueDate,
    });
    setTodos([...todos, res.data]);
  }

  async function handleEditTodo(e) {
    e.preventDefault();
    const id = e.target[0].value;
    const title = e.target[1].value;
    const description = e.target[2].value;
    const dueDate = e.target[3].value;
    const res = await axios.patch(`http://localhost:3000/todo/${id}`, {
      title,
      description,
      due_date: dueDate,
    });
    setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
    setSelectedTodo(res.data);
    console.log(res.data, todos, selectedTodo, selectedTodoIndex);
  }

  async function handleDeleteTodo(id) {
    await axios.delete(`http://localhost:3000/todo/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  async function handleToggleTodoComplete(e, id) {
    e.preventDefault();
    const res = await axios.patch(`http://localhost:3000/todo/${id}`, {
      done: e.target.checked,
    });
    setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
  }

  async function handleOpenTodo(index) {
    console.log('open todo', index);
    setSelectedTodo(todos[index]);
    setSelectedTodoIndex(index);
  }

  return (
    <>
      <div>
        <h1>Todo</h1>
      </div>
      <div>
        <h2>Add todo</h2>
        <form onSubmit={handleAddTodo}>
          <input type="text" placeholder="Title" />
          <input type="text" placeholder="Description" />
          <input type="date" />
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <h2>Todo List</h2>
        <div style={{ display: 'flex' }}>
          <div>
            <ListGroup>
              {todos &&
                todos.map((todo, index) => (
                  <ListGroup.Item
                    key={'list-' + index}
                    action
                    onClick={() => handleOpenTodo(index)}
                    active={selectedTodoIndex === index}
                  >
                    {todo.title}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>

          {selectedTodo !== null && (
            <Card key={selectedTodoIndex}>
              <Card.Title>{selectedTodo?.title}</Card.Title>
              <Card.Body>
                <form id="edit-todo" onSubmit={handleEditTodo} />
                <input
                  form="edit-todo"
                  type="hidden"
                  value={selectedTodo?.id}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Title: </label>
                  <input
                    form="edit-todo"
                    placeholder="Title"
                    defaultValue={selectedTodo?.title}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Description: </label>
                  <input
                    form="edit-todo"
                    placeholder="Description"
                    defaultValue={selectedTodo?.description}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Due Date: </label>
                  <input
                    form="edit-todo"
                    type="date"
                    defaultValue={selectedTodo?.due_date}
                  />
                </div>

                <Button form="edit-todo" type="submit">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTodo(selectedTodo?.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
      {/* <div>
        <h2>Todo List</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Watcher</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <form id="edit-todo" onSubmit={handleEditTodo} />
                <td>
                  <input
                    checked={todo.done}
                    type="checkbox"
                    onClick={(e) => handleToggleTodoComplete(e, todo.id)}
                  />
                </td>
                <td>
                  <input form="edit-todo" type="hidden" value={todo.id} />
                  <input
                    form="edit-todo"
                    placeholder="Title"
                    defaultValue={todo.title}
                  />
                </td>
                <td>
                  <input
                    form="edit-todo"
                    placeholder="Description"
                    defaultValue={todo.description}
                  />
                </td>
                <td>
                  <input
                    form="edit-todo"
                    type="date"
                    defaultValue={todo.due_date}
                  />
                </td>
                <td>{todo.watcher?.join(',') ?? 'N/A'}</td>
                <td>{todo.assignee?.join(',') ?? 'N/A'}</td>
                <td>
                  <button form="edit-todo" onSubmit={handleEditTodo}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </>
  );
}

export default TodoList;
