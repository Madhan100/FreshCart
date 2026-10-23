import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import SafeImage from '../components/SafeImage';

export default function CartScreen() {
  const navigation = useNavigation();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    grandTotal,
    cartCount,
    placeOrder,
    userProfile,
    userRole,
  } = useApp();

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some grocery items to your cart before placing an order.');
      return;
    }
    const order = placeOrder();
    setCompletedOrder(order);
    setOrderModalVisible(true);
  };

  const handleClearCartPrompt = () => {
    if (cart.length === 0) return;
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all grocery items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const renderCartItem = ({ item }) => {
    const itemSubtotal = item.price * item.quantity;

    return (
      <View style={styles.cartCard}>
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <SafeImage source={item.image} style={styles.itemImage} />
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>
            ₹{item.price} <Text style={styles.unitText}>/{item.unit}</Text>
          </Text>
          <Text style={styles.subtotalText}>Subtotal: ₹{itemSubtotal}</Text>
        </View>

        {/* Quantity Controls & Remove */}
        <View style={styles.rightActions}>
          {/* Trash Remove Button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeFromCart(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>

          {/* + / - Controls */}
          <View style={styles.quantityPill}>
            <TouchableOpacity
              style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
              onPress={() => updateCartQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={14}
                color={item.quantity <= 1 ? '#CBD5E1' : '#1E293B'}
              />
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateCartQuantity(item.id, 1)}
            >
              <Ionicons name="add" size={14} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header matching Figma Screen 7 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.openDrawer ? navigation.openDrawer() : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>
            {cartCount} item{cartCount !== 1 ? 's' : ''} in basket
          </Text>
        </View>

        {cart.length > 0 ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearCartPrompt}
          >
            <Ionicons name="trash-bin-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Cart Content */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cart-outline" size={54} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added any fresh groceries yet. Explore our farm-fresh selection today!
            </Text>
            <TouchableOpacity
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('Products')}
              activeOpacity={0.8}
            >
              <Ionicons name="bag-check-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.startShoppingBtnText}>Browse Daily Groceries</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          cart.length > 0 ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Bill Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Subtotal</Text>
                <Text style={styles.summaryValue}>₹{cartSubtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  {deliveryFee === 0 && (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.summaryValue}>
                  {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Grand Total */}
              <View style={styles.grandTotalRow}>
                <View>
                  <Text style={styles.grandTotalLabel}>Grand Total</Text>
                  <Text style={styles.inclusiveText}>(Inclusive of all taxes)</Text>
                </View>
                <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
              </View>

              {/* Delivery Destination */}
              <View style={styles.destinationBox}>
                <Ionicons name="location" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.destinationText} numberOfLines={1}>
                  Delivering to: {userProfile.address}
                </Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Bottom Sticky Action Bar matching Figma ("Book Now >>>") */}
      {cart.length > 0 && (
        <View style={styles.checkoutBar}>
          <View style={styles.totalBlock}>
            <Text style={styles.totalBlockLabel}>Total Amount</Text>
            <Text style={styles.totalBlockValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={handlePlaceOrder}
            activeOpacity={0.88}
          >
            <Text style={styles.bookNowText}>Book Now &gt;&gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order Confirmation Success Modal */}
      <Modal
        visible={orderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={42} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Thank you for shopping with FreshMart. Your farm fresh order is on its way.
            </Text>

            {completedOrder && (
              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Order ID:</Text>
                  <Text style={styles.receiptValBold}>{completedOrder.orderId}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Placed on:</Text>
                  <Text style={styles.receiptVal}>{completedOrder.date}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Total Paid:</Text>
                  <Text style={styles.receiptTotal}>₹{completedOrder.total}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Deliver to:</Text>
                  <Text style={styles.receiptVal} numberOfLines={2}>
                    {completedOrder.address}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.deliveryStatusRow}>
              <Ionicons name="time-outline" size={18} color="#16A34A" style={{ marginRight: 6 }} />
              <Text style={styles.deliveryStatusText}>Estimated Delivery: 25 - 35 mins</Text>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => {
                setOrderModalVisible(false);
                navigation.navigate('Products');
              }}
            >
              <Text style={styles.modalDoneBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  titleWrapper: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    paddingTop: 8,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4EC',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F8EE',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  subtotalText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  rightActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 76,
  },
  deleteBtn: {
    padding: 4,
  },
  quantityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF6',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  qtyNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4EC',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  freeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  inclusiveText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF6',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EDF2E8',
  },
  destinationText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F4EC',
  },
  totalBlock: {
    flexDirection: 'column',
  },
  totalBlockLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  totalBlockValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  bookNowButton: {
    backgroundColor: colors.accentYellow,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: colors.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  bookNowText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  startShoppingBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  startShoppingBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAF6',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF2E8',
    marginBottom: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  receiptVal: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  receiptValBold: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  receiptTotal: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '900',
  },
  deliveryStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  deliveryStatusText: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '700',
  },
  modalDoneBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
