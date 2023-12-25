import React from 'react'
import Layout from './../components/Layout';
import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const ApplyDoctor = () => {

    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // handle  form
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading())
            console.log(values);
            const res = await axios.post("/api/v1/user/apply-doctor", { ...values, userId: user._id, timings: [
                moment(values.timings[0]).format("HH:mm"),
                moment(values.timings[1]).format("HH:mm"),
              ], },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if(res.data.success){
                message.success(res.data.message)
                navigate('/')
            }else {
                message.error(res.data.message)
            }
            
        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            message.error("Something went Wrong")
        }
    }
    return (
        <Layout>
            <h1 className='text-center'> Apply Doctor</h1>
            <Form layout='vertical' onFinish={handleFinish} className='m-3'>
                <h4>Personal Details: </h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='first name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='last name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Phone" name="phone" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Phone Number' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Email" name="email" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Email' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Website" name="website">
                            <Input type='text' placeholder='Website' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Address' />
                        </Form.Item>
                    </Col>
                </Row>
                <h4>Professional Details: </h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Specialization" name="specialization" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Specialization' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Experience" name="experience" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Experience' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Fees" name="feesPerConsultation" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='fees' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Timings" name="timings" required rules={[{ required: true }]}>
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>
                </Row>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-primary' type='submit'>Submit</button>
                </div>

            </Form>
        </Layout>
    )
}

export default ApplyDoctor