import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/tasks').then(response => {
            setTasks(response.data);
        })
            .catch(error => {
                console.error('There was an error fetching the user list!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/user/get-list').then(response => {
            setUsers(response.data);
        })
            .catch(error => {
                console.error('There was an error fetching the user list!', error);
            });
    }, []);

    const handleShow = (task) => {
        setCurrentTask(task);
        setShow(true);
    };

    const getUserByName = (userId) => {
        const user = users.find(u => u.userId == userId);
        return user ? user.userName : null;
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        const userName = getUserByName(currentTask.assignTo);
        if (currentTask.id) {
            axios.put(`http://localhost:8080/task`, {
                Data: JSON.stringify({
                    id: currentTask.id,
                    assignName: userName,
                    assignTo: currentTask.assignTo,
                    sprint: currentTask.sprint,
                    taskType: currentTask.taskType,
                    priority: currentTask.priority,
                    desciption: currentTask.desciption,
                    name: currentTask.name,
                    status: currentTask.status,
                    startTime: currentTask.createTime,
                    createTime: currentTask.createTime,
                    endTime: currentTask.endTime,
                    comment: '',
                    user_id: 'h31ar6zi-jgVY-nFBVT0ZElmtS8DLGMz',
                })
            }).then(() => {
                setTasks(tasks.map(u => (u.id === currentTask.id ? currentTask : u)));
            });
        } else {
            axios.post(`http://localhost:8080/task`, {
                Data: JSON.stringify({
                    assignName: userName,
                    assignTo: currentTask.assignTo,
                    sprint: currentTask.sprint,
                    taskType: currentTask.taskType,
                    priority: currentTask.priority,
                    desciption: currentTask.desciption,
                    name: currentTask.name,
                    status: currentTask.status,
                    startTime: currentTask.createTime,
                    createTime: currentTask.createTime,
                    endTime: currentTask.endTime,
                    comment: '',
                    user_id: 'h31ar6zi-jgVY-nFBVT0ZElmtS8DLGMz',
                })
            }).then(() => {
                setTasks(tasks.map(u => (u.id === currentTask.id ? currentTask : u)));
            });
        }
        setShow(false);
    };

    const handleDelete = (taskId) => {
        axios.delete(`http://localhost:8080/task/${taskId}`).then(() => {
            setTasks(tasks.filter(t => t.id !== taskId));
        });
    };

    const handleChange = (e) => {
        if (e.target.name == 'task_type') {
            setCurrentTask({ ...currentTask, taskType: e.target.value });
        } else if (e.target.name == 'assign_to') {
            setCurrentTask({ ...currentTask, assignTo: e.target.value });
        } else {
            setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        if (currentTask.createTime) {
            setStartDate(new Date(currentTask.createTime));
        } else {
            setStartDate(null);
        }
        if (currentTask.endTime) {
            setEndDate(new Date(currentTask.endTime));
        } else {
            setEndDate(null);
        }
    }, [currentTask]);

    const handleStartDateChange = (date) => {
        if (date) {
            const formattedDate = moment(date).utcOffset('+07:00').format('YYYY-MM-DD');
            setStartDate(date);
            setCurrentTask(prevTask => ({
                ...prevTask,
                createTime: formattedDate
            }));
        } else {
            console.log('Invalid date:', date);
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            const formattedDate = moment(date).utcOffset('+07:00').format('YYYY-MM-DD');
            setEndDate(date);
            setCurrentTask(prevTask => ({
                ...prevTask,
                endTime: formattedDate
            }));
        } else {
            console.log('Invalid date:', date);
        }
    };

    console.log('====================================');
    console.log(tasks);
    console.log('====================================');
    console.log(users);

    return (
        <div>
            <h2>Task Management</h2>
            <Button onClick={() => handleShow({})}>Add Task</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Type</th>
                        <th>Sprint</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Create Time</th>
                        <th>End Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.name}</td>
                            <td>{task.desciption}</td>
                            <td>{task.priority}</td>
                            <td>{task.taskType}</td>
                            <td>{task.sprint}</td>
                            <td>{task.status}</td>
                            <td>{task.assignName}</td>
                            <td>{task.createTime}</td>
                            <td>{task.endTime}</td>
                            <td>
                                <Button onClick={() => handleShow(task)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentTask.id ? 'Edit Task' : 'Add Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="name" value={currentTask.name || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="desciption" value={currentTask.desciption || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Priority</Form.Label>
                            <Form.Control as="select" name="priority" value={currentTask.priority || ''} onChange={handleChange}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="task_type" value={currentTask.taskType || ''} onChange={handleChange}>
                                <option value="TASK">TASK</option>
                                <option value="BUG">BUG</option>
                                <option value="FEATURE">FEATURE</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sprint</Form.Label>
                            <Form.Control type="text" name="sprint" value={currentTask.sprint || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" name="status" value={currentTask.status || ''} onChange={handleChange}>
                                <option value="TODO">TODO</option>
                                <option value="DONE">DONE</option>
                                <option value="REOPEN">REOPEN</option>
                                <option value="IN REVIEW">IN REVIEW</option>
                                <option value="IN PROGRESS">IN PROGRESS</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Assign to</Form.Label>
                            <Form.Control as="select" name="assign_to" value={currentTask.assignTo || ''} onChange={handleChange}>
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.userId} value={user.userId}>{user.userName}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Start Date and End Date</Form.Label>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Start Date"
                                    dateFormat="yyyy-MM-dd"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    selectsEnd
                                    startDate={endDate}
                                    endDate={endDate}
                                    placeholderText="End Date"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TaskManagement;
