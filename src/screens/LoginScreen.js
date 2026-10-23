import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { verifyAndLogin, DEMO_USERS } = useApp();

  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (activeTab === 'signup' && !name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = () => {
    setErrorMessage('');
    if (!validate()) return;

    const result = verifyAndLogin(role, email, password);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    } else {
      setErrorMessage(result.error);
      if (Platform.OS !== 'web') {
        Alert.alert('Sign In Failed', result.error);
      }
    }
  };

  const handleQuickDemo = (selectedRole) => {
    setRole(selectedRole);
    setErrorMessage('');
    setErrors({});

    let result;
    if (selectedRole === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword(DEMO_USERS.admin.password);
      result = verifyAndLogin('admin', DEMO_USERS.admin.email, DEMO_USERS.admin.password);
    } else {
      setEmail(DEMO_USERS.customer.email);
      setPassword(DEMO_USERS.customer.password);
      result = verifyAndLogin('customer', DEMO_USERS.customer.email, DEMO_USERS.customer.password);
    }

    if (result && result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Brand Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.brandBadge}>
            <Ionicons name="leaf" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>FreshCart</Text>
          <Text style={styles.brandTagline}>Farm Fresh Groceries & Daily Essentials</Text>
          <View style={styles.badgeRow}>
            <View style={styles.pillBadge}>
              <Ionicons name="sparkles" size={12} color="#15803D" style={{ marginRight: 4 }} />
              <Text style={styles.pillBadgeText}>MCA Semester III Exam</Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Ionicons name="shield-checkmark" size={12} color="#B45309" style={{ marginRight: 4 }} />
              <Text style={[styles.pillBadgeText, { color: '#B45309' }]}>Role Auth Guard</Text>
            </View>
          </View>
        </View>

        {/* 2. Main Login Card */}
        <View style={styles.loginCard}>
          {/* Tab Switcher: Sign In vs Sign Up */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signin' && styles.tabBtnActive]}
              onPress={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'signin' && styles.tabBtnTextActive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signup' && styles.tabBtnActive]}
              onPress={() => {
                setActiveTab('signup');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'signup' && styles.tabBtnTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Role Selection Section */}
          <Text style={styles.sectionLabel}>Select Your Account Role:</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                role === 'customer' && styles.roleCardActiveCustomer,
              ]}
              onPress={() => {
                setRole('customer');
                setErrorMessage('');
                if (!email || email === DEMO_USERS.admin.email) {
                  setEmail(DEMO_USERS.customer.email);
                  setPassword(DEMO_USERS.customer.password);
                }
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.roleIconCircle,
                  role === 'customer'
                    ? { backgroundColor: '#2EB053' }
                    : { backgroundColor: '#E2E8F0' },
                ]}
              >
                <Ionicons
                  name="person"
                  size={18}
                  color={role === 'customer' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <View style={styles.roleTextCol}>
                <Text
                  style={[
                    styles.roleTitle,
                    role === 'customer' && { color: '#15803D' },
                  ]}
                >
                  Customer
                </Text>
                <Text style={styles.roleSub}>Full Shopping & Wishlist</Text>
              </View>
              {role === 'customer' && (
                <Ionicons name="checkmark-circle" size={20} color="#15803D" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                role === 'admin' && styles.roleCardActiveAdmin,
              ]}
              onPress={() => {
                setRole('admin');
                setErrorMessage('');
                if (!email || email === DEMO_USERS.customer.email) {
                  setEmail(DEMO_USERS.admin.email);
                  setPassword(DEMO_USERS.admin.password);
                }
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.roleIconCircle,
                  role === 'admin'
                    ? { backgroundColor: '#D97706' }
                    : { backgroundColor: '#E2E8F0' },
                ]}
              >
                <Ionicons
                  name="shield"
                  size={18}
                  color={role === 'admin' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <View style={styles.roleTextCol}>
                <Text
                  style={[
                    styles.roleTitle,
                    role === 'admin' && { color: '#B45309' },
                  ]}
                >
                  Admin
                </Text>
                <Text style={styles.roleSub}>Management & Catalog</Text>
              </View>
              {role === 'admin' && (
                <Ionicons name="checkmark-circle" size={20} color="#B45309" />
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {activeTab === 'signup' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.name && styles.inputBoxError,
                ]}
              >
                <Ionicons name="person-outline" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Gokul"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View
              style={[
                styles.inputBox,
                (errors.email || errorMessage) && styles.inputBoxError,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder={
                  role === 'admin'
                    ? DEMO_USERS.admin.email
                    : DEMO_USERS.customer.email
                }
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  setErrorMessage('');
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View
              style={[
                styles.inputBox,
                (errors.password || errorMessage) && styles.inputBoxError,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder="Demo: 123456"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage('');
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Error Message Box */}
          {errorMessage ? (
            <View style={styles.errorAlertBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorAlertText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Primary Action Button */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              role === 'admin' ? styles.primaryBtnAdmin : styles.primaryBtnCustomer,
            ]}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {activeTab === 'signin'
                ? `Sign In as ${role === 'admin' ? 'Madhan (Admin)' : 'Gokul (Customer)'}`
                : `Create ${role === 'admin' ? 'Admin' : 'Customer'} Account`}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Exam Demo Credentials & Quick 1-Tap Login */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeaderRow}>
              <Ionicons name="flash" size={14} color="#D97706" />
              <Text style={styles.demoHeaderTitle}>EXAM QUICK 1-TAP DEMO</Text>
            </View>

            <View style={styles.demoBox}>
              <View style={styles.demoRow}>
                <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                <Text style={styles.demoRowText}>
                  <Text style={{ fontWeight: '700', color: '#15803D' }}>Customer: </Text>
                  gokul@gmail.com &bull; 123456
                </Text>
              </View>
              <View style={[styles.demoRow, { marginTop: 4 }]}>
                <Ionicons name="shield-checkmark" size={14} color="#B45309" />
                <Text style={styles.demoRowText}>
                  <Text style={{ fontWeight: '700', color: '#B45309' }}>Admin: </Text>
                  madhan@gmail.com &bull; 123456
                </Text>
              </View>
            </View>

            <View style={styles.quickBtnRow}>
              <TouchableOpacity
                style={[styles.quickBtn, styles.quickBtnCustomer]}
                onPress={() => handleQuickDemo('customer')}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={14} color="#15803D" style={{ marginRight: 6 }} />
                <Text style={styles.quickBtnCustomerText}>Login as Gokul</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickBtn, styles.quickBtnAdmin]}
                onPress={() => handleQuickDemo('admin')}
                activeOpacity={0.8}
              >
                <Ionicons name="shield" size={14} color="#B45309" style={{ marginRight: 6 }} />
                <Text style={styles.quickBtnAdminText}>Login as Madhan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            FreshCart Grocery App &bull; MCA Major Project Exam
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  heroBanner: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  roleRow: {
    gap: 10,
    marginBottom: 18,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleCardActiveCustomer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#2EB053',
  },
  roleCardActiveAdmin: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  roleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleTextCol: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  roleSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  inputBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '600',
  },
  errorAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorAlertText: {
    flex: 1,
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnCustomer: {
    backgroundColor: '#15803D',
    shadowColor: '#15803D',
  },
  primaryBtnAdmin: {
    backgroundColor: '#B45309',
    shadowColor: '#B45309',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  demoHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoRowText: {
    fontSize: 12,
    color: '#475569',
  },
  quickBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  quickBtnCustomer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  quickBtnCustomerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  quickBtnAdmin: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  quickBtnAdminText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  footerNote: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
