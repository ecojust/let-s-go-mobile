export const queryDayListScript = `


setTimeout(()=>{
    //const res =document.querySelector('title').innerHTML;
   const res = document.querySelector('body').innerHTML;

window.ReactNativeWebView.postMessage(res);
    
    },3000)


true; // Required for Android





`;
