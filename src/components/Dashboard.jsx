import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';

const TaskCompletionChart = () => {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get('http://34.142.249.60/tasks').then(response => {
            setTasks(response.data);
        })
            .catch(error => {
                console.error('There was an error fetching the task list!', error);
            });
    }, []);

    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.status === 'DONE');

        const dateData = {};
        tasks.forEach(task => {
            const createDate = new Date(task.createTime).toDateString();
            if (createDate in dateData) {
                dateData[createDate]++;
            } else {
                dateData[createDate] = 1;
            }
        });

        const data = Object.keys(dateData).map(date => ({
            date,
            tasksCompleted: dateData[date]
        }));

        setTaskData(data);

        const userData = {};
        filteredTasks.forEach(task => {
            const assignName = task.assignName;
            if (assignName in userData) {
                userData[assignName]++;
            } else {
                userData[assignName] = 1;
            }
        });

        const userDataArray = Object.keys(userData).map(assignName => ({
            user: assignName,
            tasksCompleted: userData[assignName]
        }));

        setUserData(userDataArray);
    }, [tasks]);

    return (
        <div>
            <h2>Task Completion Over Time</h2>
            <LineChart width={800} height={400} data={taskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>

            <h2>Task Completion by User</h2>
            <BarChart width={800} height={400} data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasksCompleted" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default TaskCompletionChart;
