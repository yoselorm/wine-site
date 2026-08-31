import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { addAddress, updateAddress } from '../../redux/addressSlice';
import toast from '../Toast';

const emptyForm = {
  label: '',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  region: '',
  is_default: false,
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors"
    />
  </div>
);

const AddressFormModal = ({ isOpen, onClose, existingAddress }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));
      setForm(existingAddress ? { ...emptyForm, ...existingAddress } : emptyForm);
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [isOpen, existingAddress]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (existingAddress?.id) {
        await dispatch(updateAddress({ id: existingAddress.id, ...form })).unwrap();
        toast.success('Address updated');
      } else {
        await dispatch(addAddress(form)).unwrap();
        toast.success('Address added');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`bg-white w-full max-w-lg p-8 relative z-50 rounded-xl shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-forest transition-colors">
          <X size={18} />
        </button>

        <h2 className="text-2xl font-serif text-zinc-900 mb-1">{existingAddress ? 'Edit Address' : 'Add New Address'}</h2>
        <p className="text-xs text-zinc-400 mb-8">Where should we deliver your wine?</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Label" name="label" value={form.label} onChange={handleChange} placeholder="Home, Work..." />
            <Field label="Full Name" name="full_name" required value={form.full_name} onChange={handleChange} />
          </div>

          <Field label="Phone Number" name="phone" required value={form.phone} onChange={handleChange} />
          <Field label="Address Line 1" name="address_line1" required value={form.address_line1} onChange={handleChange} />
          <Field label="Address Line 2 (Optional)" name="address_line2" value={form.address_line2} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="City" name="city" required value={form.city} onChange={handleChange} />
            <Field label="Region" name="region" value={form.region} onChange={handleChange} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
              className="accent-forest w-4 h-4"
            />
            <span className="text-sm text-zinc-600">Set as default address</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-forest text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddressFormModal;
