import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../configs/routes'
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
} from 'antd';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import Cookies from 'js-cookie';
import TextArea from 'antd/lib/input/TextArea';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },

};

const { Option } = Select;

export default function AddProductContent(props: any) {

  const config = {
    headers: { Authorization: Cookies.get('token') as string },
  };

  const navigate = useNavigate()

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  let [display, setDisplay] = useState('none');

  let [brandList, setBrandList] = useState([]);

  let [vendorList, setVendorList] = useState([]);

  let [categoryList, setCategoryList] = useState([]);

  let [countryList, setCountryList] = useState([]);

  const onChange = (result: any) => {
    setFileList(result.fileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src) as any;
    imgWindow.document.write(image.outerHTML);
  };


  let [stock, setStock] = useState('');

  let [price, setPrice] = useState('');

  let [priceSale, setPriceSale] = useState('');

  let [continentalUS, setContinentalUS] = useState('');

  let [general,setGeneral] = useState('');

  const getBrandList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list', config);
    promise.then((results) => {
      setBrandList(results.data.data);
    })
  }

  const getVendorList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list', config);
    promise.then((results) => {
      setVendorList(results.data.data);
    })
  }

  const getCategoryList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/api/categories/list');
    promise.then((results) => {
      setCategoryList(results.data.data);
    })
  }

  const getCountryList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country', config);
    promise.then((result) => {
      setCountryList(result.data.data);
    })
  }

  useEffect(() => {
    getBrandList();
    getVendorList();
    getCategoryList();
    getCountryList();
  }, [])


  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="text-white">
      <div className="row">
        <button onClick={() => {
          navigate(ROUTES.product);
        }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3"><i className="fa-solid fa-arrow-left"></i></button>
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '80%' }}
      >
        <h3 className="mt-3 mb-3 text-white">Add Product</h3>
        <Form.Item
          name="vendor"
          label={<label style={{ color: "#fff" }}>Vendor</label>}
          rules={[
            {
              required: true,
              message: 'Please input your Vendor !',
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '660px' }}
            placeholder="select vendor name"
          >
            {vendorList.map((vendor: any, index: any) => {
              return <Option key={index} value={vendor.id}>{vendor.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="Product title"
          label={<label style={{ color: "#fff" }}>Product title</label>}
          rules={[
            {
              required: true,
              message: 'Please input your product title !',
            },
          ]}
        >
          <Input style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          style={{ color: '#fff' }}
          name="brand"
          label={<label style={{ color: "#fff" }}>Brand</label>}
          rules={[
            {
              required: true,
              message: 'Please select type brand !',
            },
          ]}
        >
          <Select style={{ width: '660px' }} placeholder="select brand name">
            {brandList.map((brand: any, index: any) => {
              return <Option key={index} value={brand.id}>{brand.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="condition"
          label={<label style={{ color: "#fff" }}>Condition</label>}
          rules={[{ required: true, message: 'Please select condition !' }]}
        >
          <Select style={{ width: '660px' }} placeholder="select condition">
            <Option value="used">Used</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="sku"
          label={<label style={{ color: "#fff" }}>SKU</label>}
          rules={[{ required: true, message: 'Please input sku !' }]}
        >
          <Input style={{ width: '660px' }} />

        </Form.Item>

        <Form.Item
          name="images"
          label={<label style={{ color: "#fff" }}>Images</label>}
          rules={[{ required: true, message: 'Please input images !' }]}
        >

          <ImgCrop rotate>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList as []}
              onChange={onChange}
              onPreview={onPreview}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '50px' }}></i>
            </Upload>
          </ImgCrop>

        </Form.Item>

        <Form.Item
          name="category"
          label={<label style={{ color: "#fff" }}>Category</label>}
          rules={[{ required: true, message: 'Please select category !' }]}
        >
          <Select mode="tags" style={{ width: '660px' }} placeholder="Type categories name to select">
            {categoryList.map((category: any, index: any) => {
              return <Option key={index} value={category.id}>{category.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label={<label style={{ color: "#fff" }}>Description</label>}
          rules={[{ required: true, message: 'Please enter description !' }]}
        >
          <TextArea placeholder="Enter text here" style={{ height: 120, width: '660px' }} />
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Available for sale</label>}
        >
          <Switch checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Prices & Inventory</h3>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Memberships</label>}
          name="membership"
        >
          <Select defaultValue={general} style={{ width: '300px' }}>
            <Option><Checkbox onChange={(event: any)=>{
              if(event.target.checked === true) {
                setGeneral('General');
              }
              else if(event.target.checked === false) {
                setGeneral('');
              }
            }}>General</Checkbox></Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Price</label>}
          rules={[{ required: true, message: 'Please input price !' }]}
          name="price"
        >
          <div className="row align-items-center">
            <Input onChange={(event: any) => {
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                setPrice(value);
              }
            }} style={{ width: '150px',marginLeft:'16px' }} placeholder="Input a number" value={price} addonAfter="$" />

            <Checkbox onChange={(event: any) => {
              if (event.target.checked === true) {
                setDisplay('inline-block');
              }
              else if (event.target.checked === false) {
                setDisplay('none');
              }
            }} className="ml-5 mr-5 text-white">Sale</Checkbox>

            <Input onChange={(event: any) => {
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                setPriceSale(value);
              }
            }} value={priceSale} style={{ display: `${display}`, width: '250px' }} placeholder="Input a number" addonBefore={<Select defaultValue="USD" style={{ width: 60 }}>
              <Option value="USD">$</Option>
              <Option value="EUR">%</Option>
            </Select>} />

          </div>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Arrival date</label>}
          name="arrivalDate"
        >
          <div className="row ml-1 align-items-center">
            <div className="mr-2" style={{ padding: '5px 20px 5px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
              <i className="fa-solid fa-calendar" style={{ color: 'rgba(180,180,219,.48)' }}></i>
            </div>
            <DatePicker />
          </div>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Quantity in stock</label>}
          rules={[{ required: true, message: 'Please input quantity stock !' }]}
          name="stocks"
        >
          <div className="row align-items-center">
            <Input onChange={(event: any) => {
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                setStock(value);
              }
            }} style={{ width: '150px',marginLeft:'16px' }} placeholder="Input a number" value={stock} addonAfter="$" />

            

          </div>
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Shipping</h3>
        <Form.Item
          label={<label style={{ color: "#fff" }}>Continental U.S</label>}
          rules={[
            {
              required: true,
              message: 'This field is required !',
            },
          ]}
          name="continental"
        >
          <div className="row align-items-center">
            <Input onChange={(event: any) => {
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                setContinentalUS(value);
              }
            }} style={{ width: '150px',marginLeft:'16px' }} placeholder="Input a number" value={continentalUS} addonAfter="$" />
          </div>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Add Shipping Location</label>}
          name="location"
        >
          <Select style={{ width: '300px' }} placeholder="Select new zone">
            {countryList.map((country: any, index: any) => {
              return <Option key={index}>{country.country}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item >
          <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: '81%', backgroundColor: '#323259', zIndex: '2000', bottom: '0', left: '264px' }}>
            <button style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
              Add Product
            </button>
          </div>
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Marketing</h3>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Open Graph meta tags</label>}
        >
          <Select style={{ width: '300px' }} defaultValue="Autogenerated">
            <Option>Autogenerated</Option>
            <Option>Custom</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Meta description</label>}
        >
          <Select style={{ width: '300px' }} defaultValue="Autogenerated">
            <Option>Autogenerated</Option>
            <Option>Custom</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Meta keywords</label>}
        >
          <Input style={{ width: '300px' }} />
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Product page title</label>}
        >
          <Input style={{ width: '300px' }} />
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Add to Facebook product feed</label>}
        >
          <Switch checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Add to Google product feed</label>}
        >
          <Switch checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>
      </Form>


    </div>
  )
}
