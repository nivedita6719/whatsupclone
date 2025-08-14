import { ChatHeader } from "./ChatHeader";
import { MessagesContainer } from "./MessagesContainer";
import { SendMessageInput } from "./SendMessageInput";
import { useUsers } from '../../contexts/UsersContext'; // ✅ import this
import styles from './styles.module.scss';

export function Chat() {
  const { selectedRoom } = useUsers(); // ✅ grab selectedRoom

  console.log("🔍 selectedRoom:", selectedRoom); // ✅ add this line

  return (
    <div className={styles.container}>
      <ChatHeader />
      <MessagesContainer />
      {selectedRoom ? (
        <SendMessageInput />
      ) : (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
