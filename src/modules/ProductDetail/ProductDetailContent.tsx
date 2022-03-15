import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';
import { Spinner } from 'react-bootstrap';
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
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';


const formItemLayout = {
    labelCol: {
        xs: { span: 8 },

        sm: { span: 5 },
    },

};

const { Option } = Select;


export default function ProductDetailContent(props: any) {
    let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

    const renderWidth = () => {
        if (collapsed === true) {
            return '81%'
        }
        if (collapsed === false) {
            return '92%'
        }
    }

    const editorRef = useRef(null as any);

    const [form] = Form.useForm();

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Checkbox onChange={(event: any) => {
                    if (event.target.checked === true) {
                        setGeneral('General');
                    }
                    else if (event.target.checked === false) {
                        setGeneral('');
                    }
                }}>General</Checkbox>
            </Menu.Item>
        </Menu>
    );

    const { id } = props;

    const navigate = useNavigate();

    const config = {
        headers: { Authorization: Cookies.get('token') as string },
    };

    let [product, setProduct] = useState({ name: '', vendor_id: '', sale_price_type: '', categories: [{ name: '' }] });
    let [loading, setLoading] = useState(false);

    const getProductDetail = () => {
        setLoading(true);
        let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/products/detail', {
            id: id,
        }, config);
        promise.then((result) => {
            if (result.data.success === true) {
                console.log(result.data.data);
                setProductTitle(result.data.data.name);
                setProductPageTitle(result.data.data.product_page_title)
                setPrice(result.data.data.price);
                setStock(result.data.data.quantity);
                setPriceSale(result.data.data.sale_price);
                setPriceSaleType(result.data.data.sale_price_type);
                setSku(result.data.data.sku);
                setProduct(result.data.data);
                setArrivalDate(result.data.data.arrival_date);
                setDescription(result.data.data.description);
                if (result.data.data.facebook_marketing_enabled === "1") {
                    setFaceBookFeed(true);
                }
                else if (result.data.data.facebook_marketing_enabled === "0") {
                    setFaceBookFeed(false);
                }
                if (result.data.data.google_feed_enabled === "1") {
                    setGoogleFeed(true);
                }
                else if (result.data.data.google_feed_enabled === "0") {
                    setGoogleFeed(false);
                }
                if (result.data.data.enabled === "1") {
                    setEnable(true);
                }
                else if (result.data.data.enabled === "0") {
                    setEnable(false);
                }
                if (result.data.data.shipping.length === 0) {
                    setContinentalUS('');
                }
                else if (result.data.data.shipping.length > 0) {
                    setContinentalUS(result.data.data.shipping[0].price);
                }
                setMetaKeyWord(result.data.data.meta_keywords);
                let arr = [];
                for (var i = 0; i < result.data.data.categories.length; i++) {
                    arr.push(result.data.data.categories[i].name);
                }
                setCategory(arr);
                let id = result.data.data.vendor_id;

                setLoading(false);
                let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list', config);
                promise.then((results) => {
                    let index = results.data.data.findIndex((item: any) => item.id === id);
                    if (index !== -1) {
                        setVendor(results.data.data[index].name);
                    }
                    if (index === -1) {
                        setVendor('Administrator')
                    }
                })

                let id2 = result.data.data.brand_id
                let promise2 = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list', config);
                promise2.then((results) => {
                    let index = results.data.data.findIndex((item: any) => item.id === id2);
                    if (index !== -1) {
                        setBrand(results.data.data[index].name);
                    }
                })

            }
        })
    }

    const [fileList, setFileList] = useState([]);

    let [display, setDisplay] = useState('none');

    let [brandList, setBrandList] = useState([]);

    let [vendorList, setVendorList] = useState([{ id: '', name: '' }]);

    let [categoryList, setCategoryList] = useState([]);

    let [countryList, setCountryList] = useState([]);

    const onChange = (result: any) => {
        console.log(result.fileList);
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

    let [productTitle, setProductTitle] = useState('');

    let [productPageTitle, setProductPageTitle] = useState('');

    let [vendor, setVendor] = useState('');

    let [brand, setBrand] = useState('');

    let [stock, setStock] = useState('');

    let [price, setPrice] = useState('');

    let [priceSale, setPriceSale] = useState('');

    let [priceSaleType, setPriceSaleType] = useState('');

    let [continentalUS, setContinentalUS] = useState('');

    let [general, setGeneral] = useState('');

    let [sku, setSku] = useState('');

    let [arrivalDate, setArrivalDate] = useState(1);

    let [description, setDescription] = useState('');

    let [faceBookFeed, setFaceBookFeed] = useState(false);

    let [googleFeed, setGoogleFeed] = useState(false);

    let [enable, setEnable] = useState(false);

    let [metaKeyWord, setMetaKeyWord] = useState('');

    let [category, setCategory] = useState([] as Array<string>);

    const getBrandList = () => {
        setLoading(true);
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list', config);
        promise.then((results) => {
            setBrandList(results.data.data);
            // setLoading(false);
        })
    }

    const getVendorList = () => {
        setLoading(true);
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list', config);
        promise.then((results) => {
            if (results.data.success === true) {
                setVendorList(results.data.data);
            }
        })
    }

    const getCategoryList = () => {
        setLoading(true);
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/api/categories/list');
        promise.then((results) => {
            setCategoryList(results.data.data);
            // setLoading(false);
        })
    }

    const getCountryList = () => {
        setLoading(true);
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country', config);
        promise.then((result) => {
            setCountryList(result.data.data);
            // setLoading(false);
        })
    }

    useEffect(() => {
        getBrandList();
        getVendorList();
        getCategoryList();
        getCountryList();
        getProductDetail();
    }, [])

    const onFinish = (values: any) => {
        setDescription(editorRef.current.getContent())
        console.log('Received values of form: ', values);
    };

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
                    <button onClick={() => {
                        navigate(ROUTES.product);
                    }} style={{ borderRadius: '50%' }} className="btn bg-light ml-3"><i className="fa-solid fa-arrow-left"></i></button>
                </div>
                <h3 className="mt-3 mb-3 text-white">{product.name}</h3>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                    style={{ width: '80%' }}
                >
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
                            placeholder={<p style={{ color: '#fff', marginTop: '43px' }}>{vendor}</p>}
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
                        <div className="row">
                            <input onChange={(event: any) => {
                                setProductTitle(event.target.value);
                            }} value={productTitle} className="ant-input bg-main ml-3" style={{ width: '658px' }} />
                        </div>
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
                        <Select style={{ width: '660px' }} placeholder={<p style={{ color: '#fff', marginTop: '43px' }}>{brand}</p>}>
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
                        <div className="row">
                            <input onChange={(event: any) => {
                                setSku(event.target.value);
                            }} value={sku} className="ant-input bg-main ml-3" style={{ width: '660px' }} />
                        </div>

                    </Form.Item>

                    <Form.Item
                        name="images"
                        label={<label style={{ color: "#fff" }}>Images</label>}
                        rules={[{ required: true, message: 'Please input images !' }]}
                    >

                        <ImgCrop rotate>
                            <Upload
                                action="https://api.gearfocus.div4.pgtest.co/api/products/upload-image"
                                listType="picture-card"
                                fileList={fileList as []}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
                                <i className="fa-solid fa-camera" style={{ fontSize: '50px', color: '#333' }}></i>
                            </Upload>
                        </ImgCrop>

                    </Form.Item>

                    <Form.Item
                        name="category"
                        label={<label style={{ color: "#fff" }}>Category</label>}
                        rules={[{ required: true, message: 'Please select category !' }]}
                    >
                        <Select onChange={(value: any) => {
                            setCategory(value);
                        }} mode="multiple" defaultValue={category} style={{ width: '660px' }} placeholder="Type categories name to select">
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
                        <div className="row">
                            <Editor

                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={description}
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
                    </Form.Item>


                    <Form.Item
                        name=""
                        label={<label style={{ color: "#fff" }}>Available for sale</label>}
                    >
                        <div className="row">
                            <Switch onChange={(checked: any) => {
                                setGoogleFeed(checked);
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={enable} />
                        </div>
                    </Form.Item>


                    <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
                    <h3 className="mt-3 mb-3 text-white">Prices & Inventory</h3>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Memberships</label>}
                        name="membership"
                    >
                        <Dropdown overlay={menu} trigger={['click']}>
                            <div className="ant-dropdown-link" style={{ height: '40px', width: '400px', backgroundColor: 'rgb(50, 50, 89)', borderRadius: '5px', borderColor: '#13132b' }}>
                                <span className="text-white" style={{ position: 'relative', top: '8px', left: '10px' }}>
                                    {general}
                                </span>
                            </div>
                        </Dropdown>
                    </Form.Item>


                    <Form.Item
                        name="price"
                        label={<label style={{ color: "#fff" }}>Price</label>}
                    >
                        <div className="row">
                            <div className="ml-3 text-white" style={{ padding: '8px 20px 8px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
                                $
                            </div>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setPrice(value);
                                }
                            }} value={price} style={{ width: '150px' }} placeholder="Input a number" />
                        </div>

                    </Form.Item>
                    <Form.Item
                        name="priceSale"
                        label={<Checkbox onChange={(event: any) => {
                            if (event.target.checked === true) {
                                setDisplay('inline-block');
                            }
                            else if (event.target.checked === false) {
                                setDisplay('none');
                            }
                        }} className="ml-5 mr-5 text-white">Sale</Checkbox>}
                    >
                        <div className="row" style={{ display: `${display}`, marginLeft: '2px' }}>
                            <Select onChange={(value: any) => {
                                setPriceSaleType(value);
                            }} placeholder={priceSaleType} style={{ width: '50px' }}>
                                <Option value="$">$</Option>
                                <Option value="%">%</Option>
                            </Select>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setPriceSale(value);
                                }
                            }} value={priceSale} style={{ width: '150px' }} placeholder="Input a number" />
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
                            <DatePicker defaultValue={moment(arrivalDate * 1000)} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Quantity in stock</label>}
                        rules={[{ required: true, message: 'Please input quantity stock !' }]}
                        name="stocks"
                    >
                        <div className="row align-items-center">
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
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
                            <div className="ml-3 text-white" style={{ padding: '5px 20px 5px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
                                $
                            </div>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setContinentalUS(value);
                                }
                            }} style={{ width: '150px' }} placeholder="Input a number" value={continentalUS} />
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
                        <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
                            <button style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
                                Update Product
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
                        <div className="row">
                            <input onChange={(event: any) => {
                                setMetaKeyWord(event.target.value);
                            }} value={metaKeyWord} className="ant-input bg-main ml-3" style={{ width: '300px' }} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Product page title</label>}
                    >
                        <div className="row">
                            <input onChange={(event: any) => {
                                setProductPageTitle(event.target.value);
                            }} value={productPageTitle} className="ant-input bg-main ml-3" style={{ width: '300px' }} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name=""
                        label={<label style={{ color: "#fff" }}>Add to Facebook product feed</label>}
                    >
                        <div className="row">
                            <Switch onChange={(checked: any) => {
                                setFaceBookFeed(checked);
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={faceBookFeed} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name=""
                        label={<label style={{ color: "#fff" }}>Add to Google product feed</label>}
                    >
                        <div className="row">
                            <Switch onChange={(checked: any) => {
                                setGoogleFeed(checked);
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={googleFeed} />
                        </div>
                    </Form.Item>
                </Form>
            </div>

        )
    }
    return <div className=""></div>


}

