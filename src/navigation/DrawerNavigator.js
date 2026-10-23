import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CartScreen from '../screens/CartScreen';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;
  const {
    userProfile,
    userRole,
    logout,
    cartCount,
    favouriteProducts,
  } = useApp();

  const handleLogout = () => {
    navigation.closeDrawer();
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.drawerSafe}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        {/* Brand & User Profile Header */}
        <View
          style={[
            styles.drawerHeader,
            userRole === 'admin' && { backgroundColor: '#78350F' },
          ]}
        >
          <View style={styles.brandRow}>
            <View
              style={[
                styles.logoBadge,
                userRole === 'admin' && { backgroundColor: '#F59E0B' },
              ]}
            >
              <Ionicons
                name={userRole === 'admin' ? 'shield' : 'leaf'}
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.brandName}>FreshCart</Text>
              <Text style={styles.brandTag}>
                {userRole === 'admin' ? 'Admin Control Hub' : 'Good Food, Happier You'}
              </Text>
            </View>
          </View>

          {/* User Info Card */}
          <View style={styles.userCard}>
            <View
              style={[
                styles.avatarCircle,
                userRole === 'admin' && { backgroundColor: '#FEF3C7' },
              ]}
            >
              <Text
                style={[
                  styles.avatarLetter,
                  userRole === 'admin' && { color: '#B45309' },
                ]}
              >
                {userProfile.avatarLetter || userProfile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {userProfile.name}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {userProfile.email}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  userRole === 'admin' && {
                    backgroundColor: '#FEF3C7',
                    borderColor: '#FDE68A',
                  },
                ]}
              >
                <Ionicons
                  name={userRole === 'admin' ? 'shield-checkmark' : 'person'}
                  size={10}
                  color={userRole === 'admin' ? '#B45309' : '#15803D'}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.roleBadgeText,
                    userRole === 'admin' && { color: '#B45309' },
                  ]}
                >
                  {userRole === 'admin' ? 'ADMINISTRATOR' : 'VERIFIED CUSTOMER'}
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* Navigation Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>EXPLORE FRESHCART</Text>

          {/* 1. Home */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'HomeTab' });
              navigation.closeDrawer();
            }}
          >
            <View style={[styles.menuIconBg, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="home-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Home</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* 2. Shop Catalog */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Shop' });
              navigation.closeDrawer();
            }}
          >
            <View style={[styles.menuIconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="storefront-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.menuLabel}>Shop Catalog</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* 3. Wishlist */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Wishlist' });
              navigation.closeDrawer();
            }}
          >
            <View style={[styles.menuIconBg, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="heart-outline" size={20} color="#DB2777" />
            </View>
            <Text style={styles.menuLabel}>My Wishlist</Text>
            {favouriteProducts.length > 0 && (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{favouriteProducts.length}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* 4. Cart */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Cart' });
              navigation.closeDrawer();
            }}
          >
            <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="cart-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.menuLabel}>My Cart</Text>
            {cartCount > 0 && (
              <View style={[styles.menuBadge, { backgroundColor: '#2EB053' }]}>
                <Text style={styles.menuBadgeText}>{cartCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* 5. User Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Profile' });
              navigation.closeDrawer();
            }}
          >
            <View style={[styles.menuIconBg, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="person-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.menuLabel}>User Profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Logout Option */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={[styles.menuIconBg, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </View>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerApp}>FreshCart Grocery App</Text>
          <Text style={styles.footerExam}>RVS Campus, Sulur, Coimbatore</Text>
          <Text style={styles.footerTech}>React Native &bull; Expo &bull; Web</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 300,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
      <Drawer.Screen name="FavouritesScreen" component={FavouritesScreen} />
      <Drawer.Screen name="CartScreen" component={CartScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerScroll: {
    paddingTop: 0,
  },
  drawerHeader: {
    backgroundColor: '#15803D',
    padding: 18,
    paddingTop: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2EB053',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandTag: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: '800',
    color: '#15803D',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  drawerSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  drawerSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  menuBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  footer: {
    padding: 16,
    marginTop: 10,
  },
  footerApp: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  footerExam: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  footerTech: {
    fontSize: 9,
    color: '#CBD5E1',
    marginTop: 2,
  },
});
