export const queryBodyScript = `
setTimeout(()=>{
   const res = document.querySelector('body').innerHTML;
    window.ReactNativeWebView.postMessage(res);
},3000)
true;
`;

export const queryTimeLineScript = `
setTimeout(()=>{
   const res = document.querySelector('body').innerHTML;
    window.ReactNativeWebView.postMessage(res);
},2000)
true;
`;
