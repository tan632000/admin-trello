import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Pagination, InputGroup, FormControl } from 'react-bootstrap';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://34.142.249.60/user/get-list').then(response => {
            setUsers(response.data);
            setFilteredUsers(response.data);
        })
            .catch(error => {
                console.error('There was an error fetching the user list!', error);
            });
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.userName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(results);
        setCurrentPage(1);
    }, [search, users]);

    const handleShow = (user) => {
        setCurrentUser(user);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        if (currentUser.userId) {
            axios.put(`http://34.142.249.60/user`, {
                UserName: currentUser.userName,
                Password: currentUser.pass
            }).then(() => {
                setUsers(users.map(u => (u.userId === currentUser.userId ? currentUser : u)));
            });
        } else {
            axios.post('http://34.142.249.60/user/web', {
                UserName: currentUser.userName,
                Password: currentUser.pass
            }).then(response => {
                setUsers([...users, response.data.user]);
            });
        }
        setShow(false);
    };

    const handleDelete = (userId) => {
        axios.delete(`http://34.142.249.60/user/${userId}`, {
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

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const pageCount = Math.ceil(filteredUsers.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h2>User Management</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by name..."
                    onChange={handleSearchChange}
                />
                <Button onClick={() => handleShow({})}>Add User</Button>
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.userName}</td>
                            <td>
                                <Button onClick={() => handleShow(user)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(user.userId)}>Delete</Button>
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
