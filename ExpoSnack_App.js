/**
 * ============================================================================
 * FreshMart Grocery Shopping Mobile App — Single-File Standalone Version
 * MCA Semester III Major Hackathon Examination
 * Compatible with Expo Snack (https://snack.expo.dev) and standard Expo Go
 *
 * REQUIRED DEPENDENCIES FOR EXPO SNACK (Add in package.json):
 * {
 *   "@react-navigation/native": "*",
 *   "@react-navigation/native-stack": "*",
 *   "@react-navigation/bottom-tabs": "*",
 *   "@react-navigation/drawer": "*",
 *   "react-native-screens": "*",
 *   "react-native-safe-area-context": "*",
 *   "react-native-gesture-handler": "*",
 *   "react-native-reanimated": "*",
 *   "@expo/vector-icons": "*"
 * }
 * ============================================================================
 */

import 'react-native-gesture-handler';
import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// --- THEME COLORS ---
const colors = {
  primary: '#2EB053',
  primaryDark: '#1E7C3A',
  primaryLight: '#E8F7ED',
  accentYellow: '#EBB328',
  background: '#F8FAF6',
  surface: '#FFFFFF',
  textDark: '#1A202C',
  textMuted: '#718096',
  border: '#E2E8F0',
  danger: '#E53E3E',
  success: '#38A169',
};

// --- PRODUCTS DATA ---
const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks'];

const PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Banana',
    category: 'Fruits',
    price: 50,
    unit: '1 kg',
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally ripened, sweet and creamy Cavendish bananas packed with potassium, dietary fiber, and natural energy.',
    calories: '89 kcal / 100g',
    origin: 'Maharashtra, India',
    relatedIds: ['2', '3', '4'],
  },
  {
    id: '2',
    name: 'Valencia Orange',
    category: 'Fruits',
    price: 70,
    unit: '1 kg',
    rating: 4.6,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy and refreshing premium oranges loaded with Vitamin C and antioxidants. Perfect for fresh morning juice.',
    calories: '47 kcal / 100g',
    origin: 'Nagpur, India',
    relatedIds: ['1', '4', '5'],
  },
  {
    id: '3',
    name: 'Sweet Pineapple',
    category: 'Fruits',
    price: 120,
    unit: '1 pc',
    rating: 4.9,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
    description: 'Golden, tropical, and wonderfully sweet pineapple with vibrant aroma and succulent flesh.',
    calories: '50 kcal / 100g',
    origin: 'Kerala, India',
    relatedIds: ['1', '2', '6'],
  },
  {
    id: '4',
    name: 'Fresh Lemon',
    category: 'Fruits',
    price: 65,
    unit: '500 g',
    rating: 4.5,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
    description: 'Zesty, bright yellow citrus lemons packed with refreshing juice and Vitamin C.',
    calories: '29 kcal / 100g',
    origin: 'Andhra Pradesh, India',
    relatedIds: ['2', '7', '8'],
  },
  {
    id: '5',
    name: 'Kashmiri Apple',
    category: 'Fruits',
    price: 160,
    unit: '1 kg',
    rating: 4.9,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet, and deep red Kashmiri apples harvested from high altitude orchards.',
    calories: '52 kcal / 100g',
    origin: 'Kashmir, India',
    relatedIds: ['1', '2', '6'],
  },
  {
    id: '6',
    name: 'Seedless Grapes',
    category: 'Fruits',
    price: 90,
    unit: '500 g',
    rating: 4.7,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    description: 'Sweet and crisp green seedless grapes with a refreshing snap. Nutritious guilt-free treat.',
    calories: '69 kcal / 100g',
    origin: 'Nashik, India',
    relatedIds: ['1', '3', '5'],
  },
  {
    id: '7',
    name: 'Farm Fresh Tomato',
    category: 'Vegetables',
    price: 40,
    unit: '1 kg',
    rating: 4.7,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Plump, ripe, and juicy red tomatoes picked at peak maturity. Ideal for curries and fresh salads.',
    calories: '18 kcal / 100g',
    origin: 'Karnataka, India',
    relatedIds: ['8', '9', '10'],
  },
  {
    id: '8',
    name: 'Green Capsicum',
    category: 'Vegetables',
    price: 60,
    unit: '1 kg',
    rating: 4.6,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy bell peppers with a mild, fresh flavour. Adds vibrant color and snap to dishes.',
    calories: '20 kcal / 100g',
    origin: 'Tamil Nadu, India',
    relatedIds: ['7', '11', '12'],
  },
  {
    id: '9',
    name: 'Sweet Pumpkin',
    category: 'Vegetables',
    price: 35,
    unit: '1 kg',
    rating: 4.4,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?auto=format&fit=crop&w=600&q=80',
    description: 'Hearty yellow pumpkin with a mild sweet flavour and velvety texture when cooked.',
    calories: '26 kcal / 100g',
    origin: 'Kerala, India',
    relatedIds: ['7', '10', '11'],
  },
  {
    id: '10',
    name: 'Crisp Red Carrot',
    category: 'Vegetables',
    price: 50,
    unit: '1 kg',
    rating: 4.8,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    description: 'Tender and naturally sweet farm-grown red carrots. Great for halwa and salads.',
    calories: '41 kcal / 100g',
    origin: 'Punjab, India',
    relatedIds: ['7', '8', '12'],
  },
  {
    id: '11',
    name: 'Green Cabbage',
    category: 'Vegetables',
    price: 30,
    unit: '1 pc',
    rating: 4.5,
    reviewsCount: 77,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh and tightly packed green cabbage with crisp outer leaves.',
    calories: '25 kcal / 100g',
    origin: 'Ooty, India',
    relatedIds: ['8', '10', '12'],
  },
  {
    id: '12',
    name: 'Fresh Broccoli',
    category: 'Vegetables',
    price: 85,
    unit: '500 g',
    rating: 4.9,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
    description: 'Dense, dark green florets of fresh broccoli. High in dietary fiber and vitamins.',
    calories: '34 kcal / 100g',
    origin: 'Nilgiris, India',
    relatedIds: ['7', '8', '10'],
  },
];

