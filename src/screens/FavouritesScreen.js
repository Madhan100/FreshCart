import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function FavouritesScreen() {
  const navigation = useNavigation();
  const {
    favouriteProducts,
    toggleFavourite,
    addToCart,
    addAllWishlistToCart,
  } = useApp();

  const handleOpenDrawer = () => {
    if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with Hamburger & Title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={26} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* 2. Subheader Row: Saved count & Add All to Cart */}
      <View style={styles.subheaderRow}>
        <Text style={styles.savedItemsCount}>
          {favouriteProducts.length} saved {favouriteProducts.length === 1 ? 'item' : 'items'}
        </Text>

        {favouriteProducts.length > 0 && (
          <TouchableOpacity
            style={styles.addAllButton}
            onPress={addAllWishlistToCart}
            activeOpacity={0.75}
          >
            <Ionicons name="cart-outline" size={15} color="#2EB053" style={{ marginRight: 4 }} />
            <Text style={styles.addAllText}>Add All to Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Wishlist List or Empty State */}
      {favouriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={48} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite fresh groceries and easily add them to your cart anytime!
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreButtonText}>Explore Catalog</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {favouriteProducts.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Product Image & Discount Badge */}
              <View style={styles.imageWrapper}>
                {item.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{item.discount}</Text>
                  </View>
                )}
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>

              {/* Product Details */}
              <View style={styles.detailsCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.categoryLabel}>
                    {item.subCategory || item.category}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleFavourite(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="heart" size={18} color="#E11D48" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', { product: item })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productUnit} numberOfLines={1}>
                    {item.unit}
                  </Text>
                </TouchableOpacity>

                {/* Price & Add to Cart button */}
                <View style={styles.bottomRow}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>₹{item.price}</Text>
                    {item.originalPrice && (
                      <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item, 1)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="cart" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
  subheaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  savedItemsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  addAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2EB053',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  imageWrapper: {
    width: 86,
    height: 86,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 12,
    overflow: 'hidden',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  detailsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  productUnit: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  originalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#2EB053',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
  exploreButton: {
    backgroundColor: '#2EB053',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
