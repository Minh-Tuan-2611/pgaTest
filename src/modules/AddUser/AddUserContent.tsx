import { Form, Checkbox, Select } from 'antd'
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ROUTES } from '../../configs/routes';
import ButtonConfirmLeaveAddUser from '../ButtonConfirm/ButtonConfirmLeaveAddUser';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },

};

const { Option } = Select;

export default function AddUserContent() {

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: Cookies.get('token') as string },
  };

  let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

  let [leave, setLeave] = useState(false);

  let [loading, setLoading] = useState(false);

  let [type, setType] = useState('individual');

  let [level, setLevel] = useState('10');

  let [changePassword, setChangePassword] = useState('0');

  let [taxExempt, setTaxExempt] = useState('0');

  let [membershipId, setMembershipId] = useState('');

  let [displayRole, setDisplayRole] = useState('none');

  let [role, setRole] = useState(["1"]);

  let [firstName, setFirstName] = useState('');

  let [lastName, setLastName] = useState('');

  let [email, setEmail] = useState('');

  let [password, setPassword] = useState('');

  let [passwordConfirm, setPasswordConfirm] = useState('')

  const renderWidth = () => {
    if (collapsed === true) {
      return '81%'
    }
    if (collapsed === false) {
      return '92%'
    }
  }

  const setDisable = () => {
    if (firstName !== '' && lastName !== '' && email !== '' && password !== '' && passwordConfirm !== '') {
      return false
    }
    else if (firstName === '' || lastName === '' || email === '' || password === '' || passwordConfirm === '') {
      return true
    }
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setLoading(true);
    if (level === '10') {
      let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/create', {
        access_level: level,
        confirm_password: values.confirm,
        email: values.email,
        firstName: values.firstName,
        forceChangePassword: changePassword,
        lastName: values.lastName,
        membership_id: membershipId,
        password: values.password,
        paymentRailsType: type,
        taxExempt: taxExempt,
      }, config)
      promise.then((result) => {
        if (result.data.success === true) {
          setLoading(false);
          Swal.fire(
            'Create User Success !',
            '',
            'success'
          )
          navigate(ROUTES.userList);
        }
        else {
          setLoading(false);
          Swal.fire(
            `${result.data.errors}`,
            '',
            'error'
          )
        }
      })
      promise.catch((error) => {
        setLoading(false);
        Swal.fire(
          'Create Product Fail !',
          '',
          'error'
        )
      })
    }
    else if (level === '100') {
      let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/create', {
        access_level: level,
        confirm_password: values.confirm,
        email: values.email,
        firstName: values.firstName,
        forceChangePassword: changePassword,
        lastName: values.lastName,
        membership_id: membershipId,
        password: values.password,
        paymentRailsType: type,
        roles: role,
        taxExempt: taxExempt,
      }, config)
      promise.then((result) => {
        if (result.data.success === true) {
          setLoading(false);
          Swal.fire(
            'Create User Success !',
            '',
            'success'
          )
          navigate(ROUTES.userList);
        }
        else {
          setLoading(false);
          Swal.fire(
            `${result.data.errors}`,
            '',
            'error'
          )
        }
      })
      promise.catch((error) => {
        setLoading(false);
        Swal.fire(
          'Create Product Fail !',
          '',
          'error'
        )
      })
    }
  };

  return (
    <div>
      <div>
        {loading === true ? <div style={{ display: 'block', backgroundColor: '#888', opacity: '0.5' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
          <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
            <Spinner animation="border" style={{ color: "white" }} />
          </div>
        </div> : ''}
      </div>
      <div className="row">
      {leave === false ? <button onClick={() => {
                        navigate(ROUTES.userList);
                    }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3"><i className="fa-solid fa-arrow-left"></i></button>:''}
                    {leave === true ? <button onClick={() => {
                        dispatch({
                            type: 'change_modal',
                            title: 'Confirm Leave Page',
                            content: 'Do you want to leave page ?',
                            button: <ButtonConfirmLeaveAddUser/>
                          })
                    }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3" data-toggle="modal" data-target="#modelId"><i className="fa-solid fa-arrow-left"></i></button>:''}
      </div>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '80%' }}
      >
        <h3 className="mt-3 mb-3 text-white" style={{ fontWeight: 'bold' }}>Create Profile</h3>
        <h5 className="mt-3 mb-3 text-white">Email & password</h5>

        <Form.Item
          name="firstName"
          label={<label style={{ color: "#fff" }}>First Name</label>}
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
          ]}
        >
          <input onChange={(event: any) => { setFirstName(event.target.value);setLeave(true); }} className="ant-input bg-main" style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={<label style={{ color: "#fff" }}>Last Name</label>}
          rules={[
            {
              required: true,
              message: 'Please input your last name!',
            },
          ]}
        >
          <input onChange={(event: any) => { setLastName(event.target.value);setLeave(true) }} className="ant-input bg-main" style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          name="email"
          label={<label style={{ color: "#fff" }}>Email</label>}
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
          <input onChange={(event: any) => { setEmail(event.target.value);setLeave(true) }} className="ant-input bg-main" style={{ width: '660px' }} />

        </Form.Item>

        <Form.Item
          name="password"
          label={<label style={{ color: "#fff" }}>Password</label>}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 6,
              message: 'Password must be minimum 6 characters.'
            }
          ]}
          hasFeedback
        >
          <input onChange={(event: any) => { setPassword(event.target.value);setLeave(true) }} id="register_password" className="ant-input bg-main" type="password" style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={<label style={{ color: "#fff" }}>Confirm Password</label>}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <input onChange={(event: any) => { setPasswordConfirm(event.target.value);setLeave(true) }} id="register_password" className="ant-input bg-main" type="password" style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          name="type"
          label={<label style={{ color: "#fff" }}>Type</label>}
        >
          <Select onChange={(value: any) => { setType(value);setLeave(true) }} defaultValue="individual" style={{ width: '660px' }} >
            <Option value="individual">Individual</Option>
            <Option value="business">Business</Option>
          </Select>
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h5 className="mt-3 mb-3 text-white">Access information</h5>

        <Form.Item
          name="accessLevel"
          label={<label style={{ color: "#fff" }}>Access Level</label>}
        >
          <Select onChange={(value: any) => {
            setLeave(true)
            setLevel(value);
            if (value === "10") {
              setDisplayRole('none');
            }
            else if (value === "100") {
              setDisplayRole('flex');
            }
          }} defaultValue="10" style={{ width: '660px' }} >
            <Option value="10">Vendor</Option>
            <Option value="100">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          style={{ display: `${displayRole}` }}
          name="role"
          label={<label style={{ color: "#fff" }}>Roles</label>}
        >
          <Select onChange={(value: any) => {
            setLeave(true)
            setRole(value);
          }} mode="multiple" defaultValue={role} style={{ width: '660px' }} >
            <Option value="1">Administrator</Option>
            <Option value="2">Coupons management</Option>
            <Option value="3">Content management</Option>
            <Option value="4">Volume discounts management</Option>
            <Option value="5">Vendor</Option>
            <Option value="6">View order reports</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Membership"
          label={<label style={{ color: "#fff" }}>Membership</label>}
        >
          <Select onChange={(value: any) => { setMembershipId(value);setLeave(true) }} defaultValue="" style={{ width: '660px' }} >
            <Option value="">Ignore Membership</Option>
            <Option value="4">General</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reqirePassword"
          label={<label style={{ color: "#fff" }}>Require to change password on next<br />log in</label>}
        >
          <Checkbox onChange={(event: any) => {
            setLeave(true);
            if (event.target.checked === true) {
              setChangePassword('1');
            }
            else if (event.target.checked === false) {
              setChangePassword('0');
            }
          }} />
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h5 className="mt-3 mb-3 text-white">Tax information</h5>

        <Form.Item
          name="taxExempt"
          label={<label style={{ color: "#fff" }}>Tax Exempt</label>}
        >
          <Checkbox onChange={(event: any) => {
            setLeave(true)
            if (event.target.checked === true) {
              setTaxExempt('1');
            }
            else if (event.target.checked === false) {
              setTaxExempt('0');
            }
          }} />
        </Form.Item>

        <Form.Item >
          <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
            <button disabled={setDisable()} style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
              Create Account
            </button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
