const n=()=>{const e=/^(https?:\/\/)/i;return{getUploadPath:t=>t?(e.test(t),t):"",getPublicPath:t=>`/${t}`}};export{n as u};
