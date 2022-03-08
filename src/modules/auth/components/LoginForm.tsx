import React from 'react'
import { Form, Input, Button } from 'antd';

export default function LoginForm(props:any) {
    const onFinish = (values: any) => {
        props.onLogin(values);
        console.log('Success:', values);
    };

    return (
        <div className="p-3" style={{ width: '412px', margin: '25vh auto', backgroundColor: '#f3f3f3' }}>
            <h3 className="text-center pt-3 mb-3">Login</h3>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input your password!' 
                        },
                        { 
                            min: 6, message: 'Username must be minimum 6 characters.' 
                        },
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button style={{ width: '100%', backgroundColor: '#218838', color: '#fff' }} htmlType="submit" >
                        <i className="fa-solid fa-right-to-bracket mr-2"></i>Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
