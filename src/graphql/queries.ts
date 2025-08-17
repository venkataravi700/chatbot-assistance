import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats($userId: uuid!) {
    chats(where: {user_id: {_eq: $userId}}, order_by: {updated_at: desc}) {
      id
      title
      created_at
      updated_at
    }
  }
`;

export const GET_MESSAGES = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(where: {chat_id: {_eq: $chatId}}, order_by: {created_at: asc}) {
      id
      text
      created_at
      user_id
    }
  }
`;

export const INSERT_CHAT = gql`
  mutation InsertChat($title: String!, $userId: uuid!) {
    insert_chats_one(object: {title: $title, user_id: $userId}) {
      id
      title
      created_at
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chatId, 
      text: $content
    }) {
      id
      text
      created_at
      user_id
    }
  }
`;

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      response_text
      
    }
  }
`;
export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: {id: $chatId}, _set: {title: $title}) {
      id
      title
    }
  }
`;