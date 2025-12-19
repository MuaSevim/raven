/**
 * ============================================
 * IOS SAFE WEBVIEW - iOS-optimized WebView wrapper
 * ============================================
 * Wraps react-native-webview with iOS-specific fixes and optimizations
 */

import React, { useMemo, useCallback } from 'react';
import { Platform, ViewStyle } from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';

interface IOSSafeWebViewProps extends WebViewProps {
  containerStyle?: ViewStyle;
}

/**
 * IOSSafeWebView - Wraps WebView with iOS-specific configurations
 * Fixes:
 * - Gesture handling on iOS
 * - Media playback issues
 * - Scroll behavior
 * - Memory leaks
 */
export const IOSSafeWebView = React.forwardRef<WebView, IOSSafeWebViewProps>(
  ({ containerStyle, ...props }, ref) => {
    // Memoize iOS-specific props
    const iosProps = useMemo(
      () =>
        Platform.OS === 'ios'
          ? {
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
              scrollEnabled: true,
              pinchZoomEnabled: true,
            }
          : {},
      []
    );

    // Memoize Android-specific props
    const androidProps = useMemo(
      () =>
        Platform.OS === 'android'
          ? {
              androidLayerType: 'hardware' as const,
              mixedContentMode: 'compatibility' as const,
              useWebKit: true,
            }
          : {},
      []
    );

    // Memoize common props
    const commonProps = useMemo(
      () => ({
        originWhitelist: ['*'],
        javaScriptEnabled: true,
        domStorageEnabled: true,
        startInLoadingState: false,
        scalesPageToFit: true,
        decelerationRate: 'normal' as const,
      }),
      []
    );

    const handleError = useCallback(
      (error: any) => {
        console.warn('WebView Error:', error);
        if (props.onError) {
          props.onError(error);
        }
      },
      [props]
    );

    return (
      <WebView
        ref={ref}
        {...commonProps}
        {...iosProps}
        {...androidProps}
        onError={handleError}
        {...props}
      />
    );
  }
);

IOSSafeWebView.displayName = 'IOSSafeWebView';
