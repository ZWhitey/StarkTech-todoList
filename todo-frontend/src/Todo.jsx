import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  useEffect(() => {
    getTodos();
    getUserList();
  }, []);

  async function getTodos() {
    const token = localStorage.getItem('access_token');
    const decoded = jwtDecode(token);

    const res = await axios.get(
      `http://localhost:3000/todo?owner=${decoded.sub}`,
    );
    setTodos(res.data);
    console.log(res.data);
  }

  async function getUserList() {
    const res = await axios.get('http://localhost:3000/users');
    setUserList(res.data);
    console.log(res.data);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    const dueDate = e.target[2].value;
    const isSubtask = e.target[3].checked;
    const res = await axios.post('http://localhost:3000/todo', {
      title,
      description,
      due_date: dueDate,
      parent: isSubtask ? todos[selectedTodoIndex]?._id : null,
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
    await getTodos();
  }

  async function handleDeleteTodo(id) {
    await axios.delete(`http://localhost:3000/todo/${id}`);
    await getTodos();
    setSelectedTodoIndex(null);
  }

  async function handleToggleTodoComplete(e, id) {
    e.preventDefault();
    const res = await axios.patch(`http://localhost:3000/todo/${id}`, {
      done: e.target.checked,
    });
    await getTodos();
  }

  async function handleOpenTodo(index) {
    console.log('open todo', index, todos);
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
          <label>Subtask:</label>
          <input type="checkbox" />
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

          {selectedTodoIndex !== null && (
            <Card key={selectedTodoIndex}>
              <Card.Title>{todos[selectedTodoIndex]?.title}</Card.Title>
              <Card.Body>
                <form id="edit-todo" onSubmit={handleEditTodo} />
                <input
                  form="edit-todo"
                  type="hidden"
                  value={todos[selectedTodoIndex]?._id}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Title: </label>
                  <input
                    form="edit-todo"
                    placeholder="Title"
                    defaultValue={todos[selectedTodoIndex]?.title}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Description: </label>
                  <input
                    form="edit-todo"
                    placeholder="Description"
                    defaultValue={todos[selectedTodoIndex]?.description}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Due Date: </label>
                  <input
                    form="edit-todo"
                    type="date"
                    defaultValue={todos[selectedTodoIndex]?.due_date}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Done: </label>
                  <input
                    checked={todos[selectedTodoIndex]?.done}
                    type="checkbox"
                    onClick={(e) =>
                      handleToggleTodoComplete(e, todos[selectedTodoIndex]?._id)
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <label>Watcher: </label>
                  {todos[selectedTodoIndex]?.watcher?.map((watcher) => (
                    <span>{watcher}</span>
                  )) ?? 'N/A'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <label>Assignee: </label>
                  {todos[selectedTodoIndex]?.assignee?.map((assignee) => (
                    <span>{assignee}</span>
                  )) ?? 'N/A'}
                </div>

                <Button form="edit-todo" type="submit">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDeleteTodo(todos[selectedTodoIndex]?._id)
                  }
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default TodoList;
