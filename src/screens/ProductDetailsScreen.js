import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import SafeImage from '../components/SafeImage';

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isFavourite, toggleFavourite, addToCart, products, cartCount } = useApp();

  // Selected product passed via route params, with safe fallback to first product
  const product = route.params?.product || products[0];

  const [quantity, setQuantity] = useState(1);

  const isFav = isFavourite(product.id);

  // Find related products
  const relatedProducts = products.filter(
    (p) => product.relatedIds?.includes(p.id) || (p.category === product.category && p.id !== product.id)
  ).slice(0, 4);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const totalPrice = product.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header matching Figma Screen 5 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Details</Text>

        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavourite(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={isFav ? '#FF4757' : '#94A3B8'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Product Hero Image Container */}
        <View style={styles.heroImageContainer}>
          <SafeImage
            source={product.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.organicBadge}>
            <Ionicons name="sparkles" size={12} color="#15803D" style={{ marginRight: 4 }} />
            <Text style={styles.organicText}>100% Farm Fresh</Text>
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </View>

            {/* Quantity Selector matching Figma (- 1kg +) */}
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={handleDecrease}
                disabled={quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={quantity <= 1 ? '#94A3B8' : '#1E293B'}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity} {product.unit.includes('kg') ? 'kg' : 'pc'}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleIncrease}
              >
                <Ionicons name="add" size={16} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ratings Row */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= Math.floor(product.rating) ? '#EAB308' : '#CBD5E1'}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewsCount} reviews)
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Product Specifications / Quick Info */}
          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Ionicons name="flame-outline" size={16} color={colors.primary} />
              <Text style={styles.specLabel}>Calories</Text>
              <Text style={styles.specValue}>{product.calories || '45 kcal'}</Text>
            </View>
            <View style={styles.specBox}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
              <Text style={styles.specLabel}>Origin</Text>
              <Text style={styles.specValue}>{product.origin || 'India'}</Text>
            </View>
            <View style={styles.specBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
              <Text style={styles.specLabel}>Quality</Text>
              <Text style={styles.specValue}>Grade A</Text>
            </View>
          </View>

          {/* Related Items Section matching Figma */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionHeading}>Related Items</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              >
                {relatedProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.relatedCard}
                    onPress={() => {
                      navigation.push('ProductDetails', { product: item });
                    }}
                    activeOpacity={0.8}
                  >
                    <SafeImage source={item.image} style={styles.relatedImage} />
                    <Text style={styles.relatedName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.relatedPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar matching Figma (Price Rs XX/kg & Add to Cart) */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <View style={styles.bottomPriceRow}>
            <Text style={styles.bottomPrice}>₹{totalPrice}</Text>
            <Text style={styles.bottomUnit}> ({quantity} × ₹{product.price})</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="cart" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  favButton: {
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
  scrollContent: {
    paddingBottom: 110,
  },
  heroImageContainer: {
    height: 250,
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  organicBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  organicText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginHorizontal: 18,
    marginTop: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4EC',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF7EE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF6',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    opacity: 0.5,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  specsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  specBox: {
    flex: 1,
    backgroundColor: '#F8FAF6',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF2E8',
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  relatedSection: {
    marginTop: 4,
  },
  relatedList: {
    gap: 12,
    paddingVertical: 6,
  },
  relatedCard: {
    width: 90,
    backgroundColor: '#F8FAF6',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF2E8',
  },
  relatedImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 16,
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
  bottomPriceContainer: {
    flexDirection: 'column',
  },
  bottomPriceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  bottomPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomUnit: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentYellow,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: colors.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  addToCartButtonText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '800',
  },
});
