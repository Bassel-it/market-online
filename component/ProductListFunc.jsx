import { createAPIEndpoint } from "../api";
import { useStateContext } from "../hooks/useStateContext";

export function AddToFavorite({product}){
    const {user,showNotify, showNotifyError}=useStateContext();
    let rec = {
      itemType: "product",
      itemId: product.productId,
      userId: user.memberId,
    };
    createAPIEndpoint("Favorite")
      .post(rec)
      .then((res) => showNotify("Added successfully"))
      .catch((err) => {
        showNotifyError(err.response.data);
      });
      return(null)
  };