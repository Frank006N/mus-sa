import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface PeerPostProps {
  id: string;
  author: string;
  handle: string;
  content: string;
  communityName: string;
  timestamp: string;
  repliesCount: number;
  likesCount: number;
  sharesCount: number;
}

export default function PeerPostCard({ 
  author, handle, content, communityName, timestamp, 
  repliesCount, likesCount, sharesCount 
}: PeerPostProps) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);

  const handleLike = () => {
    setLiked(!liked);
    setLocalLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <TouchableOpacity style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{author.charAt(0)}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author}</Text>
          <Text style={styles.handle}>{handle}</Text>
        </View>
        <Text style={styles.communityTag}>{communityName}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Meta */}
      <Text style={styles.timestamp}>{timestamp}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
          <Text style={styles.actionText}>{repliesCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={18} 
            color={liked ? "#EF4444" : "#6B7280"} 
          />
          <Text style={[styles.actionText, liked && styles.likedText]}>{localLikes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={18} color="#6B7280" />
          <Text style={styles.actionText}>{sharesCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  handle: { fontSize: 12, color: '#6B7280' },
  communityTag: { fontSize: 11, color: '#059669', fontWeight: '600', backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  content: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
  timestamp: { fontSize: 11, color: '#9CA3AF', marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
  likedText: { color: '#EF4444', fontWeight: '600' }
});
