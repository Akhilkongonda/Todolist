import React, { useEffect, useRef, useState } from 'react';
import './Task2.css';
import axios from 'axios';



function Task2() {
  const taskRef = useRef('');
  const [task, setTask] = useState('');
  const [messages, setMessages] = useState([]);
  const [res, setRes] = useState('');
  const [editMode, setEditMode] = useState([]); // State for tracking edit mode for each task
  const [editedTasks, setEditedTasks] = useState([]); // State for storing edited task text for each task

  const submit = () => {
    const newTask = taskRef.current.value;
    setTask(newTask);

    axios
      .post('http://localhost:5000/addTask', { task: newTask })
      .then((response) => {
        setRes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    taskRef.current.value = '';
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/gettask')
      .then((res) => {
        setMessages(res.data);
        // Initialize edit mode and edited tasks state for each task
        setEditMode(res.data.map(() => false));
        setEditedTasks(res.data.map(() => ''));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [task]);

  function handleDelete(index) {
    const updatedMessages = [...messages];
    const deletedTask = updatedMessages.splice(index, 1)[0];
    setMessages(updatedMessages);

    axios
      .delete(`http://localhost:5000/deleteTask/${deletedTask._id}`)
      .then((res) => {
        console.log(`Task with ID ${deletedTask._id} deleted from the database.`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Function to toggle edit mode for a specific task
  function toggleEditMode(index) {
    const newEditMode = [...editMode];
    newEditMode[index] = !newEditMode[index];
    setEditMode(newEditMode);

    // Reset the edited task text for this task
    const newEditedTasks = [...editedTasks];
    newEditedTasks[index] = messages[index].task;
    setEditedTasks(newEditedTasks);
  }

  // Function to handle task text editing
  function handleEdit(index) {
    const updatedMessages = [...messages];
    updatedMessages[index].task = editedTasks[index];
    setMessages(updatedMessages);

    // Send a request to your backend to update the task text in the database
    axios
      .put(`http://localhost:5000/updateTask/${messages[index]._id}`, { task: editedTasks[index] })
      .then((res) => {
        console.log(`Task with ID ${messages[index]._id} updated in the database.`);
      })
      .catch((err) => {
        console.log(err);
      });

    // Exit edit mode for this task
    toggleEditMode(index);
  }

  return (
    
    <div className='container mt-4'>
      <div className='card card-title'>
        <h4 className='text-center mt-4 texthead'> There's no better feeling than crossing off a task on your to-do list. 📝</h4>
        <div className='card-body m-auto'>
          <div className='display-block m-auto'>
            <div className='input-group'>
              <input
                ref={taskRef}
                type="text"
                name="addtodo"
                id="addtodo"
                className='input'
              />
              <div onClick={submit} tabIndex="0" className="plusButton">
                <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <g mask="url(#mask0_21_345)">
                    <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div style={{ color: 'red' }}>
          {res.message === "Please enter a task" && <p className='text-center'>***please enter a task</p>}
        </div>
      </div>

      {messages.map((obj, index) => (
        <div key={index} className='task1'>
          {editMode[index] ? (
            <div className='input-group'>

              <input
                type="text"
                className='input'
                style={{height:"40px"}}
                value={editedTasks[index]}
                onChange={(e) => {
                  const newEditedTasks = [...editedTasks];
                  newEditedTasks[index] = e.target.value;
                  setEditedTasks(newEditedTasks);
                }}
              />
              <button className=' save-button' onClick={() => handleEdit(index)}>Save</button>
            </div>
          ) : (
            <p className='textp' >👉
              {obj.task}
              <div>
              <span className='edit-button'>
                <button onClick={() => toggleEditMode(index)}>Edit</button>
             
             
                <button  onClick={() => handleDelete(index)}>Done</button>
              </span>

              </div>
              
             
            </p>
          )}
        </div>
      ))}
    </div>
   
  );
}

export default Task2;
