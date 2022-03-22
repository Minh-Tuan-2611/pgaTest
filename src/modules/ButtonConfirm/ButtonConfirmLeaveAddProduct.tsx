import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

export default function ButtonConfirmLeaveAddProduct() {

    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => {
                navigate(ROUTES.product);
            }} className="btn text-white" style={{ backgroundColor: '#b18aff' }} data-dismiss="modal">YES</button>
        </div>
    )
}
