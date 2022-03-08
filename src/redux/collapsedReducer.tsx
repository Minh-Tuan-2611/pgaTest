const stateDefault = {
    collapsed: true,
}

export const collapsedtReducer = (state = stateDefault,action:any)=>{
    switch(action.type){
        case 'change_collapsed':{
            state.collapsed = !state.collapsed;
            return {...state}
        }
        default: return state
    }
}