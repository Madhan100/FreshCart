import React, { createContext, useContext, useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';

const AppContext = createContext();

export const DEMO_USERS = {
  customer: {
    email: 'gokul@gmail.com',
    password: '123456',
    role: 'customer',
    name: 'Gokul (Customer)',
    phone: '+91 98765 43210',
    address: '42, Palm Green Avenue, Coimbatore, TN - 641028',
    paymentOption: 'UPI / Cash on Delivery',
    isVerified: true,
    avatarLetter: 'G',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  admin: {
    email: 'madhan@gmail.com',
    password: '123456',
    role: 'admin',
    name: 'Madhan (Admin)',
    phone: '+91 91234 56789',
    address: 'FreshCart Regional Hub #104, Sulur, Coimbatore',
    paymentOption: 'Corporate Net Banking',
    isVerified: true,
    avatarLetter: 'M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
};

export const AppProvider = ({ children }) => {
  // Authentication & Role
  const [userRole, setUserRole] = useState('customer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(DEMO_USERS.customer);

  // Products catalog (15 items)
  const [products] = useState(PRODUCTS);

  // Favourites list: initialized with Bananas ('1') and Tomatoes ('3') => 2 items matching photos
  const [favouriteIds, setFavouriteIds] = useState(['1', '3']);

  // Cart: initialized with 0 items matching photos
  const [cart, setCart] = useState([]);

  // Orders history
  const [orders, setOrders] = useState([]);

  // Toast / Banner notification state
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const verifyAndLogin = (selectedRole, email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanRole = (selectedRole || '').trim().toLowerCase();

    // 1. Admin Account Check
    if (cleanEmail === DEMO_USERS.admin.email.toLowerCase()) {
      if (cleanPass !== DEMO_USERS.admin.password) {
        return {
          success: false,
          error: 'Incorrect password for Admin account. (Demo password: 123456)',
        };
      }
      if (cleanRole !== 'admin') {
        return {
          success: false,
          error:
            'Role mismatch: madhan@gmail.com is an Admin account. Please select the Admin role to sign in.',
        };
      }
      setUserRole('admin');
      setIsAuthenticated(true);
      setUserProfile(DEMO_USERS.admin);
      showNotification('Logged in as Admin (Madhan)');
      return { success: true };
    }

    // 2. Customer Account Check
    if (cleanEmail === DEMO_USERS.customer.email.toLowerCase()) {
      if (cleanPass !== DEMO_USERS.customer.password) {
        return {
          success: false,
          error: 'Incorrect password for Customer account. (Demo password: 123456)',
        };
      }
      if (cleanRole !== 'customer') {
        return {
          success: false,
          error:
            'Role mismatch: gokul@gmail.com is a Customer account. Please select the Customer role to sign in.',
        };
      }
      setUserRole('customer');
      setIsAuthenticated(true);
      setUserProfile(DEMO_USERS.customer);
      showNotification('Logged in as Customer (Gokul)');
      return { success: true };
    }

    return {
      success: false,
      error:
        'Invalid email address. Demo accounts are: madhan@gmail.com (Admin) or gokul@gmail.com (Customer).',
    };
  };

  const login = (role, email, name) => {
    const targetUser = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.customer;
    setUserRole(role);
    setIsAuthenticated(true);
    setUserProfile({
      ...targetUser,
      email: email || targetUser.email,
      name: name || targetUser.name,
    });
    showNotification(`Logged in as ${name || targetUser.name}`);
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setUserRole('admin');
      setUserProfile(DEMO_USERS.admin);
      showNotification('Switched to Admin (Madhan)');
    } else {
      setUserRole('customer');
      setUserProfile(DEMO_USERS.customer);
      showNotification('Switched to Customer (Gokul)');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('customer');
    setUserProfile(DEMO_USERS.customer);
    showNotification('Signed out successfully', 'info');
  };

  const updateProfile = (updatedData) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updatedData,
      avatarLetter: updatedData.name
        ? updatedData.name.trim().charAt(0).toUpperCase()
        : prev.avatarLetter,
    }));
    showNotification('Profile updated successfully!');
  };

  // --- Favourites Handlers ---
  const toggleFavourite = (productId) => {
    setFavouriteIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const removeFavourite = (productId) => {
    setFavouriteIds((prev) => prev.filter((id) => id !== productId));
    showNotification('Removed from wishlist', 'info');
  };

  const isFavourite = (productId) => favouriteIds.includes(productId);

  const favouriteProducts = useMemo(() => {
    return products.filter((p) => favouriteIds.includes(p.id));
  }, [products, favouriteIds]);

  // --- Cart Handlers ---
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        showNotification(`Updated ${product.name} quantity to ${updated[existingIndex].quantity}`);
        return updated;
      } else {
        showNotification(`Added ${quantity} × ${product.name} to cart!`);
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const addAllWishlistToCart = () => {
    if (favouriteProducts.length === 0) return;
    setCart((prevCart) => {
      let updated = [...prevCart];
      favouriteProducts.forEach((favItem) => {
        const existingIndex = updated.findIndex((item) => item.id === favItem.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
        } else {
          updated.push({ ...favItem, quantity: 1 });
        }
      });
      return updated;
    });
    showNotification(`Added all ${favouriteProducts.length} saved items to cart!`);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((p) => p.id === productId);
      if (item) {
        showNotification(`Removed ${item.name} from cart`, 'info');
      }
      return prevCart.filter((p) => p.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared', 'info');
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Delivery free for orders over 500
  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 500 ? 0 : 40;
  }, [cartSubtotal, cart.length]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal + deliveryFee;
  }, [cartSubtotal, deliveryFee]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const placeOrder = () => {
    if (cart.length === 0) return false;
    const newOrder = {
      orderId: 'FC-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      total: grandTotal,
      customer: userProfile.name,
      address: userProfile.address,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
        login,
        logout,
        verifyAndLogin,
        switchRole,
        DEMO_USERS,
        updateProfile,

        notification,
        showNotification,

        products,

        favouriteIds,
        favouriteProducts,
        toggleFavourite,
        removeFavourite,
        isFavourite,
        addAllWishlistToCart,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryFee,
        grandTotal,
        cartCount,
        placeOrder,
        orders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
