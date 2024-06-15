import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8080/user/get-list').then(response => {
            setUsers(response.data);
        })
            .catch(error => {
                console.error('There was an error fetching the user list!', error);
            });
    }, []);

    const handleShow = (user) => {
        setCurrentUser(user);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        if (currentUser.userId) {
            axios.put(`http://localhost:8080/user`, {
                UserName: currentUser.userName,
                Password: currentUser.pass
            }).then(() => {
                setUsers(users.map(u => (u.userId === currentUser.userId ? currentUser : u)));
            });
        } else {
            axios.post('http://localhost:8080/user/web', {
                UserName: currentUser.userName,
                Password: currentUser.pass
            }).then(response => {
                setUsers([...users, response.data.user]);
            });
        }
        setShow(false);
    };

    const handleDelete = (userId) => {
        axios.delete(`http://localhost:8080/user/${userId}`, {
            params: {
                UserId: userId
            }
        }).then(() => {
            setUsers(users.filter(u => u.userId !== userId));
        });
    };

    const handleChange = (e) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>User Management</h2>
            <Button onClick={() => handleShow({})}>Add User</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>
                                <Button onClick={() => handleShow(user)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(user.userId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentUser.userId ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="userName" value={currentUser.userName || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="pass" value={currentUser.pass || ''} onChange={handleChange} />
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

export default UserManagement;
