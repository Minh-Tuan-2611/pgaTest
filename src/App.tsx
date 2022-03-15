import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ROUTES } from './configs/routes';
import AddProduct from './modules/AddProduct/AddProduct';
import LoginPage from './modules/auth/pages/LoginPage';
import Modal from './modules/component/Modal';
import Product from './modules/Product/Product';
import ProductDetail from './modules/ProductDetail/ProductDetail';
import UserList from './modules/userList/UserList';

function App() {
  return (
    <BrowserRouter>
      <Modal/>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />}/>
        <Route path='/' element={<LoginPage />}/>
        <Route path={ROUTES.product} element={<Product />}/>
        <Route path={ROUTES.userList} element={<UserList />}/>
        <Route path={ROUTES.addProduct} element={<AddProduct />}/>
        <Route path={ROUTES.productDetail} element={<ProductDetail />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
