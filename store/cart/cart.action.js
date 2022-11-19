import { createAction } from "../reducer.utils";
import { CART_ACTION_TYPES } from "./cart.types";

const cartsSave = (payload) => createAction(CART_ACTION_TYPES.CART_SAVE, payload);

export const addCart = (allCart, cart) => {
  let checkId = false;
  let checkIdProduct = false;
  let getSave = false;
  // add cart in same store or not
  allCart.forEach((c) => {
    checkId = c._id_toko === cart._id_toko;
    // check for same store
    if (checkId) {
      // add the quantity or not
      c.cart.forEach((p) => {
        checkIdProduct = p.id_product == cart.cart[0].id_product;
        // check for same product
        if (checkIdProduct) {
          p.qt += cart.cart[0].qt;
          p.total_price += cart.cart[0].total_price;
          checkIdProduct = true;
          getSave = true;
        }
      });
      if (!checkIdProduct) {
        getSave = true;
        c.cart.push(cart.cart[0]);
      }
    }
  });
  if (!getSave) {
    allCart.push(cart);
  }
  const payload = allCart;
  return (dispatch) => {
    dispatch(cartsSave(payload));
  };
};

export const deleteShopCart = (storeId, allCart) => {
  allCart = allCart.filter((c) => c._id_toko !== storeId);
  return (dispatch) => dispatch(cartsSave(allCart));
};

export const deleteCartByStore = (storeId, allCart) => {
  allCart = allCart.filter((c) => c._id_toko != storeId);
  return (dispatch) => dispatch(cartsSave(allCart));
};
