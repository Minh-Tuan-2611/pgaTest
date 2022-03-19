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
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import Swal from 'sweetalert2';


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

    const { id } = props;

    const navigate = useNavigate();

    const config = {
        headers: { Authorization: Cookies.get('token') as string },
    };

    let [product, setProduct] = useState({ name: '', vendor_id: '', sale_price_type: '', categories: [{ name: '' }], id: '' });
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
                setMetaDescription(result.data.data.meta_description);
                setOgTag(result.data.data.og_tags);
                setMetaDescriptionType(result.data.data.meta_desc_type);
                setTaxExempt(result.data.data.tax_exempt);
                setCondition(result.data.data.condition_id);
                setMembership(result.data.data.memberships);
                if (result.data.data.memberships.length > 0) {
                    setGeneral('General');
                }
                else if (result.data.data.memberships.length === 0) {
                    setGeneral('');
                }
                if (result.data.data.images === []) {
                    setFileList([]);
                }
                else if (result.data.data.images.length > 0) {
                    let dataImg = [];
                    for (let i = 0; i < result.data.data.images.length; i++) {
                        let item = {
                            uid: result.data.data.images[i].id,
                            name: result.data.data.images[i].file,
                            status: 'done',
                            url: result.data.data.images[i].thumbs[0]
                        }
                        dataImg.push(item);
                    }
                    setFileList(dataImg);
                }
                if (result.data.data.facebook_marketing_enabled === "1") {
                    setFaceBookFeed(1);
                }
                else if (result.data.data.facebook_marketing_enabled === "0") {
                    setFaceBookFeed(0);
                }
                if (result.data.data.google_feed_enabled === "1") {
                    setGoogleFeed(1);
                }
                else if (result.data.data.google_feed_enabled === "0") {
                    setGoogleFeed(0);
                }
                if (result.data.data.enabled === "1") {
                    setEnabled(1);
                }
                else if (result.data.data.enabled === "0") {
                    setEnabled(0);
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
                    arr.push(result.data.data.categories[i].category_id);
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

    let [fileImg, setFileImg] = useState([] as any);

    let [fileList, setFileList] = useState([] as any);

    let [display, setDisplay] = useState('inline-block');

    let [brandList, setBrandList] = useState([]);

    let [vendorList, setVendorList] = useState([{ id: '', name: '' }]);

    let [categoryList, setCategoryList] = useState([]);

    let [countryList, setCountryList] = useState([]);

    let [fileImgDelete, setFileImgDelete] = useState([] as any);

    const onChange = (result: any) => {
        if (result.file.status === 'removed') {
            setFileImgDelete([...fileImgDelete, result.file.uid]);
        }
        if (result.file.status === 'done') {
            setFileImg([...fileImg, result.file]);
        }
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

    let [arrivalDate, setArrivalDate] = useState('');

    let [description, setDescription] = useState('');

    let [faceBookFeed, setFaceBookFeed] = useState(0);

    let [googleFeed, setGoogleFeed] = useState(0);

    let [metaKeyWord, setMetaKeyWord] = useState('');

    let [category, setCategory] = useState([] as Array<string>);

    let [ogTagType, setOgTagType] = useState('0');

    let [ogTag, setOgTag] = useState('');

    let [displayOgTag, setDisplayOgTag] = useState('none');

    let [displayMetaDescription, setDisplayMetaDescription] = useState('none');

    let [metaDescriptionType, setMetaDescriptionType] = useState('A');

    let [metaDescription, setMetaDescription] = useState('');

    let [taxExempt, setTaxExempt] = useState("0");

    let [condition, setCondition] = useState("262");

    let [enabled, setEnabled] = useState(0);

    let [membership, setMembership] = useState([] as Array<number>);

    const renderCheckbox = () => {


        return <Checkbox defaultChecked={membership.length > 0} onChange={(event: any) => {
            if (event.target.checked === true) {
                setMembership([4])
                setGeneral('General');
            }
            else if (event.target.checked === false) {
                setGeneral('');
                setMembership([]);
            }
        }} >General</Checkbox>

    }

    const menu = (
        <Menu>
            <Menu.Item key="0">
                {renderCheckbox()}
            </Menu.Item>
        </Menu>
    );

    const setDisable = () => {
        if (vendor !== '' && productTitle !== "" && brand !== '' && sku !== '' && fileList !== [] && category !== [] && price !== '' && stock !== '' && continentalUS !== '') {
            return false;
        }
        else if (vendor === '' || productTitle === "" || brand === '' || sku === '' || fileList === [] || category === [] || price === '' || stock === '' || continentalUS === '') {
            return true;
        }
    }

    const getBrandList = () => {
        setLoading(true);
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list', config);
        promise.then((results) => {
            setBrandList(results.data.data);
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
        })
    }

    const getCountryList = () => {
        setLoading(true);
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
        getProductDetail();
    }, [])

    const onFinish = () => {
        if (editorRef.current.getContent() !== null && fileList.length > 0) {
            setLoading(true);
            let img = [];
            for (var i = 0; i < fileImg.length; i++) {
                img.push(fileImg[i].name);
            }
            let bodyFormData = new FormData();
            bodyFormData.append('productDetail', JSON.stringify({
                "vendor_id": vendor,
                "name": productTitle,
                "brand_id": brand,
                "condition_id": condition,
                "categories": category,
                "description": editorRef.current.getContent(),
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
                "id": product.id,
                "deleted_images": fileImgDelete,
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
                    if (fileImg.length > 0) {
                        for (let i = 0; i < fileImg.length; i++) {
                            let id = result.data.data;
                            let bodyFormData = new FormData();
                            bodyFormData.append('productId', id);
                            bodyFormData.append('order', JSON.stringify(0));
                            bodyFormData.append('images[]', fileImg[i].originFileObj);
                            let promise = axios({
                                method: 'post',
                                url: 'https://api.gearfocus.div4.pgtest.co/api/products/upload-image',
                                data: bodyFormData,
                                headers: config.headers
                            })
                            promise.then((result) => {
                                if (result.data.success === true) {
                                    navigate(`/productDetail/${id}`);
                                    // getProductDetail();
                                    setLoading(false);
                                    Swal.fire(
                                        'Update Product Success !',
                                        '',
                                        'success'
                                    )
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
                    else if (fileImg.length === 0) {
                        navigate(`/productDetail/${id}`);
                        setLoading(false);
                        Swal.fire(
                            'Update Product Success !',
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

            promise.catch((error) => {
                Swal.fire(
                    'Create Product Fail !',
                    '',
                    'error'
                )
            })
        }
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
                    >

                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: '660px' }}
                            placeholder={<p style={{ color: '#fff', marginTop: '43px' }}>{vendor}</p>}
                            onChange={(value: any) => {

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
                    >
                        <Select onChange={(value: any) => {

                            setBrand(value);
                        }} style={{ width: '660px' }} placeholder={<p style={{ color: '#fff', marginTop: '43px' }}>{brand}</p>}>
                            {brandList.map((brand: any, index: any) => {
                                return <Option key={index} value={brand.id}>{brand.name}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="condition"
                        label={<label style={{ color: "#fff" }}>Condition</label>}
                    >
                        <Select onChange={(value: any) => {
                            setCondition(value);
                        }} style={{ width: '660px' }} placeholder="select condition">
                            <Option value="262">None</Option>
                            <Option value="292">Used</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="sku"
                        label={<label style={{ color: "#fff" }}>SKU</label>}
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
                    >


                        <Upload
                            action="https://api.gearfocus.div4.pgtest.co/api/products/upload-image"
                            listType="picture-card"
                            fileList={fileList as []}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            <i className="fa-solid fa-camera" style={{ fontSize: '50px', color: '#333' }}></i>
                        </Upload>

                    </Form.Item>

                    <Form.Item
                        name="category"
                        label={<label style={{ color: "#fff" }}>Category</label>}
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
                                if (checked === true) {
                                    setEnabled(1);
                                }
                                else if (checked === false) {
                                    setEnabled(0);
                                }
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={enabled === 1} />
                        </div>
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
                        <Checkbox defaultChecked={taxExempt === "1"} onChange={(event: any) => {
                            if (event.target.checked === true) {
                                setTaxExempt("1");
                            }
                            else if (event.target.checked === false) {
                                setTaxExempt("0");
                            }
                        }} />
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
                        label={<Checkbox defaultChecked={priceSale !== ''} onChange={(event: any) => {
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
                            <DatePicker onChange={(event: any) => {
                                setArrivalDate(moment(event._d.toLocaleDateString()).format('YYYY-DD-MM'));
                            }} defaultValue={moment(parseInt(arrivalDate) * 1000)} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Quantity in stock</label>}
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
                        <Select onChange={(value: any) => {

                        }} style={{ width: '300px' }} placeholder="Select new zone">
                            {countryList.map((country: any, index: any) => {
                                return <Option key={index}>{country.country}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item >
                        <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
                            <button disabled={setDisable()} style={{ backgroundColor: '#f0ad4e' }} className="btn text-white">
                                Update Product
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
                        }} style={{ width: '300px' }} defaultValue={ogTagType}>
                            <Option value="0">Autogenerated</Option>
                            <Option value="1">Custom</Option>
                        </Select>
                        <br />
                        <TextArea value={ogTag} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayOgTag}` }} onChange={(event: any) => { setOgTag(event.target.value); }} />
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Meta description</label>}
                    >
                        <Select onChange={(value: any) => {

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
                        <TextArea value={metaDescription} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayMetaDescription}` }} onChange={(event: any) => { setMetaDescription(event.target.value); }} />
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
                                if (checked === true) {
                                    setFaceBookFeed(1);
                                }
                                else if (checked === false) {
                                    setFaceBookFeed(0);
                                }
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={faceBookFeed === 1} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name=""
                        label={<label style={{ color: "#fff" }}>Add to Google product feed</label>}
                    >
                        <div className="row">
                            <Switch onChange={(checked: any) => {
                                if (checked === true) {
                                    setGoogleFeed(1);
                                }
                                else if (checked === false) {
                                    setGoogleFeed(0);
                                }
                            }} className="ml-3" checkedChildren="YES" unCheckedChildren="NO" defaultChecked={googleFeed === 1} />
                        </div>
                    </Form.Item>
                </Form>
            </div>

        )
    }
    return <div className=""></div>


}

