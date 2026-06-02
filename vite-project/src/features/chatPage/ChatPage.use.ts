import { useAuth } from '../auth';
import type { ChatPageViewProps } from './ChatPage.types';

/** Reads the authenticated user and produces view props for the chat layout. */
export function useChatPage(): ChatPageViewProps {
  const { user } = useAuth();

  return { userName: user?.name };
}
