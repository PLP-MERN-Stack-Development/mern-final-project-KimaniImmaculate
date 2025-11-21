import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../utils/socket'; 
import axios from 'axios';


const WishlistDetail = () => {
    const { wishlistId } = useParams();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimLoading, setClaimLoading] = useState(false);
    
    const getToken = () => localStorage.getItem('token');

    const fetchWishlist = useCallback(async () => {
        try {
            const res = await axios.get(`/api/wishlists/${wishlistId}`); 
            setWishlist(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setWishlist(null);
        }
    }, [wishlistId]);

    const handleClaim = async (giftId) => {
        if (!getToken()) {
            alert('Please Log In to claim a gift!');
            return;
        }

        setClaimLoading(true);

        try {
            await axios.post(
                '/api/wishlists/claim', 
                { giftId, wishlistId },
                {
                    headers: { 'x-auth-token': getToken() },
                }
            );
        } catch (err) {
            alert('Claim failed or gift is already claimed!');
        } finally {
            setClaimLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
        
        socket.emit('join-wishlist', wishlistId);

        socket.on('gift-claimed', (data) => {
            setWishlist(prevWishlist => {
                if (!prevWishlist) return null;
                
                const updatedGifts = prevWishlist.gifts.map(gift => 
                    gift._id === data.giftId 
                        ? { ...gift, isClaimed: true, claimedByName: data.claimedByName } 
                        : gift
                );

                return { ...prevWishlist, gifts: updatedGifts };
            });
        });

        return () => {
            socket.off('gift-claimed');
            socket.emit('disconnect'); 
        };
    }, [wishlistId, fetchWishlist]);

    // Explicitly wrapped returns
    if (loading) return (<div className="text-center py-20">Loading Wishlist...</div>);
    if (!wishlist) return (<div className="text-center py-20 text-red-600">Wishlist not found!</div>);
    

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center mb-4 text-indigo-700">
                    {wishlist.title}
                </h2>
               <p className="text-center text-lg text-gray-600 mb-8">A list created by <strong>{wishlist.ownerName || 'a loved one'}</strong>.</p>

                <div className="space-y-6">
                    {wishlist.gifts.map((gift) => (
                        <div 
                            key={gift._id} 
                            className={`p-6 rounded-xl shadow-lg transition duration-300 ${
                                gift.isClaimed ? 'bg-gray-200 opacity-60' : 'bg-white hover:shadow-xl'
                            }`}
                        >
                            <h3 className={`text-2xl font-semibold mb-2 ${gift.isClaimed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {gift.name}
                            </h3>
                            
                            {gift.url && (
                                <a 
                                    href={gift.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-indigo-500 hover:text-indigo-700 text-sm block mb-4"
                                >
                                    View Product Link &rarr;
                                </a>
                            )}

                            {gift.isClaimed ? (
                                <p className="text-green-600 font-bold text-lg">
                                    ✅ CLAIMED by {gift.claimedByName || 'someone special'}
                                </p>
                            ) : (
                                <button
                                    onClick={() => handleClaim(gift._id)}
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition duration-300"
                                    disabled={claimLoading}
                                >
                                    {claimLoading ? 'Claiming...' : 'Claim This Gift'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistDetail;