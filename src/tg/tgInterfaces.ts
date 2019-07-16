
type IMessageContent
  = IMessageTextContent
  | IMessageStickerContent
  | IMessageAnimationContent
  | IMessageContentChatAddMembers
  | IMessageContentChatJoinByLink
  | IMessageDocumentContent
  | IMessageAudioContent
  | IMessagePhotoContent
  | IMessageVideoContent
  | IMessagePollContent;

interface IMessageFormattedText {
  '@type': 'formattedText';
  text: string;
}

interface IPollOption {
  '@type': 'pollOption',
  text: string;
  voter_count: number;
  vote_percentage: number;
  is_chosen: boolean;
  is_being_chosen: boolean;
}

export interface IPoll {
  '@type': 'poll',
  id: number;
  question: string;
  options: IPollOption[];
  total_voter_count: number;
  is_closed: boolean;
}

export interface IMessageContentChatAddMembers {
  '@type': 'messageChatAddMembers';
}

export interface IMessageContentChatJoinByLink {
  '@type': 'messageChatJoinByLink';
}

export interface IMessagePollContent {
  '@type': 'messagePoll';
  poll: IPoll;
}

export interface IMessageTextContent {
  '@type': 'messageText';
  text: IMessageFormattedText;
}

export interface IMessagePhotoContent {
  '@type': 'messagePhoto';
  caption: IMessageFormattedText;
  photo: any;
}

export interface IMessageVideoContent {
  '@type': 'messageVideo';
  caption: IMessageFormattedText;
  video: any;
}

export interface IMessageAnimationContent {
  '@type': 'messageAnimation';
  caption: IMessageFormattedText;
  animation: any;
}

export interface IMessageAudioContent {
  '@type': 'messageAudio';
  caption: IMessageFormattedText;
  audio: any;
}

export interface IMessageDocumentContent {
  '@type': 'messageDocument';
  caption: IMessageFormattedText;
  document: any;
}

export interface IMessageStickerContent {
  '@type': 'messageSticker';
  sticker: {
    '@type': 'sticker';
    emoji: '😂';
    height: number;
    is_mask: boolean;
    set_id: string;
    sticker: {
      '@type': 'file';
      id: number;
      size: number;
      expected_size: number;
    };
    thumbnail: {
      '@type': 'photoSize';
      type: string;
      photo: any;
      width: number;
      height: number;
    };
    width: 512;
  }
}

export interface IMessagesResponse {
  '@type': 'messages';
  messages: IMessage[];
  total_count: number;
}

export interface IProxy {
  '@type': 'proxy';
  id: number;
  server: string;
  port: number;
  ast_used_date: number;
  is_enabled: boolean;
  type: {
    '@type': 'proxyTypeHttp' | 'proxyTypeMtproto' | 'proxyTypeSocks5';
  };
}

export interface IProxiesResponse {
  '@type': 'proxies';
  proxies: IProxy[];
}

export interface ISecondsResponse {
  '@type': 'seconds';
  seconds: number;
}

export interface IMessage {
  '@type': 'message';
  id: number;
  sender_user_id: number;
  chat_id: number;
  is_outgoing: boolean;
  can_be_edited: boolean;
  can_be_forwarded: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_deleted_for_all_users: boolean;
  is_channel_post: boolean;
  contains_unread_mention: boolean;
  date: number;
  edit_date: boolean;
  reply_to_message_id: number;
  ttl: number;
  ttl_expires_in: number;
  via_bot_user_id: number;
  author_signature: string;
  views: number;
  media_album_id: string;
  content: IMessageContent;
}

type IChatType = IChatTypeSuperGroup;

interface IChatTypeSuperGroup {
  '@type': 'chatTypeSupergroup';
  supergroup_id: number;
  is_channel: boolean;
}

export interface IChatFullData {
  '@type': 'chat';
  id: number;
  type: IChatType;
  title: string;
  photo: IFile;
  last_message: IMessage;
  order: string;
  is_pinned: boolean;
  is_marked_as_unread: boolean;
  is_sponsored: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_deleted_for; _all_users: boolean;
  can_be_reported: boolean;
  default_disable_notification: boolean;
  unread_count: number;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  unread_mention_count: number;
  notification_settings: any;
  pinned_message_id: number;
  reply_markup_message_id: number;
  client_data: string;
}

interface IFile {
  '@type': 'file';
  id: number;
  size: number;
  expected_size: number;
  local: {
    '@type': 'localFile';
    path: string;
    can_be_downloaded: boolean;
    can_be_deleted: boolean;
    is_downloading_active: boolean;
    is_downloading_completed: boolean;
    download_offset: number;
    downloaded_prefix_size: number;
    downloaded_size: number;
  };
  remote: {
    '@type': 'remoteFile';
    id: string;
    is_uploading_active: boolean;
    is_uploading_completed: boolean;
    uploaded_size: number;
  }
}

