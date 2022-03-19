import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';

export default function ButtonConfirmDeleteUser(props: any) {
    let { id, getUserList } = props;

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
                let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit',
                    {
                        "params": [
                            {
                                "id": id,
                                "delete": 1
                            }
                        ]
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
