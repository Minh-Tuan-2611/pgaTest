import axios from 'axios';
import Cookies from 'js-cookie';
import { Spinner } from 'react-bootstrap';
import React, { useState } from 'react'

export default function ButtonConfirmDelete(props: any) {

    let { id, getProductList } = props;

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
                let promise = axios.post('https://api.gearfocus.div4.pgtest.co/apiAdmin/products/edit',
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
                    getProductList();
                    setLoading(false);
                })
            }} className="btn text-white" style={{ backgroundColor: '#b18aff' }} data-dismiss="modal">YES</button>

        </div>
    )
}