// --- APP CONTEXT ---
const AppContext = createContext();

const DEMO_USERS = {
  admin: {
    email: 'madhan@gmail.com',
    password: '123456',
    role: 'admin',
    name: 'Madhan (Admin)',
    phone: '+91 91234 56789',
    address: 'FreshMart Regional Hub #104, Coimbatore, TN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  customer: {
    email: 'gokul@gmail.com',
    password: '123456',
    role: 'customer',
    name: 'Gokul (Customer)',
    phone: '+91 98765 43210',
    address: '42, Palm Green Avenue, Coimbatore, TN - 641028',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
};

function AppProvider({ children }) {
  const [userRole, setUserRole] = useState('customer');
  const [userProfile, setUserProfile] = useState(DEMO_USERS.customer);
  const [products] = useState(PRODUCTS);
  const [favouriteIds, setFavouriteIds] = useState(['1', '3', '7']);
  const [cart, setCart] = useState([
    { ...PRODUCTS[0], quantity: 2 },
    { ...PRODUCTS[2], quantity: 1 },
    { ...PRODUCTS[6], quantity: 3 },
  ]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const verifyAndLogin = (selectedRole, email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanRole = (selectedRole || '').trim().toLowerCase();

    if (cleanEmail === DEMO_USERS.admin.email.toLowerCase()) {
      if (cleanPass !== DEMO_USERS.admin.password) {
        return { success: false, error: 'Incorrect password for Admin account. (Demo: 123456)' };
      }
      if (cleanRole !== 'admin') {
        return { success: false, error: 'Role mismatch: madhan@gmail.com is an Admin. Please select Admin role.' };
      }
      setUserRole('admin');
      setUserProfile(DEMO_USERS.admin);
      showNotification('Logged in as Admin (Madhan)');
      return { success: true };
    }

    if (cleanEmail === DEMO_USERS.customer.email.toLowerCase()) {
      if (cleanPass !== DEMO_USERS.customer.password) {
        return { success: false, error: 'Incorrect password for Customer account. (Demo: 123456)' };
      }
      if (cleanRole !== 'customer') {
        return { success: false, error: 'Role mismatch: gokul@gmail.com is a Customer. Please select Customer role.' };
      }
      setUserRole('customer');
      setUserProfile(DEMO_USERS.customer);
      showNotification('Logged in as Customer (Gokul)');
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Demo: madhan@gmail.com (Admin) or gokul@gmail.com (Customer).' };
  };

  const logout = () => {
    setUserRole('customer');
    setUserProfile(DEMO_USERS.customer);
    showNotification('Logged out successfully', 'info');
  };

  const updateProfile = (data) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
    showNotification('Profile updated successfully!');
  };

  const toggleFavourite = (id) => {
    setFavouriteIds((prev) => {
      const exists = prev.includes(id);
      showNotification(exists ? 'Removed from favourites' : 'Added to favourites!');
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const removeFavourite = (id) => {
    setFavouriteIds((prev) => prev.filter((item) => item !== id));
    showNotification('Removed from favourites', 'info');
  };

  const isFavourite = (id) => favouriteIds.includes(id);

  const favouriteProducts = useMemo(() => {
    return products.filter((p) => favouriteIds.includes(p.id));
  }, [products, favouriteIds]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        showNotification(`Updated ${product.name} quantity to ${copy[idx].quantity}`);
        return copy;
      }
      showNotification(`Added ${product.name} to cart`);
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty >= 1 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showNotification('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared', 'info');
  };

  const cartSubtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const deliveryFee = useMemo(() => (cart.length === 0 ? 0 : cartSubtotal >= 300 ? 0 : 30), [cartSubtotal, cart.length]);
  const grandTotal = useMemo(() => (cart.length === 0 ? 0 : cartSubtotal + deliveryFee), [cartSubtotal, deliveryFee]);
  const cartCount = useMemo(() => cart.reduce((c, i) => c + i.quantity, 0), [cart]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        userProfile,
        verifyAndLogin,
        DEMO_USERS,
        logout,
        updateProfile,
        products,
        favouriteIds,
        favouriteProducts,
        toggleFavourite,
        removeFavourite,
        isFavourite,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryFee,
        grandTotal,
        cartCount,
        notification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

// --- SAFE IMAGE COMPONENT ---
function SafeImage({ source, style }) {
  const [error, setError] = useState(false);
  const uri = typeof source === 'string' ? source : source?.uri;

  if (error || !uri) {
    return (
      <View style={[style, { backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="nutrition-outline" size={28} color={colors.primary} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
}

// --- NOTIFICATION BANNER ---
function NotificationBanner() {
  const { notification } = useApp();
  if (!notification) return null;

  return (
    <View style={snackStyles.notificationBanner}>
      <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
      <Text style={snackStyles.notificationText}>{notification.message}</Text>
    </View>
  );
}

// --- SCREENS IMPLEMENTATION ---

// 1. HOME SCREEN
function HomeScreen({ navigation }) {
  const { verifyAndLogin, userRole } = useApp();
  const [role, setRole] = useState(userRole);
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loginErr, setLoginErr] = useState(null);

  const validate = () => {
    const errs = {};
    if (activeTab === 'signup' && !name.trim()) errs.name = 'Name required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email required';
    if (!password || password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    setLoginErr(null);
    if (validate()) {
      const res = verifyAndLogin(role, email, password);
      if (res.success) {
        navigation.navigate('MainDrawer', { screen: 'MainTabs', params: { screen: 'Products' } });
      } else {
        setLoginErr(res.error);
        Alert.alert('Login Failed', res.error);
      }
    }
  };

  const handleQuick = (r) => {
    setRole(r);
    setLoginErr(null);
    setErrors({});
    if (r === 'admin') {
      setEmail('madhan@gmail.com');
      setPassword('123456');
      const res = verifyAndLogin('admin', 'madhan@gmail.com', '123456');
      if (res.success) {
        navigation.navigate('MainDrawer', { screen: 'MainTabs', params: { screen: 'Products' } });
      }
    } else {
      setEmail('gokul@gmail.com');
      setPassword('123456');
      const res = verifyAndLogin('customer', 'gokul@gmail.com', '123456');
      if (res.success) {
        navigation.navigate('MainDrawer', { screen: 'MainTabs', params: { screen: 'Products' } });
      }
    }
  };

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={snackStyles.homeBanner}>
          <SafeImage
            source="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={snackStyles.homeBannerOverlay}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="leaf" size={24} color="#2EB053" style={{ marginRight: 6 }} />
              <Text style={snackStyles.brandTitle}>FreshMart</Text>
            </View>
            <Text style={{ color: '#E8F5E9', fontSize: 13, marginTop: 4 }}>Farm Fresh Grocery Delivered Daily</Text>
          </View>
        </View>

        <View style={snackStyles.homeCard}>
          <Text style={snackStyles.cardHeading}>{activeTab === 'signin' ? 'Welcome Back!' : 'Sign Up'}</Text>
          <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 14 }}>Select your user role to proceed:</Text>

          <View style={snackStyles.roleRow}>
            <TouchableOpacity
              style={[snackStyles.roleBtn, role === 'customer' && snackStyles.roleBtnActive]}
              onPress={() => { setRole('customer'); setLoginErr(null); }}
            >
              <Text style={[snackStyles.roleText, role === 'customer' && { color: '#FFF' }]}>🛒 Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[snackStyles.roleBtn, role === 'admin' && snackStyles.roleBtnAdmin]}
              onPress={() => { setRole('admin'); setLoginErr(null); }}
            >
              <Text style={[snackStyles.roleText, role === 'admin' && { color: '#FFF' }]}>🛡️ Admin</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'signup' && (
            <TextInput
              style={[snackStyles.input, errors.name && snackStyles.inputErr]}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            style={[snackStyles.input, (errors.email || loginErr) && snackStyles.inputErr]}
            placeholder={role === 'admin' ? 'madhan@gmail.com' : 'gokul@gmail.com'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(v) => { setEmail(v); setLoginErr(null); }}
          />
          <TextInput
            style={[snackStyles.input, (errors.password || loginErr) && snackStyles.inputErr]}
            placeholder="Demo Password: 123456"
            secureTextEntry
            value={password}
            onChangeText={(v) => { setPassword(v); setLoginErr(null); }}
          />

          {loginErr && (
            <View style={{ backgroundColor: '#FEE2E2', padding: 10, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '700' }}>{loginErr}</Text>
            </View>
          )}

          <TouchableOpacity style={snackStyles.primaryBtn} onPress={handleLogin}>
            <Text style={snackStyles.primaryBtnText}>Sign In as {role.toUpperCase()}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 18, borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 14 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textAlign: 'center', marginBottom: 10 }}>
              EXAM DEMO CREDENTIALS
            </Text>
            <View style={{ backgroundColor: '#F8FAFC', padding: 8, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ fontSize: 11, color: '#15803D', fontWeight: '700' }}>Customer: gokul@gmail.com | 123456</Text>
              <Text style={{ fontSize: 11, color: '#B45309', fontWeight: '700', marginTop: 2 }}>Admin: madhan@gmail.com | 123456</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[snackStyles.demoBtn, { borderColor: '#86EFAC', backgroundColor: '#F0FDF4' }]} onPress={() => handleQuick('customer')}>
                <Text style={{ color: '#15803D', fontWeight: '700', fontSize: 12 }}>Login as Gokul</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[snackStyles.demoBtn, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]} onPress={() => handleQuick('admin')}>
                <Text style={{ color: '#B45309', fontWeight: '700', fontSize: 12 }}>Login as Madhan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 2. DAILY GROCERY PRODUCTS LIST
function ProductsScreen({ navigation }) {
  const { products, cartCount, userRole, isFavourite, toggleFavourite, addToCart } = useApp();
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, search]);

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <View style={snackStyles.topHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer && navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={26} color="#0F172A" />
        </TouchableOpacity>
        <Text style={snackStyles.topHeaderTitle}>Daily Grocery Food</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ position: 'relative' }}>
          <Ionicons name="cart-outline" size={24} color="#0F172A" />
          {cartCount > 0 && (
            <View style={snackStyles.smallBadge}>
              <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginVertical: 6 }}>
        <TextInput
          style={snackStyles.searchBox}
          placeholder="Search fresh groceries..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginVertical: 6 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[snackStyles.pill, selectedCat === cat && snackStyles.pillActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[snackStyles.pillText, selectedCat === cat && { color: '#000', fontWeight: '800' }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={snackStyles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <TouchableOpacity
              style={snackStyles.favIconBtn}
              onPress={() => toggleFavourite(item.id)}
            >
              <Ionicons name={isFavourite(item.id) ? 'heart' : 'heart-outline'} size={18} color={isFavourite(item.id) ? '#EF4444' : '#94A3B8'} />
            </TouchableOpacity>

            <SafeImage source={item.image} style={{ width: '100%', height: 100, borderRadius: 12, marginBottom: 8 }} />
            <Text style={{ fontSize: 10, color: '#15803D', fontWeight: '800' }}>{item.category.toUpperCase()}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{item.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>₹{item.price}<Text style={{ fontSize: 10, color: '#64748B' }}>/{item.unit}</Text></Text>
              <TouchableOpacity
                style={snackStyles.addBtn}
                onPress={() => addToCart(item, 1)}
              >
                <Ionicons name="add" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// 3. PROFILE & EDIT PROFILE SCREEN
function ProfileScreen({ navigation }) {
  const { userProfile, updateProfile, userRole } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);

  if (userRole === 'admin') {
    return (
      <SafeAreaView style={snackStyles.screenSafe}>
        <View style={snackStyles.topHeader}>
          <TouchableOpacity onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}>
            <Ionicons name="menu-outline" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={snackStyles.topHeaderTitle}>Customer Profile</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 }}>
          <Ionicons name="lock-closed" size={60} color="#DC2626" />
          <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12 }}>Access Restricted</Text>
          <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 8, fontSize: 13 }}>
            Admin accounts cannot access Customer Profile & Edit Profile.
          </Text>
          <TouchableOpacity style={[snackStyles.primaryBtn, { marginTop: 20, paddingHorizontal: 24 }]} onPress={() => navigation.navigate('Products')}>
            <Text style={snackStyles.primaryBtnText}>Go to Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (!name || !email.includes('@') || !phone || !address) {
      Alert.alert('Validation Error', 'Please fill all fields with valid data.');
      return;
    }
    updateProfile({ name, email, phone, address });
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <View style={snackStyles.topHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}>
          <Ionicons name="menu-outline" size={26} color="#0F172A" />
        </TouchableOpacity>
        <Text style={snackStyles.topHeaderTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons name={isEditing ? 'close' : 'create-outline'} size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={snackStyles.profileCard}>
          <SafeImage source={userProfile.avatar} style={{ width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginBottom: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: '800', textAlign: 'center', color: '#0F172A' }}>{userProfile.name}</Text>
          <Text style={{ fontSize: 12, color: '#15803D', fontWeight: '800', textAlign: 'center', marginTop: 2 }}>{userRole.toUpperCase()} USER</Text>

          <View style={{ marginTop: 18 }}>
            <Text style={snackStyles.label}>Full Name</Text>
            {isEditing ? <TextInput style={snackStyles.input} value={name} onChangeText={setName} /> : <Text style={snackStyles.valText}>{userProfile.name}</Text>}

            <Text style={snackStyles.label}>Email Address</Text>
            {isEditing ? <TextInput style={snackStyles.input} value={email} onChangeText={setEmail} autoCapitalize="none" /> : <Text style={snackStyles.valText}>{userProfile.email}</Text>}

            <Text style={snackStyles.label}>Phone Number</Text>
            {isEditing ? <TextInput style={snackStyles.input} value={phone} onChangeText={setPhone} /> : <Text style={snackStyles.valText}>{userProfile.phone}</Text>}

            <Text style={snackStyles.label}>Delivery Address</Text>
            {isEditing ? <TextInput style={[snackStyles.input, { height: 70 }]} multiline value={address} onChangeText={setAddress} /> : <Text style={snackStyles.valText}>{userProfile.address}</Text>}

            {isEditing && (
              <TouchableOpacity style={snackStyles.primaryBtn} onPress={handleSave}>
                <Text style={snackStyles.primaryBtnText}>Save Profile Changes</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                snackStyles.primaryBtn,
                {
                  backgroundColor: '#FEF2F2',
                  borderWidth: 1.5,
                  borderColor: '#FCA5A5',
                  marginTop: 14,
                },
              ]}
              onPress={() => {
                logout();
                navigation.navigate('MainTabs', { screen: 'HomeTab' });
              }}
            >
              <Text style={{ color: '#DC2626', fontWeight: '800', fontSize: 14 }}>
                Sign Out FreshMart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 4. CUSTOMER FAVOURITES SCREEN
function FavouritesScreen({ navigation }) {
  const { favouriteProducts, removeFavourite, addToCart, userRole } = useApp();

  if (userRole === 'admin') {
    return (
      <SafeAreaView style={snackStyles.screenSafe}>
        <View style={snackStyles.topHeader}>
          <TouchableOpacity onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={snackStyles.topHeaderTitle}>Favourites</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 }}>
          <Ionicons name="lock-closed" size={60} color="#DC2626" />
          <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12 }}>Access Restricted</Text>
          <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 8, fontSize: 13 }}>
            Admin accounts cannot access Customer Favourites.
          </Text>
          <TouchableOpacity style={[snackStyles.primaryBtn, { marginTop: 20, paddingHorizontal: 24 }]} onPress={() => navigation.navigate('Products')}>
            <Text style={snackStyles.primaryBtnText}>Go to Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <View style={snackStyles.topHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={snackStyles.topHeaderTitle}>Favourites</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={favouriteProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80, padding: 20 }}>
            <Ionicons name="heart-dislike-outline" size={60} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10 }}>No Favourites Yet</Text>
            <TouchableOpacity style={[snackStyles.primaryBtn, { marginTop: 16 }]} onPress={() => navigation.navigate('Products')}>
              <Text style={snackStyles.primaryBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={snackStyles.productCard}>
            <TouchableOpacity style={snackStyles.favIconBtn} onPress={() => removeFavourite(item.id)}>
              <Ionicons name="heart" size={18} color="#EF4444" />
            </TouchableOpacity>
            <SafeImage source={item.image} style={{ width: '100%', height: 100, borderRadius: 12, marginBottom: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700' }} numberOfLines={1}>{item.name}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', marginVertical: 4 }}>₹{item.price}</Text>
            <TouchableOpacity style={snackStyles.addBtnWide} onPress={() => addToCart(item, 1)}>
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// 5. PRODUCT DETAILS SCREEN
function ProductDetailsScreen({ navigation, route }) {
  const { products, isFavourite, toggleFavourite, addToCart } = useApp();
  const product = route.params?.product || products[0];
  const [qty, setQty] = useState(1);

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <View style={snackStyles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={snackStyles.topHeaderTitle}>Details</Text>
        <TouchableOpacity onPress={() => toggleFavourite(product.id)}>
          <Ionicons name={isFavourite(product.id) ? 'heart' : 'heart-outline'} size={24} color={isFavourite(product.id) ? '#EF4444' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        <SafeImage source={product.image} style={{ width: '100%', height: 220, borderRadius: 20, marginBottom: 14 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A' }}>{product.name}</Text>
            <Text style={{ color: '#16A34A', fontSize: 12, fontWeight: '700' }}>{product.category}</Text>
          </View>
          <View style={snackStyles.qtyPicker}>
            <TouchableOpacity onPress={() => qty > 1 && setQty(qty - 1)}>
              <Ionicons name="remove" size={16} color="#0F172A" />
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 12, fontWeight: '800' }}>{qty} {product.unit.includes('kg') ? 'kg' : 'pc'}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)}>
              <Ionicons name="add" size={16} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 6 }}>Description</Text>
        <Text style={{ color: '#475569', fontSize: 13, lineHeight: 18 }}>{product.description}</Text>
      </ScrollView>

      <View style={snackStyles.bottomSticky}>
        <View>
          <Text style={{ fontSize: 11, color: '#64748B' }}>Total Price</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>₹{product.price * qty}</Text>
        </View>
        <TouchableOpacity style={snackStyles.bottomCta} onPress={() => addToCart(product, qty)}>
          <Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 6. MY CART SCREEN
