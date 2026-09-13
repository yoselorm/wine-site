import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, Package } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../../redux/cartSlice';
import { fetchSuburbs } from '../../redux/suburbSlice';
import { fetchPickupLocations } from '../../redux/pickupLocationSlice';
import { fetchAddresses } from '../../redux/addressSlice';
import { createOrder } from '../../redux/orderSlice';
import { createGuestOrder } from '../../redux/guestOrderSlice';
import toast from '../../components/Toast';

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors"
    />
  </div>
);

const FulfilmentToggle = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    <button
      type="button"
      onClick={() => onChange('delivery')}
      className={`flex items-center gap-3 p-4 border rounded-md text-left transition-colors ${
        value === 'delivery' ? 'border-forest bg-forest/5' : 'border-zinc-200 hover:border-zinc-400'
      }`}
    >
      <Truck size={20} className={value === 'delivery' ? 'text-forest' : 'text-zinc-400'} />
      <div>
        <p className="text-sm font-medium text-zinc-900">Delivery</p>
        <p className="text-xs text-zinc-400">To your address</p>
      </div>
    </button>
    <button
      type="button"
      onClick={() => onChange('pickup')}
      className={`flex items-center gap-3 p-4 border rounded-md text-left transition-colors ${
        value === 'pickup' ? 'border-forest bg-forest/5' : 'border-zinc-200 hover:border-zinc-400'
      }`}
    >
      <Package size={20} className={value === 'pickup' ? 'text-forest' : 'text-zinc-400'} />
      <div>
        <p className="text-sm font-medium text-zinc-900">Pickup</p>
        <p className="text-xs text-zinc-400">Collect in person</p>
      </div>
    </button>
  </div>
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { items: suburbs } = useSelector((state) => state.suburbs);
  const { items: pickupLocations } = useSelector((state) => state.pickupLocations);
  const { items: savedAddresses } = useSelector((state) => state.addresses);
  const { placing: guestPlacing, placeError: guestPlaceError } = useSelector((state) => state.guestOrder);
  const { checkoutLoading: authPlacing, checkoutError: authPlaceError } = useSelector((state) => state.orders);

  const [fulfilmentMethod, setFulfilmentMethod] = useState('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [guestForm, setGuestForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    suburb_id: '',
    address_line_1: '',
    city: '',
    ghana_post_gps: '',
  });
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const placing = isAuthenticated ? authPlacing : guestPlacing;
  const placeError = isAuthenticated ? authPlaceError : guestPlaceError;

  useEffect(() => {
    dispatch(fetchSuburbs());
    dispatch(fetchPickupLocations());
    if (isAuthenticated) dispatch(fetchAddresses());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !selectedAddressId && savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [isAuthenticated, savedAddresses, selectedAddressId]);

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestForm((prev) => ({ ...prev, [name]: value }));
  };

  const items = cartItems.map((i) => ({ product_id: i.id, variant_id: null, quantity: i.quantity }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fulfilmentMethod === 'pickup' && !selectedPickupId) {
      toast.error('Please select a pickup location');
      return;
    }

    if (isAuthenticated) {
      if (fulfilmentMethod === 'delivery' && !selectedAddressId) {
        toast.error('Please select a delivery address');
        return;
      }

      const result = await dispatch(
        createOrder({
          customer_address_id: fulfilmentMethod === 'delivery' ? selectedAddressId : undefined,
          fulfilment_method: fulfilmentMethod,
          pickup_location_id: fulfilmentMethod === 'pickup' ? selectedPickupId : undefined,
          payment_token: null,
          notes: notes || null,
          coupon_code: couponCode || null,
          items,
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(clearCart());
        navigate('/order-confirmation', { state: { order: result.payload?.data || result.payload } });
      } else {
        toast.error(result.payload || 'Checkout failed');
      }
    } else {
      if (!guestForm.guest_name || !guestForm.guest_email || !guestForm.guest_phone) {
        toast.error('Please fill in your contact details');
        return;
      }
      if (fulfilmentMethod === 'delivery' && (!guestForm.suburb_id || !guestForm.address_line_1 || !guestForm.city)) {
        toast.error('Please complete your delivery address');
        return;
      }

      const payload = {
        guest_name: guestForm.guest_name,
        guest_email: guestForm.guest_email,
        guest_phone: guestForm.guest_phone,
        fulfilment_method: fulfilmentMethod,
        coupon_code: couponCode || null,
        notes: notes || null,
        items,
      };

      if (fulfilmentMethod === 'delivery') {
        payload.suburb_id = guestForm.suburb_id;
        payload.address_line_1 = guestForm.address_line_1;
        payload.city = guestForm.city;
        payload.ghana_post_gps = guestForm.ghana_post_gps || null;
      } else {
        payload.pickup_location_id = selectedPickupId;
      }

      const result = await dispatch(createGuestOrder(payload));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(clearCart());
        navigate('/order-confirmation', { state: { order: result.payload } });
      } else {
        toast.error(result.payload || 'Checkout failed');
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-32 text-center px-6">
        <h1 className="font-serif text-2xl text-zinc-900 mb-3">Your cart is empty</h1>
        <p className="text-zinc-500 font-light mb-8">Add something to your cart before checking out.</p>
        <Link
          to="/shop"
          className="bg-forest text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-10 border-b border-zinc-200 pb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {!isAuthenticated && (
              <div className="mb-10">
                <h2 className="font-serif text-xl text-zinc-900 mb-5">Contact Details</h2>
                <div className="space-y-4">
                  <Field label="Full Name" name="guest_name" required value={guestForm.guest_name} onChange={handleGuestChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Email Address"
                      name="guest_email"
                      type="email"
                      required
                      value={guestForm.guest_email}
                      onChange={handleGuestChange}
                    />
                    <Field label="Phone Number" name="guest_phone" required value={guestForm.guest_phone} onChange={handleGuestChange} />
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-3">
                  Already have an account?{' '}
                  <Link to="/login" className="text-forest font-medium hover:text-forest-dark transition-colors">
                    Log in
                  </Link>{' '}
                  to check out faster.
                </p>
              </div>
            )}

            <h2 className="font-serif text-xl text-zinc-900 mb-5">Fulfilment</h2>
            <FulfilmentToggle value={fulfilmentMethod} onChange={setFulfilmentMethod} />

            {fulfilmentMethod === 'delivery' ? (
              isAuthenticated ? (
                <div className="mb-10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Delivery Address</h3>
                  {savedAddresses.length === 0 ? (
                    <div className="border border-zinc-200 rounded-md p-6 text-center">
                      <p className="text-sm text-zinc-500 mb-4">You have no saved addresses yet.</p>
                      <Link
                        to="/user/addresses"
                        className="text-[11px] font-bold uppercase tracking-widest text-forest border-b border-forest pb-1 hover:text-forest-dark hover:border-forest-dark transition-colors"
                      >
                        Add an Address
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedAddresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                            selectedAddressId === address.id ? 'border-forest bg-forest/5' : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="accent-forest w-4 h-4 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{address.full_name}</p>
                            <p className="text-sm text-zinc-500">
                              {address.address_line1}, {[address.city, address.region].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-10 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Delivery Address</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Suburb</label>
                    <select
                      name="suburb_id"
                      required
                      value={guestForm.suburb_id}
                      onChange={handleGuestChange}
                      className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors bg-white"
                    >
                      <option value="">Select your suburb</option>
                      {suburbs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="Address Line"
                    name="address_line_1"
                    required
                    value={guestForm.address_line_1}
                    onChange={handleGuestChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City" name="city" required value={guestForm.city} onChange={handleGuestChange} />
                    <Field
                      label="Ghana Post GPS (Optional)"
                      name="ghana_post_gps"
                      value={guestForm.ghana_post_gps}
                      onChange={handleGuestChange}
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Pickup Location</h3>
                {pickupLocations.length === 0 ? (
                  <p className="text-sm text-zinc-500">No pickup locations available right now.</p>
                ) : (
                  <div className="space-y-3">
                    {pickupLocations.map((loc) => (
                      <label
                        key={loc.id}
                        className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedPickupId === loc.id ? 'border-forest bg-forest/5' : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickup"
                          checked={selectedPickupId === loc.id}
                          onChange={() => setSelectedPickupId(loc.id)}
                          className="accent-forest w-4 h-4 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{loc.name}</p>
                          <p className="text-sm text-zinc-500">{loc.address_line_1}</p>
                          {loc.opening_hours && <p className="text-xs text-zinc-400 mt-1">{loc.opening_hours}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Order Notes (Optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Delivery instructions, gift notes, etc."
                className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors resize-none"
              />
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white border border-zinc-200 p-8 sticky top-24">
              <h2 className="font-serif text-xl text-zinc-900 mb-6">Order Summary</h2>

              <div className="divide-y divide-zinc-100 mb-6 max-h-72 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-900 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-400">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm text-zinc-700 shrink-0">GHS {(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Coupon Code</label>
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors"
                />
              </div>

              <div className="flex justify-between font-serif text-xl text-zinc-900 mb-6 pt-4 border-t border-zinc-100">
                <span>Subtotal</span>
                <span>GHS {cartTotal.toFixed(2)}</span>
              </div>

              {placeError && <p className="text-xs text-wine mb-4">{placeError}</p>}

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-forest text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
