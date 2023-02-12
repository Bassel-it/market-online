import React, { createContext, useContext, useState } from 'react';
import Compressor from "compressorjs";
import { createAPIEndpoint } from '../api';

const StateContext = createContext();


// const initialState = {
//   chat: false,
//   cart: false,
//   userProfile: false,
//   notification: false,
// };

export const ContextProvider = ({ children }) => {



    const [loggedin,setLoggedin]=useState(localStorage.getItem('wasLoggedin')==='true'?true:false)
    const [user,setUser]=useState(
      localStorage.getItem('user')!=null?
      JSON.parse(localStorage.getItem('user')):{email:"",password:""})
    const [category,setCategory]=useState(localStorage.getItem('category')?JSON.parse(localStorage.getItem('category')) :[{},{},{},{},{},{}]);
    const [loading,setLoading]=useState("true");
    const [connecting,setConnecting]=useState(false);
    const [cart,setCart]=useState([]);
    const [notification,setNotification]=useState([])
    const [message,setMessage]=useState([])
    const [products,setProducts]=useState([])
    const [notify,showNotify]=useState('');
    const [notifyError,showNotifyError]=useState('');
    const [snackbarMessage,setSnackbarMessage]=useState('');
    const [sideBar, setSidebar] = React.useState(false);
    const [navbar,showNavbar]=React.useState(true);
    const [favorite,setFavorite]=useState([]);
    const [mode,setMode]=useState('light');
    const [dialog,showDialog]=useState(false);
    const [code,setCode]=useState('');
    const [confirmDialog,showConfirmDialog]=useState({text:'',confirmAction:null,object:null})
    const [headerImage,setHeaderImage]=useState('');
    const [processImage,setProcessImage]=useState(false);
    const [processState,setProcessState]=useState({ isFinish:true,text:''});
    const [compressedImage,setCompressedImage]=useState(null);
    const [searchWord,setSearchWord]=useState('');



   const CompressImageFun=(image,quality)=>{
      setProcessImage(true);
      setProcessState({ isFinish: false, text: "Proccessing Image..." });
      new Compressor(image, {
        quality: quality, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // console.log(compressedResult);
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          setCompressedImage(compressedResult)
          setProcessState({ isFinish: true, text: "click to Continue.." });

        },
      });
    };

    const AddToFav = (item) => {
      setConnecting(true);
      let rec = {
        itemType: "product",
        itemId: item.productId,
        userId: user.memberId,
      };
      createAPIEndpoint("Favorite")
        .post(rec)
        .then((res) => {
      setConnecting(false);
          
          showNotify("Added successfully")})
        .catch((err) => {
          showNotifyError(err.response.data);
      setConnecting(false);
  
        });
    };

    const removeFromFav = (e) => {
      setConnecting(true);
      setFavorite(
       (prev)=> prev.filter((x) => x.productId !== e.productId)
      );
      let rec = {
        itemType: "product",
        itemId: e.productId,
        userId: user.memberId,
      };
  
      createAPIEndpoint("Favorite")
        .deleteByContent(rec)
        .then((res) => {
          setConnecting(false);
          showNotify("removed successfully");
          // console.log(favorite);
          // nav("/product/favorite");
        })
        .catch((err) => console.log(err));
    };



    

 

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{
      loggedin,setLoggedin ,user,setUser , loading,setLoading ,connecting,setConnecting
      ,cart,setCart ,products,setProducts,notification,setNotification,
      message,setMessage ,category,setCategory,notify,showNotify,
      sideBar, setSidebar,navbar,showNavbar,snackbarMessage,setSnackbarMessage,
      favorite,setFavorite,mode,setMode,notifyError,
      showNotifyError ,dialog,showDialog,code,setCode,confirmDialog,
      showConfirmDialog,headerImage,setHeaderImage,processImage,setProcessImage,
      processState,setProcessState,CompressImageFun,compressedImage,setCompressedImage,
      searchWord,setSearchWord,AddToFav,removeFromFav
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
