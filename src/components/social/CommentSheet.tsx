import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { SessionComment } from '@/types/social';

interface Props {
  visible: boolean;
  comments: SessionComment[];
  myId: string;
  onClose: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function CommentSheet({
  visible,
  comments,
  myId,
  onClose,
  onAddComment,
  onDeleteComment,
}: Props) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return;
    onAddComment(text);
    setDraft('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          {/* Handle + header */}
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <X size={18} color={Colors.greyMid} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Comments list */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {comments.length === 0 && (
              <Text style={styles.emptyText}>No comments yet. Be the first.</Text>
            )}
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>
                    {c.archerName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentName}>{c.archerName}</Text>
                    <Text style={styles.commentTime}>{formatTime(c.createdAt)}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
                {c.archerId === myId && (
                  <TouchableOpacity
                    onPress={() => onDeleteComment(c.id)}
                    hitSlop={10}
                    style={styles.deleteButton}
                  >
                    <X size={12} color={Colors.greyLight} strokeWidth={1.5} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <SafeAreaView edges={['bottom']} style={styles.inputArea}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={draft}
                onChangeText={setDraft}
                placeholder="Add a comment…"
                placeholderTextColor={Colors.greyLight}
                multiline
                maxLength={280}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!draft.trim()}
                style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
                activeOpacity={0.7}
              >
                <Send size={16} color={draft.trim() ? Colors.bgPrimary : Colors.greyLight} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 39, 32, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '75%',
    minHeight: 300,
  },
  handle: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  list: { flex: 1 },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyLight,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },

  commentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  commentAvatarText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },
  commentBody: { flex: 1, gap: 2 },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  commentName: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  commentTime: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  commentText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  deleteButton: {
    paddingTop: 4,
  },

  inputArea: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.bgSecondary,
  },
});
