import { DatePicker, Input, Radio, Select } from 'antd'
import React, { useState } from 'react'

const { Option } = Select;

const { RangePicker } = DatePicker;

export default function UserListContent() {

  let [display, setDisplay] = useState('none');

  return (
    <div>
      <h2 className="text-white mt-2 mb-4">Search for users</h2>
      <div className="" style={{ backgroundColor: '#323259', position: 'relative', paddingLeft: '40px', padding: '20px' }}>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-5">
                <Input onChange={(event: any) => {

                }} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
              <div className="col-7">
                <Select mode="multiple" style={{ width: '100%' }} placeholder="All membership">
                  <Option value="1">Memberships</Option>
                  <Option value="2">Pending Memberships</Option>
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
                <Select style={{ width: '100%' }} placeholder="Any Status" >
                  <Option value="1">Any Status</Option>
                  <Option value="1">Memberships</Option>
                  <Option value="2">Pending Memberships</Option>
                </Select>
              </div>
              <div className="col-2">
                <button className="btn text-white" style={{ backgroundColor: '#b18aff' }}>Search</button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row mt-3 align-items-center" style={{display: `${display}`}}>
          <div className="col-6">
            <div className="row align-items-center">
              <div className="col-3 text-white">Country</div>
              <div className="col-9">
                <Select style={{ width: '100%' }} placeholder="Any Status" >
                  <Option value="1">Any Status</Option>
                  <Option value="1">Memberships</Option>
                  <Option value="2">Pending Memberships</Option>
                </Select>
              </div>
            </div>
            <div className="row mt-3  align-items-center">
              <div className="col-3 text-white">State</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-3 text-white">Address</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-3 text-white">Phone</div>
              <div className="col-9">
                <Input onChange={(event: any) => {

                }} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
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
              <RangePicker />
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
    </div>
  )
}
