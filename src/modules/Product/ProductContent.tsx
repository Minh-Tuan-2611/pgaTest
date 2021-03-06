import { Checkbox, Input, Pagination, Select } from 'antd'
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';
import ButtonConfirmDelete from '../ButtonConfirm/ButtonConfirmDelete';
import ButtonConfirmEnable from '../ButtonConfirm/ButtonConfirmEnable';
import ButtonConfirmRemoveSelect from '../ButtonConfirm/ButtonConfirmRemoveSelect';
import './ProductContent.css';

export default function ProductContent() {

  let { collapsed } = useSelector((state: any) => state.collapsedtReducer);

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

  let [categoryList, setCategoryList] = useState([]);

  let [vendorList, setVendorList] = useState([]);

  let [vendor, setVendor] = useState("");

  let [stock, setStock] = useState('all');

  let [category, setCategory] = useState(0);

  let [productList, setProductList] = useState([{ id: '', name: '', category: '', price: '', vendor: '' }]);

  let [loading, setLoading] = useState(false);

  let [search, setSearch] = useState('');

  let [availability, setAvailability] = useState('all');

  let [searchType, setSearchType] = useState("");

  let [page, setPage] = useState(1);

  let [count, setCount] = useState(25);

  let [disabled, setDisabled] = useState(true);

  let [order, setOrder] = useState('ASC');

  let [sort, setSort] = useState('name');

  let [display, setDisplay] = useState('none');

  let [total, setTotal] = useState(1000)

  const getCategoryList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/api/categories/list');
    promise.then((results) => {
      setCategoryList(results.data.data);
    })
  }

  const getVendorList = () => {
    let promise = axios.get('https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list', config);
    promise.then((results) => {
      setVendorList(results.data.data);
    })
  }

  const getProductList = () => {
    setDisabled(true);
    setLoading(true);
    setParams([]);
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co//api/products/list',
      {
        "page": 1,
        "count": 25,
        "search": search,
        "category": category,
        "stock_status": stock,
        "availability": availability,
        "vendor": vendor,
        "sort": "name",
        "order_by": "ASC",
        "search_type": searchType
      },config);
    promise.then((results) => {
      if (results.data.data === false) {
        setProductList([]);
      }
      else {
        setProductList(results.data.data);
        setTotal(results.data.recordsFiltered);
      }
      console.log(results.data.data);
      setLoading(false);
    })
  }

  const getProductList2 = (sort: any) => {
    setLoading(true);
    if (order === 'ASC') {
      setOrder('DESC');
    }
    else if (order === 'DESC') {
      setOrder('ASC');
    }
    let promise = axios.post('https://api.gearfocus.div4.pgtest.co//api/products/list',
      {
        "page": page,
        "count": count,
        "search": search,
        "category": category,
        "stock_status": stock,
        "availability": availability,
        "vendor": vendor,
        "sort": sort,
        "order_by": order,
        "search_type": searchType
      },config);
    promise.then((results) => {
      if (results.data.data === false) {
        setProductList([]);
      }
      else {
        setProductList(results.data.data);
        setTotal(results.data.recordsFiltered);
      }
      console.log(results.data.data);
      setLoading(false);
    })
  }

  let [params, setParams] = useState([] as any)

  const { Option } = Select;

  useEffect(() => {
    getProductList2('name');
    getCategoryList();
    getVendorList();
  }, [])

  useEffect(() => {
    if (params.length === 0) {
      setDisabled(true);
    }
    else if (params.length > 0) {
      setDisabled(false);
    }
  }, [params]);

  const renderStatus = (product: any) => {
    if (product.enabled === "1") {
      return <i onClick={() => {
        dispatch({
          type: 'change_modal',
          title: 'Confirm Update',
          content: 'Do you want to update this products ?',
          button: <ButtonConfirmEnable enable={0} id={product.id} getProductList={getProductList} />
        })
      }} style={{ fontSize: '17px', color: '#72b25b', cursor: 'pointer' }} className="fa fa-power-off" data-toggle="modal" data-target="#modelId"></i>
    }
    else if (product.enabled === "0") {
      return <i onClick={() => {
        dispatch({
          type: 'change_modal',
          title: 'Confirm Update',
          content: 'Do you want to update this products ?',
          button: <ButtonConfirmEnable enable={1} id={product.id} getProductList={getProductList} />
        })
      }} style={{ fontSize: '17px', cursor: 'pointer' }} className="fa fa-power-off" data-toggle="modal" data-target="#modelId"></i>
    }
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

  return (
    <div>
      {loading === true ? <div style={{ display: 'block', backgroundColor: '#888', opacity: '0.5',zIndex:'3000' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
        <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
          <Spinner animation="border" style={{ color: "white" }} />
        </div>
      </div> : ''}
      <h2 className="text-white mt-2 mb-4">Products</h2>
      <div className="" style={{ backgroundColor: '#323259', position: 'relative', paddingLeft: '40px', padding: '20px' }}>
        <div className="row align-items-center w-100" style={{ paddingLeft: '20px' }}>
          <div className="col-5" style={{ padding: '0' }}>
            <Input onChange={(event: any) => {
              setSearch(event.target.value);
            }} value={search} className="text-white" placeholder="Search keywords" style={{ backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }} />
          </div>
          <div className="col-3" style={{ padding: '0', paddingLeft: '15px' }}>
            <select onChange={(event: any) => {
              setCategory(event.target.value);
            }} className="text-white" style={{ width: '100%', backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '5px' }}>
              <option value="0">Any category</option>
              {categoryList.map((category: any, index: any) => {
                return <option key={index} value={category.id}>{category.name}</option>
              }
              )}
            </select>
          </div>
          <div className="col-3">
            <select onChange={(event: any) => {
              setStock(event.target.value);
            }} className="text-white" style={{ width: '100%', backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '5px' }}>
              <option value="all">Any stock status</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">SOLD</option>
            </select>
          </div>
          <div className="col-1">
            <button onClick={() => {
              getProductList();
            }} className="btn text-white" style={{ backgroundColor: '#b18aff' }}>Search</button>
          </div>
        </div>
        <hr />
        <div className="row" style={{ display: `${display}` }}>
          <div className="col-3">
            <div className="row">
              <div className="col-5 text-white">
                Search in:
              </div>
              <div className="col-7">
                <Checkbox.Group onChange={(values: any) => {
                  setSearchType(values.toString());
                }}>
                  <Checkbox value="name" className="text-white">Name</Checkbox>
                  <br />
                  <Checkbox value="sku" className="text-white">SKU</Checkbox>
                  <br />
                  <Checkbox value="description" className="text-white">Full Description</Checkbox>
                  <br />
                </Checkbox.Group>
              </div>
            </div>
          </div>
          <div className="col-5">
            <select onChange={(event: any) => {
              setAvailability(event.target.value);
            }} className="text-white" style={{ width: '100%', backgroundColor: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '5px' }}>
              <option value="all">Any availability status</option>
              <option value="1">Only enable</option>
              <option value="0">Only disable</option>
            </select>
          </div>
          <div className="col-4">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: '355px' }}
              listHeight={250}
              placeholder="Vendor"
              onChange={(event: any) => {
                setVendor(event);
              }}
            >
              {vendorList.map((vendor: any, index: any) => {
                return <Option key={index} value={vendor.id}>{vendor.name}</Option>
              })}
            </Select>
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

      <button onClick={() => {
        navigate(ROUTES.addProduct);
      }} className="btn text-white mt-5" style={{ backgroundColor: '#b18aff' }}>Add Product</button>
      <div className="mt-5 p-3" style={{ backgroundColor: '#323259' }}>
        <table className="table text-white">
          <thead>
            <tr>
              <th><Checkbox checked={params.length === productList.length}
                onChange={(event: any) => {
                  if (event.target.checked === true) {
                    setDisabled(false);
                    let params3 = [];
                    for (let i = 0; i < productList.length; i++) {
                      let data = {
                        "id": productList[i].id,
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
                }} style={{ position: 'relative', right: '10px' }} /></th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('sku')
                getProductList2('sku');
              }}>SKU {renderArrow('sku')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('name')
                getProductList2('name');
              }}>Name {renderArrow('name')}</th>
              <th>Category</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('price');
                getProductList2('price');
              }}>Price {renderArrow('price')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('amount')
                getProductList2('amount');
              }}>In stock {renderArrow('amount')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('vendor')
                getProductList2('vendor');
              }}>Vendor {renderArrow('vendor')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => {
                setSort('arrivalDate');
                getProductList2('arrivalDate');
              }}>Arrival Date {renderArrow('arrivalDate')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product: any, index: any) => {
              return <tr >
                <td>
                  <div className="row d-flex align-items-center" style={{ justifyContent: 'space-around' }}>
                    <Checkbox checked={params.findIndex((item: any) => item.id === product.id) !== -1} onChange={(event: any) => {

                      if (event.target.checked === true) {
                        // setDisabled(false);
                        let data = {
                          "id": product.id,
                          "delete": 1
                        } as Object
                        setParams([...params, data]);
                      }
                      else if (event.target.checked === false) {
                        let params2 = [...params]
                        let index = params2.findIndex((item: any) => item.id === product.id);
                        if (index !== -1) {
                          params2.splice(index, 1);
                          setParams(params2);
                        }
                      }
                    }} />


                    {renderStatus(product)}
                  </div>
                </td>
                <td>{product.sku}</td>
                <td><NavLink to={`/productDetail/${product.id}`}>{product.name.substr(0, 15)}...</NavLink></td>
                <td>{product.category.substr(0, 17)}...</td>
                <td>${product.price.substr(0, 4)}...</td>
                <td>{product.amount}</td>
                <td>{product.vendor.substr(0, 14)}...</td>
                <td>{new Date(product.arrivalDate * 1000).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => {
                    dispatch({
                      type: 'change_modal',
                      title: 'Confirm Delete',
                      content: 'Do you want to delete this products ?',
                      button: <ButtonConfirmDelete id={product.id} getProductList={getProductList} />
                    })
                  }} className="btn text-white" style={{ backgroundColor: '#b18aff' }} data-toggle="modal" data-target="#modelId"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>

            })}
          </tbody>
        </table>
        <div className="p-3" style={{ boxShadow: '0 0 13px 0 #b18aff', position: 'fixed', width: `${renderWidth()}`, backgroundColor: '#323259', zIndex: '2000', bottom: '0' }}>
          <button disabled={disabled} onClick={() => {
            dispatch({
              type: 'change_modal',
              title: 'Confirm Delete',
              content: 'Do you want to delete all products sellected ?',
              button: <ButtonConfirmRemoveSelect getProductList={getProductList} params={params} />
            })
          }} className="btn text-white" style={{ backgroundColor: '#f0ad4e' }} data-toggle="modal" data-target="#modelId">Remove Selected</button>
        </div>
        <div className="mt-4">
          <Pagination onChange={(page, pageSize) => {
            setLoading(true);
            setPage(page);
            setCount(pageSize);
            let promise = axios.post('https://api.gearfocus.div4.pgtest.co//api/products/list',
              {
                "page": page,
                "count": pageSize,
                "search": search,
                "category": category,
                "stock_status": stock,
                "availability": availability,
                "vendor": vendor,
                "sort": sort,
                "order_by": order,
                "search_type": searchType
              });
            promise.then((results) => {
              if (results.data.data === false) {
                setProductList([]);
              }
              else {
                setProductList(results.data.data);
              }
              console.log(results.data.data);
              setLoading(false);
            })
          }} defaultCurrent={1} defaultPageSize={25} total={total} pageSizeOptions={[10,25,50,75,100]}/>
        </div>
      </div>
    </div>
  )
}
