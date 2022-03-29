import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../configs/routes'
import React, { useEffect, useRef, useState } from 'react';
import {
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Menu,
  Select,
  Switch,
} from 'antd';

import { Upload } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import TextArea from 'antd/lib/input/TextArea';
import { Spinner } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import ButtonConfirmLeaveAddProduct from '../ButtonConfirm/ButtonConfirmLeaveAddProduct';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },

};

const { Option } = Select;

export default function AddProductContent(props: any) {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

  const renderWidth = () => {
    if (collapsed === true) {
      return '81%'
    }
    if (collapsed === false) {
      return '92%'
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Checkbox onChange={(event: any) => {
          setLeave(true);
          if (event.target.checked === true) {
            setMembership([4])
            setGeneral('General');
          }
          else if (event.target.checked === false) {
            setGeneral('');
            setMembership([]);
          }
        }}>General</Checkbox>
      </Menu.Item>
    </Menu>
  );

  const editorRef = useRef(null as any);

  const config = {
    headers: { Authorization: Cookies.get('token') as string },
  };

  const [form] = Form.useForm();

  let [display,setDisplay] = useState('block');

  let [fileList, setFileList] = useState([{ name: '', uid: '', originFileObj: {} as Blob }]);

  let [brandList, setBrandList] = useState([]);

  let [vendorList, setVendorList] = useState([]);

  let [categoryList, setCategoryList] = useState([]);

  let [countryList, setCountryList] = useState([]);

  const onChange = (result: any) => {
    setLeave(true);
    console.log(result);
    setFileList(result.fileList);
    if (result.fileList.length > 0) {
      setImageError('');
    }
    else if (result.fileList.length === 0) {
      setImageError('Images is required !');
    }
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

  let [leave, setLeave] = useState(false);

  let [loading, setLoading] = useState(false);

  let [vendor, setVendor] = useState('');

  let [productTitle, setProductTitle] = useState('');

  let [productPageTitle, setProductPageTitle] = useState('');

  let [brand, setBrand] = useState('');

  let [sku, setSku] = useState(Date.now().toString());

  let [enabled, setEnabled] = useState(0);

  let [arrivalDate, setArrivalDate] = useState('');

  let [faceBookFeed, setFaceBookFeed] = useState(0);

  let [googleFeed, setGoogleFeed] = useState(0);

  let [metaKeyWord, setMetaKeyWord] = useState('');

  let [category, setCategory] = useState([] as Array<string>);

  let [ogTagType, setOgTagType] = useState('0');

  let [ogTag, setOgTag] = useState('');

  let [description, setDescription] = useState('');

  let [displayOgTag, setDisplayOgTag] = useState('none');

  let [displayMetaDescription, setDisplayMetaDescription] = useState('none');

  let [metaDescriptionType, setMetaDescriptionType] = useState('A');

  let [metaDescription, setMetaDescription] = useState('');

  let [priceSaleType, setPriceSaleType] = useState('$');

  let [stock, setStock] = useState('');

  let [price, setPrice] = useState('');

  let [priceSale, setPriceSale] = useState('');

  let [continentalUS, setContinentalUS] = useState('');

  let [general, setGeneral] = useState('');

  let [taxExempt, setTaxExempt] = useState(0);

  let [membership, setMembership] = useState([] as Array<number>);

  let [condition, setCondition] = useState("262");

  let [imgError, setImageError] = useState('');

  let [descError, setDescError] = useState('');

  let [dateError, setDateError] = useState('');

  let [priceSaleError, setPriceSaleError] = useState('');

  let [skuError, setSkuError] = useState('');

  let [priceSaleValidate,setPriceSaleValidate] = useState('');

  const getBrandList = () => {
    setLoading(true);
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list', config);
    promise.then((results) => {
      setBrandList(results.data.data);
      setLoading(false);
    })
  }

  const getVendorList = () => {
    setLoading(true);
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list', config);
    promise.then((results) => {
      setVendorList(results.data.data);
      setLoading(false);
    })
  }

  const getCategoryList = () => {
    setLoading(true);
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/api/categories/list');
    promise.then((results) => {
      setCategoryList(results.data.data);
      setLoading(false);
    })
  }

  const getCountryList = () => {
    setLoading(true);
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country', config);
    promise.then((result) => {
      setCountryList(result.data.data);
      setLoading(false);
    })
  }

  useEffect(() => {
    // setFileList([]);
    getBrandList();
    getVendorList();
    getCategoryList();
    getCountryList();
  }, [])

  const setDisable = () => {
    if (vendor.trim() !== '' && productTitle.trim() !== "" && brand !== '' && sku.trim() !== '' && fileList.length > 0 && category.length > 0 && price !== '' && stock !== '' && continentalUS !== '' && dateError === '' && priceSale !== '' && priceSaleError === '' && skuError === '' && description !== '') {
      return false;
    }
    else if (vendor.trim() === '' || productTitle.trim() === "" || brand === '' || sku.trim() === '' || fileList.length === 0 || category.length === 0 || price === '' || stock === '' || continentalUS === '' || dateError !== '' || priceSale === '' || priceSaleError !== '' || skuError !== '' || description === '') {
      return true;
    }
  }

  const onFinish = (values: any) => {
    setLoading(true);
    let img = [];
    for (var i = 0; i < fileList.length; i++) {
      img.push(fileList[i].name);
    }
    let bodyFormData = new FormData();
    bodyFormData.append('productDetail', JSON.stringify({
      "vendor_id": vendor,
      "name": productTitle,
      "brand_id": brand,
      "condition_id": condition,
      "categories": category,
      "description": description,
      "enabled": enabled,
      "memberships": membership,
      "shipping_to_zones": [{ id: "1", price: continentalUS }],
      "tax_exempt": taxExempt,
      "price": price,
      "sale_price_type": priceSaleType,
      "arrival_date": arrivalDate,
      "inventory_tracking": 0,
      "quantity": stock,
      "sku": sku,
      "participate_sale": 0,
      "sale_price": priceSale,
      "og_tags_type": ogTagType,
      "og_tags": ogTag,
      "meta_desc_type": metaDescriptionType,
      "meta_description": metaDescription,
      "meta_keywords": metaKeyWord,
      "product_page_title": productPageTitle,
      "facebook_marketing_enabled": faceBookFeed,
      "google_feed_enabled": googleFeed,
      "imagesOrder": img,
      "deleted_images": [],
    }));
    let promise = axios({
      method: "post",
      url: "https://api.gearfocus.div4.pgtest.co/apiAdmin/products/create",
      data: bodyFormData,
      headers: config.headers,
    })

    promise.then((result) => {
      console.log(result);
      if (result.data.success === true) {
        let count = 0;
        for (let i = 0; i < fileList.length; i++) {
          let id = result.data.data;
          let bodyFormData = new FormData();
          bodyFormData.append('productId', id);
          bodyFormData.append('order', JSON.stringify(i));
          bodyFormData.append('images[]', fileList[i].originFileObj);
          let promise = axios({
            method: 'post',
            url: 'https://api.gearfocus.div4.pgtest.co/api/products/upload-image',
            data: bodyFormData,
            headers: config.headers
          })
          // eslint-disable-next-line no-loop-func
          promise.then((result) => {
            if (result.data.success === true) {
              count ++;
              if(count === fileList.length) {
                navigate(`/productDetail/${id}`);
                setLoading(false);
                Swal.fire(
                  'Create Product Success !',
                  '',
                  'success'
                )
              }
            }
            else if (result.data.success === false) {
              setLoading(false);
              Swal.fire(
                `${result.data.errors}`,
                '',
                'error'
              )
            }
          })
        }
      }
      else if (result.data.success === false) {
        setLoading(false);
        Swal.fire(
          `${result.data.errors}`,
          '',
          'error'
        )
      }
    })

    promise.catch((error) => {
      Swal.fire(
        'Create Product Fail !',
        '',
        'error'
      )
    })
  };

  return (
    <div>
      <div>
        {loading === true ? <div style={{ display: 'block', backgroundColor: '#888', opacity: '0.5',zIndex:'3000' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
          <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
            <Spinner animation="border" style={{ color: "white" }} />
          </div>
        </div> : ''}
      </div>
      <div className="row">
        {leave === false ? <button onClick={() => {
          navigate(ROUTES.product);
        }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3"><i className="fa-solid fa-arrow-left"></i></button> : ''}
        {leave === true ? <button onClick={() => {
          dispatch({
            type: 'change_modal',
            title: 'Confirm Leave Page',
            content: 'Do you want to leave page ?',
            button: <ButtonConfirmLeaveAddProduct />
          })
        }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3" data-toggle="modal" data-target="#modelId"><i className="fa-solid fa-arrow-left"></i></button> : ''}
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
            onChange={(value: any) => {
              setLeave(true);
              setVendor(value);
            }}
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
          <input onChange={(event: any) => {
            setLeave(true);
            setProductTitle(event.target.value);
          }} className="ant-input bg-main" style={{ width: '660px' }} />
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
          <Select onChange={(value: any) => {
            setLeave(true);
            setBrand(value);
          }} style={{ width: '660px' }} placeholder="select brand name">
            {brandList.map((brand: any, index: any) => {
              return <Option key={index} value={brand.id}>{brand.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="condition"
          label={<label style={{ color: "#fff" }}>Condition</label>}
        // rules={[{ required: true, message: 'Please select condition !' }]}
        >
          <Select onChange={(value: any) => {
            setLeave(true);
            setCondition(value);
          }} defaultValue={condition} style={{ width: '660px' }} placeholder="select condition">
            <Option value="262">None</Option>
            <Option value="292">Used</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="sku"
          label={<label style={{ color: "#fff" }}><span className="text-danger">*</span> SKU</label>}
        >
          <div>
            <input onChange={(event: any) => {
              setLeave(true);
              setSku(event.target.value);
              if(event.target.value.trim() === '') {
                setSkuError('SKU is required !')
              }
              else{
                setSkuError('');
              }
            }} value={sku} className="ant-input bg-main" style={{ width: '660px' }} />
          </div>
          <p className="text-danger">{skuError}</p>

        </Form.Item>

        <Form.Item
          name="images"
          label={<label style={{ color: "#fff" }}><span className="text-danger">*</span>Images</label>}
        >

          <Upload
            action="https://api.gearfocus.div4.pgtest.co/api/products/upload-image"
            listType="picture-card"
            fileList={fileList as []}
            onChange={onChange}
            onPreview={onPreview}
            multiple={true}
          >
            <i className="fa-solid fa-camera" style={{ fontSize: '50px', color: '#333' }}></i>
          </Upload>
          <p className="text-danger">{imgError}</p>

        </Form.Item>

        <Form.Item
          name="category"
          label={<label style={{ color: "#fff" }}>Category</label>}
          rules={[{ required: true, message: 'Please select category !' }]}
        >
          <Select onChange={(value: any) => {
            setLeave(true);
            setCategory(value);
          }} mode="multiple" style={{ width: '660px' }} placeholder="Type categories name to select">
            {categoryList.map((category: any, index: any) => {
              return <Option key={index} value={category.id}>{category.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label={<label style={{ color: "#fff" }}><span className="text-danger">*</span>Description</label>}
        // rules={[{ required: true, message: 'Please enter description !' }]}
        >
          <div className="row">
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue=""
              onEditorChange={(value: any) => {
                setDescription(value);
                setLeave(true);
                if (value.trim() === '') {
                  setDescError('Description is required !')
                }
                else {
                  setDescError('')
                }
              }}
              value={description}
              init={{
                height: 200,
                marginLeft: '16px',
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          <p className="text-danger">{descError}</p>
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Available for sale</label>}
        >
          <div className="row">

          </div>
          <Switch onChange={(checked: any) => {
            setLeave(true);
            if (checked === true) {
              setEnabled(1);
            }
            else if (checked === false) {
              setEnabled(0);
            }
          }} checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Prices & Inventory</h3>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Memberships</label>}
          name="membership"
        >
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="ant-dropdown-link" style={{ height: '40px', width: '400px', backgroundColor: '#252547', borderRadius: '5px', borderColor: 'rgb(19, 19, 43)' }}>
              <span className="text-white" style={{ position: 'relative', top: '8px', left: '10px' }}>
                {general}
              </span>
            </div>
          </Dropdown>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Tax Exempt</label>}
          name="taxExemp"
        >
          <Checkbox checked={taxExempt === 1} onChange={(event: any) => {
            if (event.target.checked === true) {
              setTaxExempt(1);
            }
            else if (event.target.checked === false) {
              setTaxExempt(0);
            }
          }} />
        </Form.Item>


        <Form.Item
          name="price"
          label={<label className="mr-3" style={{ color: "#fff" }}>Price</label>}
          rules={[{
            required: true,
            message: 'Please input price !'
          },
          ]
          }
        >
          <div className="row">

            <input className="ant-input bg-main ml-3" onChange={(event: any) => {
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value))) {
                setPrice(value);
              }
              if (parseFloat(value) < parseFloat(priceSale) || parseFloat(value) === parseFloat(priceSale)) {
                setPriceSaleError('Price must be greater than priceSale !');
              }
              else {
                setPriceSaleError('');
              }
            }} value={price} style={{ width: '150px' }} placeholder="Input a number" />
          </div>

        </Form.Item>
        <Form.Item
          name="priceSale"
          label={<label style={{ color: "#fff" }}><Checkbox defaultChecked={display === 'block'} className="mr-3" onChange={(event: any) =>{
            if(event.target.checked === true) {
                setDisplay('block');
            }
            else{
                setDisplay('none');
            }
        }}></Checkbox><span className="text-danger">*</span>Sale</label>}
        >
          <div style={{display: `${display}` }}>
            <Select onChange={(value: any) => {
              setLeave(true);
              setPriceSaleType(value);
              setPriceSale('');
            }} defaultValue={priceSaleType} style={{ width: '50px' }}>
              <Option value="$">$</Option>
              <Option value="%">%</Option>

            </Select>
            <input className="ant-input bg-main" onChange={(event: any) => {
              setLeave(true);
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if(value.trim() === ''){
                setPriceSaleValidate('Price Sale is required !');
              }
              else {
                setPriceSaleValidate('');
              }
              if ((!isNaN(value) && reg.test(value))) {
                setPriceSale(value);
              }
              if (priceSaleType === '$') {
                if (parseFloat(value) > parseFloat(price) || parseFloat(value) === parseFloat(price)) {
                    setPriceSaleError('Price must be greater than priceSale !')
                }
                else {
                    setPriceSaleError('')
                }
            }
            else if (priceSaleType === '%') {
                if (( parseInt(value) > 100)) {
                    setPriceSaleError('Percentage discount valid from 0 to 100 !');
                }
                else {
                    setPriceSaleError('');
                }
            }
            }} value={priceSale} style={{ width: '150px' }} placeholder="Input a number" />
          </div>
          <p className="text-danger">{priceSaleError}</p>
          <p className="text-danger">{priceSaleValidate}</p>

        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}><span className="text-danger">*</span>Arrival date</label>}
          name="arrivalDate"
        >
          <div className="row ml-1 align-items-center">
            <div className="mr-2" style={{ padding: '5px 20px 5px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
              <i className="fa-solid fa-calendar" style={{ color: 'rgba(180,180,219,.48)' }}></i>
            </div>
            <DatePicker onChange={(event: any) => {
              setLeave(true);
              if (event === null) {
                setDateError('arrivalDate is required !');
              }
              else {
                setDateError('');
              }
              setArrivalDate(moment(event._d.toLocaleDateString()).format('YYYY-DD-MM'));
            }} defaultValue={moment(new Date())} />
          </div>
          <p className="text-danger">{dateError}</p>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Quantity in stock</label>}
          rules={[{ required: true, message: 'Please input quantity stock !' }]}
          name="stocks"
        >
          <div className="row align-items-center">
            <input className="ant-input bg-main" onChange={(event: any) => {
              setLeave(true);
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value))) {
                setStock(value);
              }
            }} style={{ width: '150px', marginLeft: '16px' }} placeholder="Input a number" value={stock} />



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
            <input className="ant-input bg-main" onChange={(event: any) => {
              setLeave(true);
              const { value } = event.target;
              const reg = /^-?\d*(\.\d*)?$/;
              if ((!isNaN(value) && reg.test(value))) {
                setContinentalUS(value);
              }
            }} style={{ width: '150px', marginLeft: '16px' }} placeholder="Input a number" value={continentalUS} />
          </div>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Add Shipping Location</label>}
          name="location"
        >
          <Select onChange={() => {
            setLeave(true);
          }} style={{ width: '300px' }} placeholder="Select new zone">
            {countryList.map((country: any, index: any) => {
              return <Option key={index}>{country.country}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item >
          <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
            <button disabled={setDisable()} style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
              Add Product
            </button>
          </div>
        </Form.Item>

        <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
        <h3 className="mt-3 mb-3 text-white">Marketing</h3>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Open Graph meta tags</label>}
        >
          <Select onChange={(value: any) => {
            setOgTagType(value);
            if (value === "0") {
              setDisplayOgTag('none');
            }
            else if (value === "1") {
              setDisplayOgTag('block');
            }
          }} style={{ width: '300px' }} defaultValue="Autogenerated">
            <Option value="0">Autogenerated</Option>
            <Option value="1">Custom</Option>
          </Select>
          <br />
          <TextArea value={ogTag} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayOgTag}` }} onChange={(event: any) => { setOgTag(event.target.value); setLeave(true); }} />
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Meta description</label>}
        >
          <Select onChange={(value: any) => {
            setLeave(true);
            setMetaDescriptionType(value);
            if (value === "A") {
              setDisplayMetaDescription('none');
            }
            else if (value === "C") {
              setDisplayMetaDescription('block')
            }
          }} style={{ width: '300px' }} defaultValue={metaDescriptionType}>
            <Option value="A">Autogenerated</Option>
            <Option value="C">Custom</Option>
          </Select>
          <br />
          <TextArea value={metaDescription} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayMetaDescription}` }} onChange={(event: any) => { setMetaDescription(event.target.value); setLeave(true); }} />
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Meta keywords</label>}
        >
          <input onChange={(event: any) => {
            setLeave(true);
            setMetaKeyWord(event.target.value);
          }} className="ant-input bg-main" style={{ width: '300px' }} />
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#fff" }}>Product page title</label>}
        >
          <input onChange={(event: any) => {
            setLeave(true);
            setProductPageTitle(event.target.value);
          }} className="ant-input bg-main" style={{ width: '300px' }} />
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Add to Facebook product feed</label>}
        >
          <Switch onChange={(checked: any) => {
            setLeave(true);
            if (checked === true) {
              setFaceBookFeed(1);
            }
            else if (checked === false) {
              setFaceBookFeed(0);
            }
          }} checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>

        <Form.Item
          name=""
          label={<label style={{ color: "#fff" }}>Add to Google product feed</label>}
        >
          <Switch onChange={(checked: any) => {
            setLeave(true);
            if (checked === true) {
              setGoogleFeed(1);
            }
            else if (checked === false) {
              setGoogleFeed(0);
            }
          }} checkedChildren="YES" unCheckedChildren="NO" />
        </Form.Item>
      </Form>


    </div>
  )
}
