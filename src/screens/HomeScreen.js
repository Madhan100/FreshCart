import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { CATEGORIES, CATEGORY_CIRCLES } from '../data/products';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    products,
    addToCart,
    toggleFavourite,
    isFavourite,
    cartCount,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Daily Deals items
  const dailyDeals = products.filter((p) => p.isDailyDeal);

  const handleOpenDrawer = () => {
    if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleCategoryPress = (catName) => {
    setSelectedCategory(catName);
    navigation.navigate('Shop', { category: catName });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Top Announcement Strip */}
      <View style={styles.topAnnouncementBar}>
        <View style={styles.announcementLeft}>
          <Text style={styles.announcementEmoji}>🌿</Text>
          <Text style={styles.announcementText}>
            Fresh Groceries! Free delivery on orders over ₹500
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.announcementHelp}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.mainScroll}
      >
        {/* 2. App Header with Hamburger, Logo & Cart */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleOpenDrawer}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <View style={styles.brandIconBox}>
              <Ionicons name="leaf" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.brandTextCol}>
              <Text style={styles.brandTitle}>FreshCart</Text>
              <Text style={styles.brandSubtitle}>Good Food, Happier You</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color="#1E293B" />
            {cartCount > 0 && (
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#94A3B8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fruits, veg..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() =>
              navigation.navigate('Shop', { search: searchQuery })
            }
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Quick Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}
        >
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.8}
              >
                {index === 0 && (
                  <Ionicons
                    name="grid-outline"
                    size={14}
                    color={isSelected ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 5. Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.farmFreshBadge}>
              <Text style={styles.farmFreshBadgeText}>FARM FRESH</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>Freshness{"\n"}Delivered Daily</Text>
          <Text style={styles.heroSubheadline}>
            Farm-fresh groceries for a healthier, happier you.
          </Text>

          <TouchableOpacity
            style={styles.heroCtaButton}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCtaText}>Shop Fresh Now →</Text>
          </TouchableOpacity>

          {/* Highlights Row */}
          <View style={styles.heroHighlightsRow}>
            <View style={styles.heroHighlightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#86EFAC" />
              <Text style={styles.heroHighlightText}>Fresh Quality</Text>
            </View>
            <View style={styles.heroHighlightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#86EFAC" />
              <Text style={styles.heroHighlightText}>Great Prices</Text>
            </View>
            <View style={styles.heroHighlightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#86EFAC" />
              <Text style={styles.heroHighlightText}>Fast Delivery</Text>
            </View>
          </View>
        </View>

        {/* 6. Shop by Category Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryCirclesScrollView}
          contentContainerStyle={styles.categoryCirclesScroll}
        >
          {[
            { id: 'all', name: 'All Items', emoji: '🛒', bg: '#DCFCE7', color: '#15803D', filter: 'All Categories' },
            { id: 'fruits_veg', name: 'Fruits & Veg', emoji: '🍎', bg: '#FEE2E2', color: '#DC2626', filter: 'Fruits & Veg' },
            { id: 'dairy_eggs', name: 'Dairy & Eggs', emoji: '🥛', bg: '#DBEAFE', color: '#2563EB', filter: 'Dairy' },
            { id: 'bakery', name: 'Bakery', emoji: '🍞', bg: '#FEF3C7', color: '#D97706', filter: 'Bakery' },
            { id: 'meat_seafood', name: 'Meat & Seafood', emoji: '🍗', bg: '#FCE7F3', color: '#DB2777', filter: 'Meat' },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCircleItem}
              onPress={() => handleCategoryPress(cat.filter)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryImageWrapper, { backgroundColor: cat.bg }]}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.categoryCircleLabel} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 7. Dual Promotional Cards */}
        <View style={styles.promoCardsRow}>
          {/* Card 1: Season's Best */}
          <TouchableOpacity
            style={[styles.promoCard, styles.promoCard1]}
            onPress={() => navigation.navigate('Shop', { category: 'Fruits & Veg' })}
            activeOpacity={0.85}
          >
            <View style={styles.promoBadgeCircle}>
              <Text style={styles.promoBadgeUpTo}>UP TO</Text>
              <Text style={styles.promoBadgePercent}>30%</Text>
              <Text style={styles.promoBadgeOff}>OFF</Text>
            </View>

            <View>
              <Text style={styles.promoTag}>Season's Best</Text>
              <Text style={styles.promoTitleWhite}>Fresh & Healthy</Text>
              <Text style={styles.promoSubtitleWhite}>Farm to your home</Text>
            </View>

            <View style={styles.promoActionRow}>
              <Text style={styles.promoLinkWhite}>Shop Now →</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Healthy Choices */}
          <TouchableOpacity
            style={[styles.promoCard, styles.promoCard2]}
            onPress={() => navigation.navigate('Shop', { category: 'Fruits & Veg' })}
            activeOpacity={0.85}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.promoCard2BgImage}
              resizeMode="cover"
            />
            <View style={styles.promoCard2Overlay} />
            <View style={{ zIndex: 2 }}>
              <Text style={styles.promoTagDark}>Healthy Choices</Text>
              <Text style={styles.promoTitleDark}>Daily Fresh Essentials</Text>
            </View>
            <View style={styles.promoActionRow}>
              <Text style={[styles.promoLinkWhite, { color: '#B45309', zIndex: 2 }]}>Explore →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 8. Daily Deals Section */}
        <View style={styles.dealsHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Deals</Text>
          <View style={styles.countdownBadge}>
            <Ionicons name="time-outline" size={13} color="#E11D48" />
            <Text style={styles.countdownText}>Ends in 12h : 34m</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsScroll}
        >
          {dailyDeals.map((product) => {
            const isFav = isFavourite(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.dealCard}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.9}
              >
                {/* Discount Badge */}
                {product.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>
                      {product.discount}
                    </Text>
                  </View>
                )}

                {/* Wishlist Heart */}
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => toggleFavourite(product.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFav ? '#E11D48' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Product Image */}
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Category & Name */}
                <Text style={styles.productCategory}>
                  {product.subCategory || product.category}
                </Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productUnit} numberOfLines={1}>
                  {product.unit}
                </Text>

                {/* Price & Add Button Row */}
                <View style={styles.priceRow}>
                  <View style={styles.priceCol}>
                    <Text style={styles.currentPrice}>₹{product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>
                        ₹{product.originalPrice}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(product, 1)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="cart" size={13} color="#FFFFFF" style={{ marginRight: 3 }} />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#15803D',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  mainScroll: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  topAnnouncementBar: {
    backgroundColor: '#15803D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  announcementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  announcementEmoji: {
    marginRight: 6,
    fontSize: 12,
  },
  announcementText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  announcementHelp: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2EB053',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerCartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#2EB053',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  headerCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    paddingVertical: 0,
  },
  categoryPillsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#2EB053',
    borderColor: '#2EB053',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: '#15803D',
    padding: 18,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  farmFreshBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  farmFreshBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubheadline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 17,
    marginBottom: 14,
  },
  heroCtaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  heroCtaText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  heroHighlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    paddingTop: 10,
  },
  heroHighlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroHighlightText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2EB053',
  },
  categoryCirclesScrollView: {
    height: 105,
    minHeight: 105,
  },
  categoryCirclesScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryCircleItem: {
    alignItems: 'center',
    width: 72,
    marginRight: 12,
  },
  categoryImageWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryCircleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 14,
  },
  promoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
    height: 135,
    gap: 12,
  },
  promoCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    height: 135,
    minHeight: 135,
    maxHeight: 135,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoCard1: {
    backgroundColor: '#1E3A2F',
    position: 'relative',
  },
  promoBadgeCircle: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  promoBadgeUpTo: {
    fontSize: 7,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 8,
  },
  promoBadgePercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    lineHeight: 12,
  },
  promoBadgeOff: {
    fontSize: 7,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 8,
  },
  promoTag: {
    fontSize: 10,
    color: '#86EFAC',
    fontWeight: '600',
    marginBottom: 2,
  },
  promoTitleWhite: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  promoSubtitleWhite: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  promoActionRow: {
    marginTop: 4,
  },
  promoLinkWhite: {
    fontSize: 10,
    fontWeight: '700',
    color: '#86EFAC',
  },
  promoCard2: {
    backgroundColor: '#FEF3C7',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  promoCard2BgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoCard2Overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 248, 230, 0.65)',
  },
  promoTagDark: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '700',
    marginBottom: 2,
  },
  promoTitleDark: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  dealsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  countdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  dealsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dealCard: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  productImageContainer: {
    width: '100%',
    height: 96,
    backgroundColor: '#F8FAF6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  productCategory: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 1,
  },
  productUnit: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currentPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#2EB053',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
