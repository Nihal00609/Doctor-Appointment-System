import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);

    //get users
    const getUsers = async () => {
        try {
            // dispatch(showLoading())
            const res = await axios.get("/api/v1/admin/getAllUsers", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // dispatch(hideLoading())

            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    },[]);

    // antd Table coloumn
    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email",
            dataIndex: "email",
            ellipsis : true,
        },
        {
            title: "Doctor",
            dataIndex: "isDoctor",
            render: (text,record) => (
                <span>{record.isDoctor ? 'Yes' : 'No'}</span>
            )
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text,record) => (
                <div className="d-flex">
                    <button className="btn btn-danger">Block</button>
                </div>
            )
        }
    ]

    return (
        <Layout>
            <h1 className="text-center m-2">Users List</h1>
            <Table columns={columns} dataSource={users}/>
        </Layout>
    );
};

export default Users;
