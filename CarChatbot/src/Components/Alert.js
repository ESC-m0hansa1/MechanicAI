import React from 'react'

export default function Alert(props) {
    const capitalize = (word)=>{
        if(word === "danger")
            {
                word = "Error"
                const show = "alert-danger"        
            }
            else
            {
                const show = "alert-danger"
            }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
  return (
    props.alert && <div class={`alert alert-${props.alert.type}`} role="alert">
  <strong>{capitalize(props.alert.type)}</strong> : {props.alert.message}
</div>
  )
}
