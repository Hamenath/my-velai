import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Typography } from '../../constants/colors';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
  iconName = 'alert-circle-outline',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isLoading ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: isDestructive ? Colors.errorBg : Colors.brandYellowSoft },
            ]}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isDestructive ? Colors.error : Colors.brandBlack}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              style={[styles.btn, styles.cancelBtn]}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              style={[
                styles.btn,
                isDestructive ? styles.destructiveBtn : styles.confirmBtn,
              ]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDestructive ? '#FFFFFF' : Colors.brandBlack}
                />
              ) : (
                <Text
                  style={[
                    styles.confirmBtnText,
                    isDestructive && { color: '#FFFFFF' },
                  ]}
                >
                  {confirmLabel}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 22,
    alignItems: 'center',
    ...Shadows.lifted,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: Radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.sectionTitle,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  confirmBtn: {
    backgroundColor: Colors.brandYellow,
  },
  destructiveBtn: {
    backgroundColor: Colors.error,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