export interface IUserProfilePhoto {
  '@type': 'profilePhoto';
  id: string;
  small: IFile;
  big: IFile;
}

export interface IUser {
  '@type': 'user';
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  status: {
    '@type': 'userStatusOffline' | 'userStatusOnline';
    was_online: number;
  };
  profile_photo: IUserProfilePhoto;
  outgoing_link: {
    '@type': 'linkStateNone';
  };
  incoming_link: {
    '@type': 'linkStateNone';
  };
  is_verified: boolean;
  is_support: boolean;
  restriction_reason: string;
  have_access: boolean;
  type: {
    '@type': 'userTypeRegular';
  };
  language_code: string;
}

export interface IOkResponse {
  '@type': 'ok';
}

export type IUpdateEvent
  = IOkResponse
  | IUpdateUserEvent
  | IUpdateOptionEvent
  | IUpdateNewChatEvent
  | IUpdateChatOrderEvent
  | IUpdateNewMessageEvent
  | IUpdateSuperGroupEvent
  | IUpdateChatReadInboxEvent
  | IUpdateChatLastMessageEvent
  | IUpdateUnreadChatCountEvent
  | IUpdateConnectionStateEvent
  | IUpdateUnreadMessagesCountEvent
  | IUpdateScopeNotificationSettingsEvent
  | IUpdateHavePendingNotificationsEvent;

export interface IUpdateUserEvent {
  '@type': 'updateUser';
  user: IUser;
}

export interface IUpdateNewChatEvent {
  '@type': 'updateNewChat';
  chat: IChatFullData;
}

export interface IUpdateChatLastMessageEvent {
  '@type': 'updateChatLastMessage';
  chat_id: number;
  last_message: IMessage;
}

export interface IUpdateNewMessageEvent {
  '@type': 'updateNewMessage';
  chat_id: number;
  message: IMessage;
}

export interface IUpdateHavePendingNotificationsEvent {
  '@type': 'updateHavePendingNotifications';
  have_delayed_notifications: boolean;
  have_unreceived_notifications: boolean;
}

export enum ConnectionState {
  connectionStateConnecting = 'connectionStateConnecting,',
  connectionStateConnectingToProxy = 'connectionStateConnectingToProxy,',
  connectionStateReady = 'connectionStateReady,',
  connectionStateUpdating = 'connectionStateUpdating,',
  connectionStateWaitingForNetwork = 'connectionStateWaitingForNetwork',
}

export interface IUpdateConnectionStateEvent {
  '@type': 'updateConnectionState';
  state: { '@type': ConnectionState };
}

export interface IUpdateScopeNotificationSettingsEvent {
  '@type': 'updateScopeNotificationSettings';
  scope: { '@type': 'updateScopeNotificationSettings' };
}

export interface IUpdateUnreadChatCountEvent {
  '@type': 'updateUnreadChatCount';
  unread_count: number;
  unread_unmuted_count: number;
  marked_as_unread_count: number;
  marked_as_unread_unmuted_count: number;
}

export interface IUpdateUnreadMessagesCountEvent {
  '@type': 'updateUnreadMessageCount';
  unread_count: number;
  unread_unmuted_count: number;
}

export interface IUpdateOptionEvent {
  '@type': 'updateOption';
  name: string;
  value: {
    '@type': string;
    value: string | number | boolean;
  };
}

export interface IUpdateChatOrderEvent {
  '@type': 'updateChatOrder';
  chat_id: number;
  order: string;
}

export interface IUpdateSuperGroupEvent {
  '@type': 'updateSupergroup';
  supergroup: IChatFullData;
}

export interface IUpdateChatReadInboxEvent {
  '@type': 'updateChatReadInbox';
  chat_id: number;
  last_read_inbox_message_id: number;
  unread_count: number;
}

export interface IUpdatesResponse {
  '@type': 'updates';
  updates: IUpdateEvent[];
}

// version
// message_caption_length_max
// test_mode
// favorite_stickers_limit
// t_me_url
// calls_enabled
// forwarded_message_count_max
// pinned_chat_count_max
// basic_group_size_max
// my_id
// expect_blocking
// call_connect_timeout_ms
// venue_search_bot_username
// photo_search_bot_username
// supergroup_size_max
// call_packet_timeout_ms
// animation_search_bot_username
// message_text_length_max
// authorization_date
