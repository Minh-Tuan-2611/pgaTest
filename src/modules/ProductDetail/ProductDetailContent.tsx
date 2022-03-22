import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';
import { Spinner } from 'react-bootstrap';
import {
    Checkbox,
    Dropdown,
    Form,
    Menu,
    Select,
    Switch,
} from 'antd';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'react-date-range';
import { Upload } from 'antd';
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import Swal from 'sweetalert2';
import ButtonConfirmLeaveAddProduct from '../ButtonConfirm/ButtonConfirmLeaveAddProduct';


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

    const dispatch = useDispatch();

    const editorRef = useRef(null as any);

    const [form] = Form.useForm();

    const { id } = props;

    const navigate = useNavigate();

    const config = {
        headers: { Authorization: Cookies.get('token') as string },
    };

    let [product, setProduct] = useState({ name: '', vendor_id: '', sale_price_type: '', categories: [{ name: '' }], id: '' });
    let [loading, setLoading] = useState(false);
    let [arrivalDate, setArrivalDate] = useState(Date.now() as any);
    let [leave, setLeave] = useState(false);

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
                setArrivalDate(new Date(parseInt(result.data.data.arrival_date) * 1000));
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

                setBrand(result.data.data.brand_id);

                setVendor(result.data.data.vendor_id)

                setLoading(false);

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
        setLeave(true);
        if (result.file.status === 'removed') {
            setFileImgDelete([...fileImgDelete, result.file.uid]);
        }
        if (result.file.status === 'done') {
            setFileImg([...fileImg, result.file]);
        }
        console.log(result.fileList);
        if (result.fileList.length === 0) {
            setImgError('Img is required !');
        }
        else if (result.fileList.length > 0) {
            setImgError('');
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

    let [productTitleError, setProductTitleError] = useState('');

    let [skuError, setSkuError] = useState('');

    let [imgError, setImgError] = useState('');

    let [categoryError, setCategoryError] = useState('');

    let [descriptionError, setDescriptionError] = useState('');

    let [priceError, setPriceError] = useState('');

    let [quantityError, setQuantityError] = useState('');

    let [continentalUSError, setContinentalUSError] = useState('');

    const renderCheckbox = () => {


        return <Checkbox defaultChecked={membership.length > 0} onChange={(event: any) => {
            setLeave(true);
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
        if (vendor.trim() !== '' && productTitle.trim() !== "" && brand.trim() !== '' && sku.trim() !== '' && fileList.length > 0 && category.length > 0 && price !== '' && stock !== '' && continentalUS !== '') {
            return false;
        }
        else if (vendor === '' || productTitle.trim() === "" || brand.trim() === '' || sku.trim() === '' || fileList.length === 0 || category.length === 0 || price === '' || stock === '' || continentalUS === '') {
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
        let promise = axios.get('https://api.gearfocus.div4.pgtest.co/api/categories/list', config);
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
            "description": description,
            "enabled": enabled,
            "memberships": membership,
            "shipping_to_zones": [{ id: "1", price: continentalUS }],
            "tax_exempt": taxExempt,
            "price": price,
            "sale_price_type": priceSaleType,
            "arrival_date": moment(arrivalDate.toLocaleDateString()).format('YYYY-MM-DD'),
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

                                getProductDetail();
                                setLoading(false);
                                setLeave(false);
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

                    getProductDetail();
                    setLeave(false);
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
                            defaultValue={parseInt(vendor)}
                            onChange={(value: any) => {
                                setLeave(true);
                                setVendor(value);
                                console.log(value)
                            }}
                        >
                            {vendorList.map((vendor: any, index: any) => {
                                return <Option key={index} value={vendor.id}>{vendor.name}</Option>
                            })}
                        </Select>

                    </Form.Item>

                    <Form.Item
                        name="Product title"
                        label={<label style={{ color: "#fff" }}>Product title<span className="text-danger">*</span></label>}
                    >
                        <div className="row">
                            <input onChange={(event: any) => {
                                setLeave(true);
                                if (event.target.value.trim() === '') {
                                    setProductTitleError('Product title is required !');
                                }
                                else {
                                    setProductTitleError('')
                                }
                                setProductTitle(event.target.value);
                            }} value={productTitle} className="ant-input bg-main ml-3" style={{ width: '658px' }} />
                        </div>
                        <p className="text-danger">{productTitleError}</p>
                    </Form.Item>

                    <Form.Item
                        style={{ color: '#fff' }}
                        name="brand"
                        label={<label style={{ color: "#fff" }}>Brand<span className="text-danger">*</span></label>}
                    >
                        <div>
                            <Select onChange={(value: any) => {
                                setLeave(true);
                                setBrand(value);
                            }} style={{ width: '660px' }} defaultValue={brand}>
                                {brandList.map((brand: any, index: any) => {
                                    return <Option key={index} value={brand.id}>{brand.name}</Option>
                                })}
                            </Select>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="condition"
                        label={<label style={{ color: "#fff" }}>Condition</label>}
                    >
                        <Select onChange={(value: any) => {
                            setLeave(true);
                            setCondition(value);
                        }} style={{ width: '660px' }} placeholder="select condition" defaultValue={condition}>
                            <Option value="262">None</Option>
                            <Option value="292">Used</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="sku"
                        label={<label style={{ color: "#fff" }}>SKU<span className="text-danger">*</span></label>}
                    >
                        <div className="row">
                            <input onChange={(event: any) => {
                                setLeave(true);
                                if (event.target.value.trim() === '') {
                                    setSkuError('SKU is required !');
                                }
                                else {
                                    setSkuError('');
                                }
                                setSku(event.target.value);
                            }} value={sku} className="ant-input bg-main ml-3" style={{ width: '660px' }} />
                            <br />
                        </div>
                        <p className="text-danger">{skuError}</p>

                    </Form.Item>

                    <Form.Item
                        name="images"
                        label={<label style={{ color: "#fff" }}>Images<span className="text-danger">*</span></label>}
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
                        <p className="text-danger">{imgError}</p>

                    </Form.Item>

                    <Form.Item
                        name="category"
                        label={<label style={{ color: "#fff" }}>Category<span className="text-danger">*</span></label>}
                    >
                        <Select onChange={(value: any) => {
                            setLeave(true);
                            setCategory(value);
                            if (value.length > 0) {
                                setCategoryError('')
                            }
                            else if (value.length === 0) {
                                setCategoryError('Category is required !')
                            }
                        }} mode="multiple" defaultValue={category} style={{ width: '660px' }} placeholder="Type categories name to select">
                            {categoryList.map((category: any, index: any) => {
                                return <Option key={index} value={category.id}>{category.name}</Option>
                            })}
                        </Select>
                        <p className="text-danger">{categoryError}</p>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<label style={{ color: "#fff" }}>Description<span className="text-danger">*</span></label>}
                    >
                        <div className="row">
                            <Editor
                                onInit={(evt, editor) => editorRef.current = editor}
                                onEditorChange={(value: any) => {
                                    setLeave(true);
                                    setDescription(value)
                                    if (value.trim() === '') {
                                        setDescriptionError('Description is required !');
                                    }
                                    else {
                                        setDescriptionError('');
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
                        <p className="text-danger">{descriptionError}</p>
                    </Form.Item>


                    <Form.Item
                        name=""
                        label={<label style={{ color: "#fff" }}>Available for sale</label>}
                    >
                        <div className="row">
                            <Switch onChange={(checked: any) => {
                                setLeave(true);
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
                            setLeave(true);
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
                        label={<label style={{ color: "#fff" }}>Price<span className="text-danger">*</span></label>}
                    >
                        <div className="row">
                            <div className="ml-3 text-white" style={{ padding: '8px 20px 8px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
                                $
                            </div>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                setLeave(true);
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setPrice(value);
                                }
                                if (event.target.value.trim() === '') {
                                    setPriceError('Price is required !');
                                }
                                else {
                                    setPriceError('');
                                }
                            }} value={price} style={{ width: '150px' }} placeholder="Input a number" />
                        </div>
                        <p className="text-danger">{priceError}</p>
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
                                setLeave(true);
                                setPriceSaleType(value);
                            }} defaultValue={priceSaleType} style={{ width: '50px' }}>
                                <Option value="$">$</Option>
                                <Option value="%">%</Option>
                            </Select>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                setLeave(true);
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
                            <Calendar
                                date={arrivalDate}
                                onChange={(date: any) => {
                                    setLeave(true);
                                    setArrivalDate(date);
                                }}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Quantity in stock<span className="text-danger">*</span></label>}
                        name="stocks"
                    >
                        <div className="row align-items-center">
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                setLeave(true);
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setStock(value);
                                }
                                if (event.target.value.trim() === '') {
                                    setQuantityError('Quantity is required !');
                                }
                                else {
                                    setQuantityError('');
                                }
                            }} style={{ width: '150px', marginLeft: '16px' }} placeholder="Input a number" value={stock} />
                        </div>
                        <p className="text-danger">{quantityError}</p>
                    </Form.Item>

                    <div className="" style={{ display: 'block', height: '20px', backgroundColor: '#323259', boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)', marginRight: '-17.25rem', marginLeft: '-2.25rem' }}></div>
                    <h3 className="mt-3 mb-3 text-white">Shipping</h3>
                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Continental U.S<span className="text-danger">*</span></label>}
                        name="continental"
                    >
                        <div className="row align-items-center">
                            <div className="ml-3 text-white" style={{ padding: '5px 20px 5px 20px', backgroundColor: 'rgba(180,180,219,.24)', borderRadius: '5px' }}>
                                $
                            </div>
                            <input className="ant-input bg-main" onChange={(event: any) => {
                                setLeave(true);
                                const { value } = event.target;
                                const reg = /^-?\d*(\.\d*)?$/;
                                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                                    setContinentalUS(value);
                                }
                                if (event.target.value.trim() === '') {
                                    setContinentalUSError('Continental is required !');
                                }
                                else {
                                    setContinentalUSError('');
                                }
                            }} style={{ width: '150px' }} placeholder="Input a number" value={continentalUS} />
                        </div>
                        <p className="text-danger">{continentalUSError}</p>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Add Shipping Location</label>}
                        name="location"
                    >
                        <Select onChange={(value: any) => {
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
                        <TextArea value={ogTag} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayOgTag}` }} onChange={(event: any) => { setOgTag(event.target.value); setLeave(true); }} />
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
                        <TextArea value={metaDescription} className="text-white mt-3" style={{ height: 60, width: '300px', backgroundColor: '#252547', borderColor: '#13132b', display: `${displayMetaDescription}` }} onChange={(event: any) => { setMetaDescription(event.target.value); setLeave(true); }} />
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Meta keywords</label>}
                    >
                        <div className="row">
                            <input onChange={(event: any) => {
                                setLeave(true);
                                setMetaKeyWord(event.target.value);
                            }} value={metaKeyWord} className="ant-input bg-main ml-3" style={{ width: '300px' }} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<label style={{ color: "#fff" }}>Product page title</label>}
                    >
                        <div className="row">
                            <input onChange={(event: any) => {
                                setLeave(true);
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
                                setLeave(true);
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
                                setLeave(true);
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

