import { Checkbox, DatePicker, Input, Pagination, Radio, Select } from 'antd'
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';
import ButtonConfirmDeleteUser from '../ButtonConfirm/ButtonConfirmDeleteUser';
import ButtonConfirmRemoveSelectUser from '../ButtonConfirm/ButtonConfirmRemoveSelectUser';

const { Option } = Select;

const { RangePicker } = DatePicker;

export default function UserListContent() {

  let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

  let [loading, setLoading] = useState(false);

  let [userList, setUserList] = useState([] as any);

  const renderWidth = () => {
    if (collapsed === true) {
      return '79%'
    }
    if (collapsed === false) {
      return '90%'
    }
  }


  const dispatch = useDispatch();

  const navigate = useNavigate();

  const config = {
    headers: { Authorization: Cookies.get('token') as string },
  };

  let [display, setDisplay] = useState('none');

  let [params, setParams] = useState([] as any);

  let [disabled, setDisabled] = useState(true);

  let [page, setPage] = useState(1);

  let [count, setCount] = useState(25);

  let [order, setOrder] = useState('ASC');

  let [sort, setSort] = useState('vendor');

  let [search, setSearch] = useState('');

  let [memberships,setMemberships] = useState([] as any);

  let [status, setStatus] = useState([] as any);

  useEffect(() => {
    if (params.length === 0) {
      setDisabled(true);
    }
    else if (params.length > 0) {
      setDisabled(false);
    }
  }, [params]);

  const getUserList = () => {
    setLoading(true);
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list', {
      address: "",
      count: 25,
      country: "",
      date_range: [],
      date_type: "R",
      memberships: memberships,
      order_by: "ASC",
      page: 1,
      phone: "",
      search: search,
      sort: 'vendor',
      state: "",
      status: status,
      types: [],
      tz: 7,
    }, config)
    promise.then((result) => {
      setLoading(false);
      if (result.data.success === true) {
        if (result.data.data === false) {
          setUserList([]);
        }
        else {
          console.log(result.data.data);
          setUserList(result.data.data);
        }
      }
      else if (result.data.success === false) {

      }
    })
  }

  const getUserList2 = (sort: any) => {
    setLoading(true);
    if (order === 'ASC') {
      setOrder('DESC');
    }
    else if (order === 'DESC') {
      setOrder('ASC');
    }
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list', {
      address: "",
      count: count,
      country: "",
      date_range: [],
      date_type: "R",
      memberships: memberships,
      order_by: order,
      page: page,
      phone: "",
      search: search,
      sort: sort,
      state: "",
      status: status,
      types: [],
      tz: 7,
    }, config)
    promise.then((result) => {
      setLoading(false);
      if (result.data.success === true) {
        if (result.data.data === false) {
          setUserList([]);
        }
        else {
          console.log(result.data.data);
          setUserList(result.data.data);
        }
      }
      else if (result.data.success === false) {

      }
    })
  }

  const renderArrow = (name: string) => {
    if (order === 'ASC' && name === sort) {
      return <i className="fa-solid fa-arrow-down"></i>
    }
    else if (order === 'DESC' && name === sort) {
      return <i className="fa-solid fa-arrow-up"></i>
    }
    else {
      return
    }
  }

  useEffect(() => {
    getUserList2('vendor');
  }, [])

  return (
    <div>
      {loading === true ? <div style={{ display: 'block', backgroundColor: '#888', opacity: '0.5' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
        <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
          <Spinner animation="border" style={{ color: "white" }} />
        </div>
      </div> : ''}
      <h2 className="text-white mt-2 mb-4">Search for users</h2>
      <div className="" style={{ backgroundColor: '#323259', position: 'relative', paddingLeft: '40px', padding: '20px' }}>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-5">
                <Input onChange={(event: any) => {
                  setSearch(event.target.value);
                }} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
              <div className="col-7">
                <Select onChange={(value: any)=>{
                  setMemberships(value);
                }} mode="multiple" style={{ width: '100%' }} placeholder="All membership">
                  <Option value="P_4">Memberships</Option>
                  <Option value="M_4">Pending Memberships</Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-6">
                <Select mode="multiple" style={{ width: '100%' }} placeholder="All User Type">
                  <Option value="1">Memberships</Option>
                  <Option value="2">Pending Memberships</Option>
                </Select>
              </div>
              <div className="col-4">
                <Select onChange={(value: any)=>{
                  if(value === ""){
                    setStatus([])
                  }
                  else{
                    setStatus([value]);
                  }
                }} style={{ width: '100%' }} placeholder="Any Status" >
                  <Option value="">Any Status</Option>
                  <Option value="E">Enable</Option>
                  <Option value="D">Disable</Option>
                  <Option value="U">Unapproved vendor</Option>
                </Select>
              </div>
              <div className="col-2">
                <button onClick={()=>{getUserList()}} className="btn text-white" style={{ backgroundColor: '#b18aff' }}>Search</button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row mt-3 align-items-center" style={{ display: `${display}` }}>
          <div className="col-6">
            <div className="row align-items-center">
              <div className="col-3 text-white">Country</div>
              <div className="col-9">
                <Select style={{ width: '100%' }} placeholder="Any Status" >
                  <Option value="1">Any Status</Option>
                  <Option value="2">Memberships</Option>
                  <Option value="3">Pending Memberships</Option>
                </Select>
              </div>
            </div>
            <div className="row mt-3  align-items-center">
              <div className="col-3 text-white">State</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-3 text-white">Address</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-3 text-white">Phone</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-6 text-white">
                User Activity
              </div>
              <div className="col-6">
                <Radio.Group>
                  <Radio style={{ color: '#fff' }} value={1}>Register</Radio>
                  <Radio style={{ color: '#fff' }} value={2}>Last logged in</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="row mt-4">
              <RangePicker style={{ marginLeft: '16px' }} />
            </div>
          </div>
        </div>
      </div>
      {display === 'flex' ? <div onClick={() => {
        setDisplay('none');
      }} className="row" style={{ width: '3%', margin: 'auto', backgroundColor: 'rgb(50, 50, 89)', padding: '4px 12px 4px 12px', cursor: 'pointer', borderRadius: '0 0 10px 10px' }}>
        <i className="fa-solid fa-arrow-up text-white"></i>
      </div> : ''}

      {display === 'none' ? <div onClick={() => {
        setDisplay('flex');
      }} className="row" style={{ width: '3%', margin: 'auto', backgroundColor: 'rgb(50, 50, 89)', padding: ' 4px 12px 4px 12px', cursor: 'pointer', borderRadius: '0 0 10px 10px' }}>
        <i className="fa-solid fa-arrow-down text-white"></i>
      </div> : ''}
      <div className="row mt-3 mb-3">
        <button onClick={() => { navigate(ROUTES.addUser) }} className="btn ml-3 text-white" style={{ backgroundColor: '#b18aff' }}>Add User</button>
      </div>
      <div className="p-3" style={{ backgroundColor: '#323259', marginBottom: '50px' }}>
        <table className="table text-white">
          <thead>
            <tr>
              <th><Checkbox checked={params.length === userList.length} onChange={(event: any) => {
                if (event.target.checked === true) {
                  setDisabled(false);
                  let params3 = [];
                  for (let i = 0; i < userList.length; i++) {
                    let data = {
                      "id": userList[i].profile_id,
                      "delete": 1
                    }
                    params3.push(data);
                  }
                  setParams(params3);
                }
                else if (event.target.checked === false) {
                  setDisabled(true);
                  setParams([]);
                }
              }} /></th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                getUserList2('vendor');
                setSort('vendor');
              }}>Login/Email {renderArrow('vendor')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                getUserList2('fistName');
                setSort('fistName');
              }}>Name {renderArrow('fistName')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                getUserList2('access_level');
                setSort('access_level');
              }}>Access level {renderArrow('access_level')}</th>
              <th>Product</th>
              <th>Orders</th>
              <th>Wishlist</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                getUserList2('created');
                setSort('created');
              }}>Created {renderArrow('created')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                getUserList2('last_login');
                setSort('last_login');
              }}>Last Login {renderArrow('last_login')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user: any, index: any) => {
              return <tr key={index}>
                <td><Checkbox checked={params.findIndex((item: any) => item.id === user.profile_id) !== -1} onChange={(event: any) => {
                  if (event.target.checked === true) {
                    let data = {
                      "id": user.profile_id,
                      "delete": 1
                    } as Object
                    setParams([...params, data]);
                  }
                  else if (event.target.checked === false) {
                    let params2 = [...params]
                    let index = params2.findIndex((item: any) => item.id === user.profile_id);
                    if (index !== -1) {
                      params2.splice(index, 1);
                      setParams(params2);
                    }
                  }
                }} /></td>
                <td>{user.vendor.substr(0, 12)}...</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.access_level}</td>
                <td>{user.product}</td>
                <td>{user.order.order_as_buyer}</td>
                <td>{user.wishlist}</td>
                <td>{moment(parseInt(user.created) * 1000).format('MMM D, YYYY, h:mm A')}</td>
                <td>{moment(parseInt(user.last_login) * 1000).format('MMM D, YYYY, h:mm A')}</td>
                <td>{<button onClick={() => {
                  dispatch({
                    type: 'change_modal',
                    title: 'Confirm Delete',
                    content: 'Do you want to delete this user ?',
                    button: <ButtonConfirmDeleteUser id={user.profile_id} getUserList={getUserList} />
                  })
                }} className="btn text-white" style={{ backgroundColor: '#b18aff' }} data-toggle="modal" data-target="#modelId"><i className="fa-solid fa-trash"></i></button>}</td>
              </tr>
            })}

          </tbody>
        </table>
        <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
          <button disabled={disabled} onClick={() => {
            dispatch({
              type: 'change_modal',
              title: 'Confirm Delete',
              content: 'Do you want to delete all users sellected ?',
              button: <ButtonConfirmRemoveSelectUser getUserList={getUserList} params={params} />
            })
            setParams([])
          }} className="btn text-white" style={{ backgroundColor: '#f0ad4e' }} data-toggle="modal" data-target="#modelId">Remove Selected</button>
        </div>
        <div className="mt-4">
          <Pagination onChange={(page, pageSize) => {
            setLoading(true);
            setPage(page);
            setCount(pageSize);
            let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list', {
              address: "",
              count: pageSize,
              country: "",
              date_range: [],
              date_type: "R",
              memberships: [],
              order_by: "DESC",
              page: page,
              phone: "",
              search: "",
              sort: "last_login",
              state: "",
              status: [],
              types: [],
              tz: 7,
            }, config)
            promise.then((results) => {
              if (results.data.data === false) {
                setUserList([]);
              }
              else {
                setUserList(results.data.data);
              }
              console.log(results.data.data);
              setLoading(false);
            })
          }} defaultCurrent={1} defaultPageSize={25} total={3000} />
        </div>
      </div>
    </div>
  )
}
