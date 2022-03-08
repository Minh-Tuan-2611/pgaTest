import React from 'react'
import { useSelector } from 'react-redux'

export default function Modal() {

    let {Title,Content,btnConfirm} = useSelector((state:any)=>state.componentReducer);

    return (
        <div>
            <div className="modal fade" id="modelId" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{margin:'7rem auto'}}>
                    <div className="modal-content text-white"  style={{backgroundColor: '#323259'}}>
                        <div className="modal-header">
                            <h5 className="modal-title text-white">{Title}</h5>
                            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {Content}
                        </div>
                        <div className="modal-footer" style={{justifyContent: 'space-between'}}>
                            {btnConfirm}
                            <button type="button" className="btn text-white" style={{backgroundColor:'#ff708d'}} data-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
