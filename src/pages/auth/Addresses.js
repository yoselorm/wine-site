import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Pencil, Trash2, Plus, Star } from 'lucide-react';
import { fetchAddresses, deleteAddress } from '../../redux/addressSlice';
import AddressFormModal from '../../components/auth/AddressFormModal';
import toast from '../../components/Toast';

const Addresses = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.addresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success('Address removed');
    } catch (err) {
      toast.error(err || 'Failed to remove address');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 bg-zinc-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <p className="text-wine mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchAddresses())}
          className="text-xs font-bold uppercase tracking-widest border-b border-forest pb-1 hover:text-forest transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end justify-between mb-10 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">My Addresses</h1>
          <p className="text-sm text-zinc-500 font-light">
            {items.length} {items.length === 1 ? 'address' : 'addresses'} saved
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-forest text-white px-5 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 shrink-0"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-zinc-200 rounded-xl">
          <MapPin size={40} strokeWidth={1} className="text-zinc-300 mb-6" />
          <h2 className="text-xl font-serif text-zinc-900 mb-3">No addresses yet</h2>
          <p className="text-zinc-500 font-light max-w-sm mb-8">
            Add a delivery address so we know where to bring your wine.
          </p>
          <button
            onClick={handleAddNew}
            className="bg-forest text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((address) => (
            <div key={address.id} className="bg-white border border-zinc-200 rounded-xl p-6 relative">
              {address.is_default && (
                <span className="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                  <Star size={11} className="fill-gold" /> Default
                </span>
              )}
              <p className="text-[11px] font-bold uppercase tracking-widest text-forest mb-2">{address.label || 'Address'}</p>
              <p className="font-serif text-lg text-zinc-900 mb-1">{address.full_name}</p>
              <p className="text-sm text-zinc-500 font-light mb-1">{address.address_line1}</p>
              {address.address_line2 && <p className="text-sm text-zinc-500 font-light mb-1">{address.address_line2}</p>}
              <p className="text-sm text-zinc-500 font-light mb-1">{[address.city, address.region].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-zinc-500 font-light mb-5">{address.phone}</p>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-forest transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-wine transition-colors"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} existingAddress={editingAddress} />
    </div>
  );
};

export default Addresses;
