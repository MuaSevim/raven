import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { RAVEN_DIMENSIONS } from '../config/theme.config';

interface SocialButtonProps {
  icon: any;
  onPress: () => void;
  size?: number;
}

/**
 * SocialButton - Circular button for social login providers
 * Used for Apple, Google, Meta sign-in options
 * Optimized with React.memo
 */
export const SocialButton: React.FC<SocialButtonProps> = React.memo(({
  icon,
  onPress,
  size = RAVEN_DIMENSIONS.socialButtonSize,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={icon}
      style={{
        width: RAVEN_DIMENSIONS.iconSize,
        height: RAVEN_DIMENSIONS.iconSize,
      }}
      resizeMode="contain"
    />
  </TouchableOpacity>
));

SocialButton.displayName = 'SocialButton';
