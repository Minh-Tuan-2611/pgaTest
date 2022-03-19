import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';

export default function ButtonConfirmRemoveSelectUser(props:any) {
    let { getUserList,params } = props;

    let [loading, setLoading] = useState(false);

    const config = {
        headers: { Authorization: Cookies.get('token') as string },
    };

    return (
        <div>
            {loading === true ? <div style={{ display: 'block' }} className="modal fade show" id="modelId2" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-modal="true">
                <div className="modal-dialog" role="document" style={{ marginTop: "50vh", display: "flex", justifyContent: "space-around" }}>
                    <Spinner animation="border" style={{ color: "white" }} />
                </div>
            </div> : ''}
            <button onClick={() => {
                setLoading(true);
                console.log(params)
                let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit',
                {
                    "params": params
                },
                config
            )
            promise.then(() => {
                getUserList();
                setLoading(false);
            })
            }} className="btn text-white" style={{ backgroundColor: '#b18aff' }} data-dismiss="modal">YES</button>
        </div>
    )
}
