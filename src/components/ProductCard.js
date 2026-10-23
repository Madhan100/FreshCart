import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function ProductCard({ product }) {
  const navigation = useNavigation();
  const { isFavourite, toggleFavourite, addToCart } = useApp();

  const isFav = isFavourite(product.id);

  const handlePress = () => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {/* Discount Badge */}
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>{product.discount}</Text>
        </View>
      )}

      {/* Favourite Heart Button */}
      <TouchableOpacity
        style={styles.favButton}
        onPress={() => toggleFavourite(product.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={18}
          color={isFav ? '#E11D48' : '#94A3B8'}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Category Tag */}
      <Text style={styles.categoryText}>
        {product.subCategory || product.category}
      </Text>

      {/* Product Name */}
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>

      <Text style={styles.unit} numberOfLines={1}>
        {product.unit}
      </Text>

      {/* Price & Add to Cart Action */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product, 1)}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={14} color="#FFFFFF" style={{ marginRight: 3 }} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    margin: 6,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F8FAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 6,
  },
  image: {
    width: '85%',
    height: '85%',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  unit: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#2EB053',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
