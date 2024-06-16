import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://34.142.249.60/tasks').then(response => {
            setTasks(response.data);
            setFilteredTasks(response.data);
        }).catch(error => {
            console.error('There was an error fetching the task list!', error);
        });
    }, []);

    useEffect(() => {
        axios.get('http://34.142.249.60/user/get-list').then(response => {
            setUsers(response.data);
        }).catch(error => {
            console.error('There was an error fetching the user list!', error);
        });
    }, []);

    useEffect(() => {
        const filtered = tasks.filter(task =>
            task.name.toLowerCase().includes(search.toLowerCase()) ||
            task.desciption.toLowerCase().includes(search.toLowerCase()) ||
            task.taskType.toLowerCase().includes(search.toLowerCase()) ||
            (getUserByName(task.assignTo) && getUserByName(task.assignTo).toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredTasks(filtered);
        setCurrentPage(1);
    }, [search, tasks, users]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleShow = (task) => {
        setCurrentTask(task);
        setShow(true);
    };

    const getUserByName = (userId) => {
        const user = users.find(u => u.userId == userId);
        return user ? user.userName : '';
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        const userName = getUserByName(currentTask.assignTo);
        if (currentTask.id) {
            axios.put(`http://34.142.249.60/task`, {
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
                    user_id: localStorage.getItem('userId'),
                })
            }).then(() => {
                setTasks(tasks.map(u => (u.id === currentTask.id ? currentTask : u)));
            });
        } else {
            axios.post(`http://34.142.249.60/task`, {
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
                    user_id: localStorage.getItem('userId'),
                })
            }).then(() => {
                setTasks(tasks.map(u => (u.id === currentTask.id ? currentTask : u)));
            });
        }
        setShow(false);
    };

    const handleDelete = (taskId) => {
        axios.delete(`http://34.142.249.60/task/${taskId}`).then(() => {
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

    const pageCount = Math.ceil(filteredTasks.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h2>Task Management</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by task title, description, sprint, assigned to..."
                    onChange={handleSearchChange}
                />
                <Button onClick={() => handleShow({})}>Add Task</Button>
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
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
                    {currentTasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.name}</td>
                            <td>{task.desciption}</td>
                            <td>{task.priority}</td>
                            <td>{task.taskType}</td>
                            <td>{task.sprint}</td>
                            <td>{task.status}</td>
                            <td>{getUserByName(task.assignTo)}</td>
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
            <Pagination>
                {[...Array(pageCount).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
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
