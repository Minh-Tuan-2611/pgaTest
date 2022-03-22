import axios from 'axios';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { ROUTES } from '../../../configs/routes';
import LoginForm from '../components/LoginForm'
import Cookies from 'js-cookie';
import { Spinner } from 'react-bootstrap';

export default function LoginPage() {

    let [loading, setLoading] = useState(false);

    const onLogin = (values: any) => {
        setLoading(true);
        let promise = axios.post('https://api.gearfocus.div4.pgtest.co/api/authentication/login', {
            email:values.email,
            password:values.password,
        })
        promise.then((results) => {
            if(results.data.success === true) {
                setLoading(false);
                window.location.pathname = ROUTES.product
                localStorage.setItem('emailLogin',values.email);
                localStorage.setItem('idUser',results.data.user.profile_id);
                console.log(results.data.user);
                Cookies.set('token',results.data.user_cookie)
            }
            if(results.data.success === false) {
                Swal.fire(
                    `${results.data.errors.email}`,
                    '',
                    'error'
                )
                setLoading(false);
            }
        })
        promise.catch((err) => {
            Swal.fire(
                'Login Fail !',
                '',
                'error'
            )
            setLoading(false);
        })
    }

    return (
        <div>
            {loading === true ? <div style={{ display: 'block',backgroundColor:'#888',opacity:'0.5' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
          <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
            <Spinner animation="border"/>
          </div>
        </div> : ''}
            <LoginForm onLogin={onLogin} />
        </div>
    )
}

