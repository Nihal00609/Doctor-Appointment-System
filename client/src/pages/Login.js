import React from 'react'
import "../styles/RegisterStyles.css"
import { Form, Input, message } from 'antd'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate= useNavigate()

    // form handler
    const onfinishHandler = async (values) => {
        // console.log(values);
        try {
            const res = await axios.post("/api/v1/user/login", values)
            window.location.reload();
            if (res.data.success) {
                localStorage.setItem("token", res.data.token)
                message.success("Login Successfully")
                navigate("/")
            } else {
                message.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong")
        }
    }
    return (
        <>
            <div  >
            <h1 className='text-center p-3 bg-danger bg-gradient text-white'>Doctor Appointment System</h1>
                <hr />
            <div className='form-container'>
                <Form layout='vertical' onFinish={onfinishHandler} className='register-form'>
                    <h3 className='text-center'>Login Form</h3>
                    <Form.Item label='Email' name='email' >
                        <Input type='email' required />
                    </Form.Item>
                    <Form.Item label='Password' name='password' >
                        <Input type='password' required />
                    </Form.Item>
                    <Link to="/register" className='m-2'>Not A User Register Here</Link>
                    <button className='btn btn-primary' type='submit'>Login</button>

                </Form>
            </div>
            </div>
        </>
    )
}

export default Login