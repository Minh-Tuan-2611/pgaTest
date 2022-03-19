import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd';

export default function LoginForm(props: any) {

    const onFinish = (values: any) => {
        props.onLogin(values);
        console.log('Success:', values);
    };

    let [disabled, setDisabled] = useState(true);

    let [value,setValue] = useState({
        email:'',
        password:''
    })

    useEffect(() => {
        if(value.email.trim()!==''&&value.password.trim()!=='') {
            setDisabled(false);
        }
        else if(value.email.trim() === '' || value.password.trim() === '') {
            setDisabled(true);
        }
    },[value])

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
                    <Input onChange={(event: any)=>{
                        setValue({...value,email: event.target.value})
                    }} placeholder="Email" />
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
                    <Input.Password onChange={(event: any)=>{
                        setValue({...value,password: event.target.value})
                    }} placeholder="Password" />
                </Form.Item>
                {/* style={{ width: '100%', backgroundColor: '#218838', color: '#fff' }} */}

                <Form.Item>
                    <button className="btn" disabled={disabled} style={{ width: '100%', backgroundColor: '#218838', color: '#fff' }} type="submit" >
                        <i className="fa-solid fa-right-to-bracket mr-2"></i>Login
                    </button>
                </Form.Item>
            </Form>
        </div>
    )
}
