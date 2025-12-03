import { StreamChat } from 'stream-chat';
import { streamConfig } from '../config/stream.config';

// Initialize Stream Chat client
let chatClient: StreamChat | null = null;

export const streamService = {
  // Get or create chat client
  getClient: (): StreamChat => {
    if (!chatClient) {
      chatClient = StreamChat.getInstance(streamConfig.apiKey);
    }
    return chatClient;
  },

  // Connect user to Stream
  connectUser: async (userId: string, token: string, userData?: object): Promise<void> => {
    const client = streamService.getClient();
    await client.connectUser(
      {
        id: userId,
        ...userData,
      },
      token
    );
  },

  // Disconnect user
  disconnectUser: async (): Promise<void> => {
    const client = streamService.getClient();
    await client.disconnectUser();
  },

  // Create or get a channel between two users
  getOrCreateChannel: async (userId1: string, userId2: string) => {
    const client = streamService.getClient();
    const channel = client.channel('messaging', {
      members: [userId1, userId2],
    });
    await channel.watch();
    return channel;
  },

  // Get user's channels
  getUserChannels: async (userId: string) => {
    const client = streamService.getClient();
    const filter = { members: { $in: [userId] } };
    const sort = [{ last_message_at: -1 as const }];
    const channels = await client.queryChannels(filter, sort);
    return channels;
  },
};

export { chatClient };
