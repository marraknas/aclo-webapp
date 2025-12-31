import { logout } from "../redux/slices/authSlice";
import { clearCart, fetchCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";

export const logoutAndReset =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(logout());
    dispatch(clearCart());
    const newGuestId = getState().auth.guestId;
    dispatch(fetchCart({ guestId: newGuestId }));
  };
