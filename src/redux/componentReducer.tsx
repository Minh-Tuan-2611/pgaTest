import ButtonConfirmLogout from "../modules/ButtonConfirm/ButtonConfirmLogout"

const stateDefault = {
    Title: '',
    Content:'',
    btnConfirm:<ButtonConfirmLogout/>
}

export const componentReducer = (state = stateDefault,action:any)=>{
    switch(action.type){
        case 'change_modal':{
            state.Title = action.title;
            state.Content = action.content;
            state.btnConfirm = action.button;
            return {...state}
        }
        default: return state
    }
}