import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { RAVEN_LIGHT, RAVEN_TYPOGRAPHY, RAVEN_RADIUS } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MeetingPointMapProps {
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLocationSelect?: (coords: Coordinates, address?: string) => void;
  height?: number;
  markerTitle?: string;
  searchEnabled?: boolean;
}

// ============================================
// LEAFLET HTML TEMPLATE
// ============================================
const generateLeafletHTML = (
  center: Coordinates,
  zoom: number,
  markerTitle: string,
  searchEnabled: boolean
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
    #map { height: 100%; width: 100%; }
    .search-container {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      width: 90%;
      max-width: 350px;
    }
    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      outline: none;
    }
    .search-input:focus {
      box-shadow: 0 2px 12px rgba(0,0,0,0.2);
    }
    .leaflet-marker-icon {
      filter: hue-rotate(0deg);
    }
    .custom-popup .leaflet-popup-content-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 3px 14px rgba(0,0,0,0.2);
    }
    .custom-popup .leaflet-popup-content {
      margin: 10px 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: #333;
    }
    .location-info {
      padding: 8px 0;
    }
    .location-coords {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  ${searchEnabled ? '<div class="search-container"><input type="text" class="search-input" id="searchInput" placeholder="Search location..." /></div>' : ''}
  <div id="map"></div>
  <script>
    (function() {
      // Initialize map
      const map = L.map('map', {
        center: [${center.lat}, ${center.lng}],
        zoom: ${zoom},
        zoomControl: true,
        attributionControl: false
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Create draggable marker
      let marker = L.marker([${center.lat}, ${center.lng}], {
        draggable: true,
        title: '${markerTitle}'
      }).addTo(map);

      // Popup content
      function updatePopup(lat, lng) {
        marker.bindPopup(
          '<div class="location-info">' +
          '<strong>${markerTitle}</strong>' +
          '<div class="location-coords">' + lat.toFixed(6) + ', ' + lng.toFixed(6) + '</div>' +
          '</div>',
          { className: 'custom-popup' }
        ).openPopup();
      }

      updatePopup(${center.lat}, ${center.lng});

      // Send location to React Native
      function sendLocation(lat, lng) {
        const message = JSON.stringify({
          type: 'locationSelected',
          lat: lat,
          lng: lng
        });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(message);
        }
      }

      // Handle marker drag
      marker.on('dragend', function(e) {
        const pos = marker.getLatLng();
        updatePopup(pos.lat, pos.lng);
        sendLocation(pos.lat, pos.lng);
      });

      // Handle map click to move marker
      map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        updatePopup(e.latlng.lat, e.latlng.lng);
        sendLocation(e.latlng.lat, e.latlng.lng);
      });

      // Search functionality
      ${searchEnabled ? `
      const searchInput = document.getElementById('searchInput');
      let searchTimeout;

      searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 3) return;
        
        searchTimeout = setTimeout(async function() {
          try {
            const response = await fetch(
              'https://nominatim.openstreetmap.org/search?format=json&q=' + 
              encodeURIComponent(query) + '&limit=1'
            );
            const results = await response.json();
            
            if (results && results.length > 0) {
              const result = results[0];
              const lat = parseFloat(result.lat);
              const lng = parseFloat(result.lon);
              
              map.setView([lat, lng], 15);
              marker.setLatLng([lat, lng]);
              updatePopup(lat, lng);
              sendLocation(lat, lng);
            }
          } catch (err) {
            console.error('Search error:', err);
          }
        }, 500);
      });

      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
      ` : ''}

      // Send initial location
      sendLocation(${center.lat}, ${center.lng});
    })();
  </script>
</body>
</html>
`;

// ============================================
// COMPONENT
// ============================================
export const MeetingPointMap: React.FC<MeetingPointMapProps> = ({
  initialCenter = { lat: 40.7128, lng: -74.006 }, // Default: New York
  initialZoom = 13,
  onLocationSelect,
  height = 300,
  markerTitle = 'Meeting Point',
  searchEnabled = true,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear refs on unmount
      if (webViewRef.current) {
        webViewRef.current = null;
      }
    };
  }, []);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'locationSelected' && onLocationSelect) {
          onLocationSelect({ lat: data.lat, lng: data.lng });
        }
      } catch (err) {
        console.warn('Failed to parse WebView message:', err);
      }
    },
    [onLocationSelect]
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load map. Please check your internet connection.');
  }, []);

  const htmlContent = generateLeafletHTML(
    initialCenter,
    initialZoom,
    markerTitle,
    searchEnabled
  );

  if (error) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={RAVEN_LIGHT.primaryText} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webView}
        onMessage={handleMessage}
        onLoad={handleLoad}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scrollEnabled={false}
        bounces={false}
        originWhitelist={['*']}
        // Fix for iOS gesture handling
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Android specific
        androidLayerType={Platform.OS === 'android' ? 'hardware' : undefined}
        mixedContentMode="compatibility"
      />
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    borderRadius: RAVEN_RADIUS.card,
    overflow: 'hidden',
    backgroundColor: RAVEN_LIGHT.inputBackground,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: RAVEN_LIGHT.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.error,
    textAlign: 'center',
  },
});

export default MeetingPointMap;
