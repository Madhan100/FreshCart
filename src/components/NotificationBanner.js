import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function NotificationBanner() {
  const { notification } = useApp();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isDanger = notification.type === 'danger';

  let bgColor = colors.primary;
  let iconName = 'checkmark-circle';

  if (isDanger) {
    bgColor = colors.danger;
    iconName = 'alert-circle';
  } else if (!isSuccess) {
    bgColor = '#2D3748';
    iconName = 'information-circle';
  }

  return (
    <View style={[styles.banner, { backgroundColor: bgColor }]}>
      <Ionicons name={iconName} size={18} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.text} numberOfLines={2}>
        {notification.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
