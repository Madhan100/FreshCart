import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    userProfile,
    userRole,
    switchRole,
    updateProfile,
    logout,
    favouriteProducts,
    cartCount,
    products,
  } = useApp();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [paymentOption, setPaymentOption] = useState(
    userProfile.paymentOption || 'UPI / Cash on Delivery'
  );

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
      setPaymentOption(userProfile.paymentOption || 'UPI / Cash on Delivery');
    }
  }, [userProfile]);

  const handleOpenDrawer = () => {
    if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleSaveProfile = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Required Fields', 'Please fill in Name, Phone and Address.');
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentOption: paymentOption.trim(),
    });
    setIsEditModalVisible(false);
  };

  const handleSignOut = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const isAdmin = userRole === 'admin';

  const handleOpenEditModal = () => {
    setName(userProfile.name || '');
    setEmail(userProfile.email || '');
    setPhone(userProfile.phone || '');
    setAddress(userProfile.address || '');
    setPaymentOption(
      userProfile.paymentOption ||
        (isAdmin ? 'Corporate Net Banking' : 'UPI / Cash on Delivery')
    );
    setIsEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with Hamburger, Title & Edit Icon */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={26} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isAdmin ? 'Admin Hub' : 'User Profile'}</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenEditModal}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Profile Hero Card */}
        <View style={[styles.greenCard, isAdmin && { backgroundColor: '#78350F' }]}>
          {/* Top Right Gear */}
          <TouchableOpacity
            style={styles.cardGearButton}
            onPress={handleOpenEditModal}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={18} color="rgba(255, 255, 255, 0.85)" />
          </TouchableOpacity>

          {/* Avatar Circle */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarCircle, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.avatarLetter, isAdmin && { color: '#B45309' }]}>
                {userProfile.avatarLetter || userProfile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.avatarBadgeCircle,
                isAdmin && { backgroundColor: '#F59E0B' },
              ]}
            >
              <Ionicons name={isAdmin ? 'shield' : 'person'} size={10} color="#FFFFFF" />
            </View>
          </View>

          {/* User Name & Email */}
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>

          {/* Verified Badge */}
          <View
            style={[
              styles.verifiedBadge,
              isAdmin && {
                backgroundColor: '#FEF3C7',
                borderColor: '#FDE68A',
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'ribbon-outline'}
              size={13}
              color={isAdmin ? '#B45309' : '#60A5FA'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.verifiedBadgeText, isAdmin && { color: '#B45309' }]}>
              {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED CUSTOMER'}
            </Text>
          </View>

          {/* Prominent Edit Profile Button on Hero Card */}
          <TouchableOpacity
            style={[
              styles.editProfileButton,
              isAdmin && { backgroundColor: '#FEF3C7' },
            ]}
            onPress={handleOpenEditModal}
            activeOpacity={0.85}
          >
            <Ionicons
              name="pencil"
              size={13}
              color={isAdmin ? '#B45309' : '#15803D'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.editProfileButtonText,
                isAdmin && { color: '#B45309' },
              ]}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Three Quick Stats Cards */}
        <View style={styles.statsRow}>
          {/* Wishlist Stat */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Wishlist')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="heart" size={16} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>{favouriteProducts.length}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </TouchableOpacity>

          {/* Cart Items Stat */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="cart" size={16} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </TouchableOpacity>

          {/* Catalog Stat */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="storefront" size={16} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Catalog</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Account & Delivery Details */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {isAdmin ? 'ADMINISTRATOR DETAILS' : 'ACCOUNT & DELIVERY DETAILS'}
          </Text>
          <TouchableOpacity onPress={handleOpenEditModal} activeOpacity={0.7}>
            <Text style={styles.sectionEditLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          {/* Phone */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIconWrapper, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Ionicons
                name="call-outline"
                size={18}
                color={isAdmin ? '#B45309' : '#15803D'}
              />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>
                {isAdmin ? 'DIRECT LINE' : 'MOBILE PHONE'}
              </Text>
              <Text style={styles.detailValue}>{userProfile.phone}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          {/* Address */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIconWrapper, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Ionicons
                name={isAdmin ? 'business-outline' : 'location-outline'}
                size={18}
                color={isAdmin ? '#B45309' : '#15803D'}
              />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>
                {isAdmin ? 'REGIONAL HUB ADDRESS' : 'DEFAULT ADDRESS'}
              </Text>
              <Text style={styles.detailValue}>{userProfile.address}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          {/* Payment Options */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIconWrapper, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Ionicons
                name="card-outline"
                size={18}
                color={isAdmin ? '#B45309' : '#15803D'}
              />
            </View>
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>
                {isAdmin ? 'ACCOUNT TYPE' : 'PAYMENT OPTIONS'}
              </Text>
              <Text style={styles.detailValue}>
                {userProfile.paymentOption ||
                  (isAdmin ? 'Corporate Net Banking' : 'UPI / Cash on Delivery')}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Menu List Actions */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenEditModal}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="create-outline" size={18} color="#16A34A" />
              </View>
              <Text style={styles.menuItemTitle}>
                {isAdmin ? 'Edit Admin Profile & Hub' : 'Edit Profile & Address'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'FreshCart 24/7 Customer Support\nEmail: support@freshcart.com\nHelpline: 1800-420-1122'
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="help-circle-outline" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* 6. Prominent Sign Out Button */}
        <View style={{ marginTop: 18, marginBottom: 30 }}>
          <TouchableOpacity
            style={styles.prominentSignOutButton}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.prominentSignOutButtonText}>Sign Out FreshCart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 7. Edit Profile Modal (Working for both Admin and Customer) */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {isAdmin ? 'Edit Administrator Profile' : 'Edit Profile & Address'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Update your contact, address and account details
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.inputField}
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>
                {isAdmin ? 'Direct Line / Mobile' : 'Mobile Phone'}
              </Text>
              <TextInput
                style={styles.inputField}
                value={phone}
                onChangeText={setPhone}
                placeholder="Mobile Phone"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>
                {isAdmin ? 'Regional Hub / Office Address' : 'Delivery Address'}
              </Text>
              <TextInput
                style={[styles.inputField, { height: 72 }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                multiline
              />

              <Text style={styles.inputLabel}>
                {isAdmin ? 'Account / Banking Option' : 'Payment Option'}
              </Text>
              <TextInput
                style={styles.inputField}
                value={paymentOption}
                onChangeText={setPaymentOption}
                placeholder="Payment Option"
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelModalButton}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveModalButton}
                  onPress={handleSaveProfile}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.saveModalButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF6',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  greenCard: {
    backgroundColor: '#16A34A',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  cardGearButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarBadgeCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F97316',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
  },
  editProfileButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionEditLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIconWrapper: {
    width: 32,
    alignItems: 'flex-start',
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    marginTop: 10,
  },
  inputField: {
    backgroundColor: '#F8FAF6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  saveModalButton: {
    flex: 2,
    backgroundColor: '#15803D',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  prominentSignOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  prominentSignOutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
