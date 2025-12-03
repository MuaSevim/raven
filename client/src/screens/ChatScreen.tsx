import React, { useState, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { YStack, XStack, Text, Input, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

// Types
interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface ChatScreenProps {
  onBack?: () => void;
  onCall?: () => void;
}

// Mock data
const CURRENT_USER_ID = 'user_1';
const OTHER_USER = {
  id: 'user_2',
  name: 'Liam Carter',
  avatar: null, // Would be a URI in real app
};

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hi! I saw your listing for the documents delivery to Istanbul. Is it still available?',
    senderId: 'user_1',
    timestamp: '10:30 AM',
    isOutgoing: true,
  },
  {
    id: '2',
    text: 'Hey! Yes, it\'s still available. I\'m traveling on December 15th.',
    senderId: 'user_2',
    timestamp: '10:32 AM',
    isOutgoing: false,
  },
  {
    id: '3',
    text: 'Perfect! The package is just some legal documents, very light. Would $50 work for you?',
    senderId: 'user_1',
    timestamp: '10:33 AM',
    isOutgoing: true,
  },
  {
    id: '4',
    text: 'That sounds fair. Can you tell me the pickup location?',
    senderId: 'user_2',
    timestamp: '10:35 AM',
    isOutgoing: false,
  },
  {
    id: '5',
    text: 'Sure! I\'m in downtown Manhattan. We can meet at a coffee shop near Times Square.',
    senderId: 'user_1',
    timestamp: '10:36 AM',
    isOutgoing: true,
  },
  {
    id: '6',
    text: 'That works for me. Let me confirm my flight details and I\'ll get back to you.',
    senderId: 'user_2',
    timestamp: '10:38 AM',
    isOutgoing: false,
  },
];

const DEAL_INFO = {
  title: 'Documents to Istanbul',
  price: '$50',
};

// Avatar Component
const Avatar: React.FC<{ isOutgoing?: boolean; size?: number }> = ({
  isOutgoing = false,
  size = 32,
}) => (
  <YStack
    width={size}
    height={size}
    borderRadius={size / 2}
    backgroundColor={isOutgoing ? '$ravenPrimary' : '$ravenBorder'}
    alignItems="center"
    justifyContent="center"
  >
    <Text fontSize={size * 0.4} color="$ravenTextPrimary">
      {isOutgoing ? 'Y' : 'L'}
    </Text>
  </YStack>
);

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isOutgoing = message.isOutgoing;

  return (
    <XStack
      width="100%"
      justifyContent={isOutgoing ? 'flex-end' : 'flex-start'}
      paddingHorizontal="$4"
      marginBottom="$3"
    >
      {!isOutgoing && (
        <YStack marginRight="$2" justifyContent="flex-end">
          <Avatar isOutgoing={false} size={28} />
        </YStack>
      )}

      <YStack maxWidth="75%">
        <YStack
          backgroundColor={isOutgoing ? '#000000' : '$ravenCard'}
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderRadius={RAVEN_RADIUS.card}
          borderTopLeftRadius={isOutgoing ? RAVEN_RADIUS.card : 4}
          borderTopRightRadius={isOutgoing ? 4 : RAVEN_RADIUS.card}
        >
          <Text
            color="$ravenTextPrimary"
            fontSize={15}
            lineHeight={22}
          >
            {message.text}
          </Text>
        </YStack>
        <Text
          color="$ravenTextSecondary"
          fontSize={11}
          marginTop="$1"
          textAlign={isOutgoing ? 'right' : 'left'}
          paddingHorizontal="$1"
        >
          {message.timestamp}
        </Text>
      </YStack>

      {isOutgoing && (
        <YStack marginLeft="$2" justifyContent="flex-end">
          <Avatar isOutgoing={true} size={28} />
        </YStack>
      )}
    </XStack>
  );
};

// Phone Icon Component
const PhoneIcon: React.FC = () => (
  <Text fontSize={20} color="$ravenTextSecondary">
    📞
  </Text>
);

// Gallery Icon Component
const GalleryIcon: React.FC = () => (
  <Text fontSize={20} color="$ravenTextSecondary">
    🖼️
  </Text>
);

// Back Arrow Component
const BackArrow: React.FC = () => (
  <Text fontSize={24} color="$ravenTextPrimary">
    ←
  </Text>
);

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onCall }) => {
  const [messageText, setMessageText] = useState('');
  const [messages] = useState<Message[]>(MOCK_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: RAVEN_COLORS.background }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <YStack>
          {/* Main Header */}
          <XStack
            height={56}
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="$4"
            backgroundColor="$ravenBackground"
            borderBottomWidth={1}
            borderBottomColor="$ravenBorder"
          >
            {/* Back Button */}
            <XStack
              alignItems="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <BackArrow />
            </XStack>

            {/* User Name */}
            <Text
              fontSize={18}
              fontWeight="600"
              color="$ravenTextPrimary"
            >
              {OTHER_USER.name}
            </Text>

            {/* Call Button */}
            <XStack
              pressStyle={{ opacity: 0.7 }}
              onPress={onCall}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <PhoneIcon />
            </XStack>
          </XStack>

          {/* Deal Info Sub-header */}
          <XStack
            backgroundColor="rgba(45, 96, 255, 0.15)"
            paddingVertical="$3"
            paddingHorizontal="$4"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontSize={14}
              color="$ravenPrimary"
              fontWeight="500"
            >
              Re: {DEAL_INFO.title} - {DEAL_INFO.price}
            </Text>
          </XStack>
        </YStack>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        {/* Input Area */}
        <YStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$ravenBackground"
          borderTopWidth={1}
          borderTopColor="$ravenBorder"
        >
          <SafeAreaView edges={['bottom']}>
            <XStack
              backgroundColor="$ravenCard"
              borderRadius={24}
              alignItems="center"
              paddingHorizontal="$4"
              paddingVertical="$2"
              minHeight={48}
            >
              {/* Text Input */}
              <Input
                flex={1}
                placeholder="Type a message..."
                value={messageText}
                onChangeText={setMessageText}
                backgroundColor="transparent"
                borderWidth={0}
                color="$ravenTextPrimary"
                placeholderTextColor={RAVEN_COLORS.textSecondary}
                fontSize={15}
                paddingHorizontal={0}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />

              {/* Gallery Icon */}
              <XStack
                pressStyle={{ opacity: 0.7 }}
                marginLeft="$2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <GalleryIcon />
              </XStack>
            </XStack>
          </SafeAreaView>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
