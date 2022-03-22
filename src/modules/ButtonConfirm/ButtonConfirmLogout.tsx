import Cookies from 'js-cookie'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

export default function ButtonConfirmLogout() {

  const navigate = useNavigate()

  return (
    <button onClick={()=>{
      Cookies.remove('token');
      localStorage.removeItem('emailLogin');
      localStorage.removeItem('idUser');
      navigate(ROUTES.login);
    }} className="btn text-white" style={{ backgroundColor:'#b18aff'}} data-dismiss="modal">YES</button>
  )
}