function CartScreen({ navigation }) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, deliveryFee, grandTotal, userProfile } = useApp();
  const [modal, setModal] = useState(false);

  return (
    <SafeAreaView style={snackStyles.screenSafe}>
      <View style={snackStyles.topHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={snackStyles.topHeaderTitle}>My Cart</Text>
        {cart.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        ) : <View style={{ width: 22 }} />}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Ionicons name="cart-outline" size={60} color="#CBD5E1" />
            <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10 }}>Your Cart is Empty</Text>
            <TouchableOpacity style={[snackStyles.primaryBtn, { marginTop: 16 }]} onPress={() => navigation.navigate('Products')}>
              <Text style={snackStyles.primaryBtnText}>Browse Groceries</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={snackStyles.cartItem}>
            <SafeImage source={item.image} style={{ width: 64, height: 64, borderRadius: 10 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '700' }} numberOfLines={1}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>₹{item.price} /{item.unit}</Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#15803D' }}>Subtotal: ₹{item.price * item.quantity}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 64 }}>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
              <View style={snackStyles.qtyPillSmall}>
                <TouchableOpacity onPress={() => updateCartQuantity(item.id, -1)}>
                  <Ionicons name="remove" size={12} color="#000" />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8, fontWeight: '800', fontSize: 12 }}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateCartQuantity(item.id, 1)}>
                  <Ionicons name="add" size={12} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          cart.length > 0 ? (
            <View style={snackStyles.billCard}>
              <Text style={{ fontSize: 15, fontWeight: '800', marginBottom: 8 }}>Bill Details</Text>
              <View style={snackStyles.billRow}><Text>Subtotal</Text><Text style={{ fontWeight: '700' }}>₹{cartSubtotal}</Text></View>
              <View style={snackStyles.billRow}><Text>Delivery Fee</Text><Text style={{ fontWeight: '700' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text></View>
              <View style={[snackStyles.billRow, { borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 8, marginTop: 4 }]}>
                <Text style={{ fontWeight: '800' }}>Grand Total</Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#15803D' }}>₹{grandTotal}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {cart.length > 0 && (
        <View style={snackStyles.bottomSticky}>
          <View>
            <Text style={{ fontSize: 11, color: '#64748B' }}>Total Amount</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>₹{grandTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={snackStyles.bottomCta} onPress={() => setModal(true)}>
            <Text style={{ color: '#000', fontWeight: '900', fontSize: 15 }}>Book Now &gt;&gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modal} transparent animationType="slide">
        <View style={snackStyles.modalOverlay}>
          <View style={snackStyles.modalBox}>
            <Ionicons name="checkmark-circle" size={60} color="#2EB053" />
            <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10 }}>Order Confirmed!</Text>
            <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginVertical: 10 }}>
              Order #FM-{Math.floor(100000 + Math.random() * 900000)} placed for ₹{grandTotal}. Delivering to {userProfile.address}.
            </Text>
            <TouchableOpacity style={snackStyles.primaryBtn} onPress={() => { setModal(false); clearCart(); navigation.navigate('Products'); }}>
              <Text style={snackStyles.primaryBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- NAVIGATION HIERARCHY ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabsNav() {
  const { cartCount, favouriteProducts, userRole } = useApp();
  const isCustomer = userRole === 'customer';

  return (
    <Tab.Navigator
      initialRouteName="Products"
      screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: '#94A3B8' }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: 'Products', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} /> }}
      />
      {isCustomer && (
        <Tab.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{
            tabBarLabel: 'Favourite',
            tabBarBadge: favouriteProducts.length > 0 ? favouriteProducts.length : undefined,
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />,
          }}
        />
      )}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'cart' : 'cart-outline'} size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function CustomDrawer(props) {
  const { userProfile, userRole, logout } = useApp();
  const isCustomer = userRole === 'customer';

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 18, borderBottomWidth: 1, borderColor: '#E2E8F0' }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: colors.primaryDark }}>FreshMart</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', marginTop: 6 }}>{userProfile.name}</Text>
        <Text style={{ fontSize: 11, color: '#64748B' }}>{userProfile.email}</Text>
        <Text style={{ fontSize: 10, fontWeight: '800', color: userRole === 'admin' ? '#B45309' : '#15803D', marginTop: 4 }}>
          {userRole.toUpperCase()} ROLE
        </Text>
      </View>
      <TouchableOpacity style={snackStyles.drawerItem} onPress={() => props.navigation.navigate('MainTabs', { screen: 'HomeTab' })}>
        <Text style={snackStyles.drawerLabel}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={snackStyles.drawerItem} onPress={() => props.navigation.navigate('MainTabs', { screen: 'Products' })}>
        <Text style={snackStyles.drawerLabel}>🥦 Daily Products</Text>
      </TouchableOpacity>
      {isCustomer && (
        <TouchableOpacity style={snackStyles.drawerItem} onPress={() => props.navigation.navigate('ProfileScreen')}>
          <Text style={snackStyles.drawerLabel}>👤 My Profile</Text>
        </TouchableOpacity>
      )}
      {isCustomer && (
        <TouchableOpacity style={snackStyles.drawerItem} onPress={() => props.navigation.navigate('MainTabs', { screen: 'Favourites' })}>
          <Text style={snackStyles.drawerLabel}>❤️ Favourites</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={snackStyles.drawerItem} onPress={() => props.navigation.navigate('MainTabs', { screen: 'Cart' })}>
        <Text style={snackStyles.drawerLabel}>🛒 My Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={snackStyles.drawerItem}
        onPress={() => {
          logout();
          props.navigation.navigate('MainTabs', { screen: 'HomeTab' });
        }}
      >
        <Text style={[snackStyles.drawerLabel, { color: '#EF4444' }]}>🚪 Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function DrawerNav() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="MainTabs" component={TabsNav} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// --- ROOT APP ---
export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F8FAF6' }}>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainDrawer" component={DrawerNav} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
          </Stack.Navigator>
          <NotificationBanner />
          <StatusBar style="dark" />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

// --- STYLES ---
const snackStyles = StyleSheet.create({
  screenSafe: { flex: 1, backgroundColor: '#F8FAF6' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  topHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  homeBanner: { height: 180, width: '100%', position: 'relative' },
  homeBannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(21, 128, 61, 0.5)', justifyContent: 'flex-end', padding: 18 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  homeCard: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, padding: 20 },
  cardHeading: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  roleBtn: { flex: 1, padding: 10, backgroundColor: '#F1F5F9', borderRadius: 10, alignItems: 'center' },
  roleBtnActive: { backgroundColor: colors.primary },
  roleBtnAdmin: { backgroundColor: '#D97706' },
  roleText: { fontWeight: '700', fontSize: 13, color: '#334155' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#F8FAFC' },
  inputErr: { borderColor: '#EF4444' },
  primaryBtn: { backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  demoBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  searchBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#E2E8F0' },
  pillActive: { backgroundColor: colors.accentYellow },
  pillText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  productCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 10, margin: 6, borderWidth: 1, borderColor: '#F0F4EC', elevation: 2 },
  favIconBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 4 },
  addBtn: { backgroundColor: colors.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  addBtnWide: { backgroundColor: colors.primary, paddingVertical: 6, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  smallBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  profileCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 8, marginBottom: 2 },
  valText: { fontSize: 14, fontWeight: '600', color: '#0F172A', paddingVertical: 4 },
  qtyPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 6 },
  bottomSticky: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#E2E8F0' },
  bottomCta: { backgroundColor: colors.accentYellow, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14 },
  cartItem: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 10, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  qtyPillSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4 },
  billCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginTop: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', width: '100%' },
  drawerItem: { padding: 14, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  drawerLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  notificationBanner: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#15803D', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', zIndex: 9999 },
  notificationText: { color: '#FFF', fontSize: 13, fontWeight: '700', flex: 1 },
});
