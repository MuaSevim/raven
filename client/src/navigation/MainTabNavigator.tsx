import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, TaskListScreen, ChatScreen, ProfileScreen } from '../screens';
import { RAVEN_COLORS } from '../config/tamagui.config';

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: RAVEN_COLORS.cardSurface,
          borderTopColor: RAVEN_COLORS.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: RAVEN_COLORS.primaryAccent,
        tabBarInactiveTintColor: RAVEN_COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: RAVEN_COLORS.background,
        },
        headerTintColor: RAVEN_COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'RAVEN',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskListScreen}
        options={{
          title: 'DELIVERIES',
          tabBarLabel: 'Tasks',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'MESSAGES',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'PROFILE',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
