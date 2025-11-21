// frontend/src/pages/CreateWishlist.jsx  (or wherever you keep it)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateWishlist = () => {
  const [title, setTitle] = useState('');
  const [gifts, setGifts] = useState([{ name: '', url: '' }]);
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Redirect to login if not authenticated
  if (!token) {
    navigate('/login');
    return null;
  }

  const handleGiftChange = (index, field, value) => {
    const updated = [...gifts];
    updated[index][field] = value;
    setGifts(updated);
  };

  const addGift = () => setGifts([...gifts, { name: '', url: '' }]);
  const removeGift = (i) => setGifts(gifts.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShareLink('');

    const validGifts = gifts
      .filter(g => g.name.trim() !== '')
      .map(g => ({ name: g.name.trim(), url: g.url.trim() || undefined }));

    if (!title.trim() || validGifts.length === 0) {
      alert('Please add a title and at least one gift!');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/wishlists/create',
        { title: title.trim(), gifts: validGifts },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const wishlistId = res.data.wishlistId;
      const link = `${window.location.origin}/wishlist/${wishlistId}`;
      setShareLink(link);

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || err.response?.data?.errors?.[0] || 'Failed to create wishlist';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Create Your Wishlist
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Wishlist Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g. My Birthday 2025, Wedding Registry"
              required
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Gifts</h3>
            {gifts.map((gift, i) => (
              <div key={i} className="flex gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Gift name *"
                  value={gift.name}
                  onChange={(e) => handleGiftChange(i, 'name', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="url"
                  placeholder="Link (optional)"
                  value={gift.url}
                  onChange={(e) => handleGiftChange(i, 'url', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                {gifts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGift(i)}
                    className="text-red-600 hover:text-red-800 text-2xl"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGift}
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              + Add another gift
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Create Wishlist & Get Share Link'}
          </button>
        </form>

        {shareLink && (
          <div className="mt-10 p-8 bg-green-50 border-2 border-green-300 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Your Wishlist is Ready!
            </h3>
            <p className="text-lg mb-4">Share this link with friends & family:</p>
            <div className="bg-white p-4 rounded border">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="w-full text-center font-mono text-indigo-700"
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWishlist;