import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';
import moment from 'moment';
import { Checkbox, Form, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ButtonConfirmLeaveAddUser from '../ButtonConfirm/ButtonConfirmLeaveAddUser';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },

};

const { Option } = Select;

export default function UserDetailContent() {

  const regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: Cookies.get('token') as string },
  };

  const { id } = useParams();

  let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

  const renderWidth = () => {
    if (collapsed === true) {
      return '81%'
    }
    if (collapsed === false) {
      return '92%'
    }
  }

  let [leave, setLeave] = useState(false);

  let [loading, setLoading] = useState(false);

  let [userDetail, setUserDetail] = useState({ info: {} } as any);

  let [level, setLevel] = useState('10');

  let [displayRole, setDisplayRole] = useState('none');

  let [role, setRole] = useState([] as any);

  let [status, setStatus] = useState("" as any);

  let [firstName, setFirstName] = useState('');

  let [lastName, setLastName] = useState('');

  let [email, setEmail] = useState('');

  let [password, setPassword] = useState('');

  let [passwordConfirm, setPasswordConfirm] = useState('')

  let [changePassword, setChangePassword] = useState(0);

  let [taxExempt, setTaxExempt] = useState(0);

  let [comment, setComment] = useState('');

  let [membership, setMembership] = useState('');

  let [emailError, setEmailError] = useState('');

  let [firstNameError, setFirstNameError] = useState('');

  let [lastNameError, setLastNameError] = useState('');

  const getUserDetail = () => {
    setLoading(true);
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiVendor/profile/detail', {
      id: id
    }, config)
    promise.then((result) => {
      if (result.data.success === true) {
        console.log(result.data.data);
        setUserDetail(result.data.data);
        setFirstName(result.data.data.info.firstName);
        setLastName(result.data.data.info.lastName);
        setEmail(result.data.data.info.email);
        setLevel(result.data.data.info.access_level);
        if (result.data.data.info.access_level === '100') {
          setDisplayRole('flex');
        }
        else if (result.data.data.info.access_level === '10') {
          setDisplayRole('none');
        }
        setRole(result.data.data.info.roles);
        setStatus(result.data.data.info.status);
        setComment(result.data.data.info.statusComment);
        setChangePassword(parseInt(result.data.data.info.forceChangePassword));
        setTaxExempt(parseInt(result.data.data.info.taxExempt));
        setLoading(false);
      }
    })
  }

  const onFinish = (values: any) => {
    setLoading(true);
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit', {
      params: [
        {
          confirm_password: passwordConfirm,
          email: email,
          firstName: firstName,
          forceChangePassword: changePassword,
          id: id,
          lastName: lastName,
          membership_id: membership,
          password: password,
          roles: role,
          status: status,
          statusComment: comment,
          taxExempt: taxExempt,
        }
      ]
    }, config);

    promise.then((result) => {
      if (result.data.success === true) {
        setLoading(false);
        Swal.fire(
          'Update User Success !',
          '',
          'success'
        )

        getUserDetail();
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
        'Update Product Fail !',
        '',
        'error'
      )
    })
  }

  const setDisable = () => {
    if (firstName !== '' && lastName !== '' && email !== '') {
      return false
    }
    else if (firstName === '' || lastName === '' || email === '') {
      return true
    }
  }

  useEffect(() => {
    getUserDetail()
  }, [])

  if (loading === true) {
    return <div style={{ display: 'block', backgroundColor: '#888', opacity: '0.5' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
      <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
        <Spinner animation="border" style={{ color: "white" }} />
      </div>
    </div>
  }
  else if (loading === false) {
    return (
      <div>
        <div className="row">
          {leave === false ? <button onClick={() => {
            navigate(ROUTES.userList);
          }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3"><i className="fa-solid fa-arrow-left"></i></button> : ''}
          {leave === true ? <button onClick={() => {
            dispatch({
              type: 'change_modal',
              title: 'Confirm Leave Page',
              content: 'Do you want to leave page ?',
              button: <ButtonConfirmLeaveAddUser />
            })
          }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3" data-toggle="modal" data-target="#modelId"><i className="fa-solid fa-arrow-left"></i></button> : ''}
        </div>
        <h3 className="mt-3 mb-3 text-white">{userDetail.info.email} ( {userDetail.info.companyName} )</h3>
        <div className="text-white">
          <table className="table text-white" style={{ width: '50%' }}>
            <tbody>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Orders placed as a buyer</th>
                <td style={{ borderTop: 'none' }}>{userDetail.info.order_as_buyer} (${userDetail.info.order_as_buyer_total})</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Vendor Income</th>
                <td style={{ borderTop: 'none' }}>${userDetail.info.income}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Vendor Expense</th>
                <td style={{ borderTop: 'none' }}>${userDetail.info.expense}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Earning balance</th>
                <td style={{ borderTop: 'none' }}>${userDetail.info.earning}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Products listed as vendor</th>
                <td style={{ borderTop: 'none' }}>{userDetail.info.products_total}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Joined</th>
                <td style={{ borderTop: 'none' }}>{moment(parseInt(userDetail.info.joined) * 1000).format('MMM D, YYYY, h:mm A')}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Last login</th>
                <td style={{ borderTop: 'none' }}>{moment(parseInt(userDetail.info.last_login) * 1000).format('MMM D, YYYY, h:mm A')}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Language</th>
                <td style={{ borderTop: 'none' }}>{userDetail.info.language}</td>
              </tr>
              <tr>
                <th style={{ float: 'right', borderTop: 'none' }}>Referer</th>
                <td style={{ borderTop: 'none' }}>{userDetail.info.referer}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Email & password</h3>

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          style={{ width: '80%' }}
        >
          <Form.Item
            name="firstName"
            label={<label style={{ color: "#fff" }}>First Name <span className="text-danger">*</span></label>}

          >
            <div>
              <input value={firstName} onChange={(event: any) => {
                setLeave(true);
                setFirstName(event.target.value);
                if (event.target.value === '') {
                  setFirstNameError('First Name is required !');
                }
                else if (event.target.value !== '') {
                  setFirstNameError('');
                }
              }} className="ant-input bg-main" style={{ width: '660px' }} />
            </div>
            <p className="text-danger">{firstNameError}</p>
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<label style={{ color: "#fff" }}>Last Name <span className="text-danger">*</span></label>}

          >
            <div>
              <input value={lastName} onChange={(event: any) => {
                setLeave(true);
                setLastName(event.target.value)
                if (event.target.value === '') {
                  setLastNameError('Last Name is required !');
                }
                else if (event.target.value !== '') {
                  setLastNameError('');
                }
              }} className="ant-input bg-main" style={{ width: '660px' }} />
            </div>
            <p className="text-danger">{lastNameError}</p>
          </Form.Item>

          <Form.Item
            name="email"
            label={<label style={{ color: "#fff" }}>Email <span className="text-danger">*</span></label>}

          >
            <div>
              <input value={email} onChange={(event: any) => {
                setLeave(true);
                setEmail(event.target.value)
                if (event.target.value.match(regax)) {
                  setEmailError('');
                }
                else {
                  setEmailError('Email is not a valid !')
                }
              }} className="ant-input bg-main" style={{ width: '660px' }} />
            </div>

            <p className="text-danger">{emailError}</p>
          </Form.Item>

          <Form.Item
            name="password"
            label={<label style={{ color: "#fff" }}>Password</label>}

          >
            <input onChange={(event: any) => { setPassword(event.target.value); setLeave(true); }} id="register_password" className="ant-input bg-main" type="password" style={{ width: '660px' }} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={<label style={{ color: "#fff" }}>Confirm Password</label>}
            dependencies={['password']}
            hasFeedback
            rules={[

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
            <input onChange={(event: any) => { setPasswordConfirm(event.target.value); setLeave(true); }} id="register_password" className="ant-input bg-main" type="password" style={{ width: '660px' }} />
          </Form.Item>

          <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
          <h3 className="mt-3 mb-3 text-white">Access information</h3>

          <Form.Item
            name="accessLevel"
            label={<label style={{ color: "#fff" }}>Access Level</label>}
          >
            <p className="text-white mt-1">{level === '10' ? 'Vendor' : 'Admin'}</p>
          </Form.Item>

          <Form.Item
            style={{ display: `${displayRole}` }}
            name="role"
            label={<label style={{ color: "#fff" }}>Roles</label>}
          >
            <Select onChange={(value: any) => {
              setLeave(true);
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
            name="status"
            label={<label style={{ color: "#fff" }}>Account Status</label>}
          >
            <Select onChange={(value: any) => {
              setLeave(true);
              setStatus(value);
            }} style={{ width: '660px' }} defaultValue={status} >
              <Option value="E">Enable</Option>
              <Option value="D">Disable</Option>
              <Option value="U">Unapproved vendor</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label={<label style={{ color: "#fff" }}>Status comment ( reason )</label>}
          >
            <div>
              <TextArea value={comment} onChange={(event: any) => {
                setLeave(true);
                setComment(event.target.value)
              }} style={{ height: 120 }} />
            </div>
          </Form.Item>

          <Form.Item
            name="memberships"
            label={<label style={{ color: "#fff" }}>Memberships</label>}
          >
            <Select onChange={(value: any) => {
              setLeave(true);
              setMembership(value);
            }} style={{ width: '660px' }} defaultValue="">
              <Option value="">Ignore Memberships</Option>
              <Option value="4">General</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reqirePassword"
            label={<label style={{ color: "#fff" }}>Require to change password on next<br />log in</label>}
          >
            <Checkbox defaultChecked={changePassword === 1} onChange={(event: any) => {
              setLeave(true);
              if (event.target.checked === true) {
                setChangePassword(1);
              }
              else if (event.target.checked === false) {
                setChangePassword(0);
              }
            }} />
          </Form.Item>

          <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
          <h5 className="mt-3 mb-3 text-white">Tax information</h5>

          <Form.Item
            name="taxExempt"
            label={<label style={{ color: "#fff" }}>Tax Exempt</label>}
          >
            <Checkbox defaultChecked={taxExempt === 1} onChange={(event: any) => {
              setLeave(true);
              if (event.target.checked === true) {
                setTaxExempt(1);
              }
              else if (event.target.checked === false) {
                setTaxExempt(0);
              }
            }} />
          </Form.Item>

          <Form.Item >
            <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
              <button disabled={setDisable()} style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
                Update Account
              </button>
            </div>
          </Form.Item>
        </Form>

      </div>
    )
  }
  return <div className=""></div>

}
