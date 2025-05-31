export const queryDayListScript = `
setTimeout(()=>{
   const res = document.querySelector('body').innerHTML;
    window.ReactNativeWebView.postMessage(res);
},3000)
true;
`;

export const queryStationScript = `
setTimeout(()=>{
   const res = document.querySelector('body').innerHTML;
    window.ReactNativeWebView.postMessage(res);
},3000)
true;
`;
