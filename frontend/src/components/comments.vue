<template>
  <div class="comments-page">
    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="back-btn" @click="$router.back()">⬅ Назад</button>
      <h2>Коментарі</h2>
    </div>

    <!-- POST TITLE -->
    <div class="post-title-section">
      <h3>{{ post.title }}</h3>
      <p>{{ post.text }}</p>
    </div>

    <!-- COMMENTS LIST -->
    <div v-if="post.comments?.length === 0" class="no-comments">
      Коментарів поки немає.
    </div>

    <div v-for="comment in post.comments" :key="comment._id" class="comment-item">
      <div class="comment-header">
        <img 
          :src="comment.user?.avatarUrl ? `http://localhost:4444${comment.user.avatarUrl}` : defaultAvatar" 
          class="comment-avatar"
        />
        <strong>{{ comment.user?.fullName || 'Видалений користувач' }}</strong>
      </div>
      <p class="comment-text">{{ comment.text }}</p>
      <p class="comment-date">{{ formatDate(comment.createdAt) }}</p>

      <!-- LIKE BUTTON -->
      <button 
        class="comment-like-btn" 
        @click="toggleCommentLike(comment)" 
        :class="{ liked: isCommentLiked(comment), animate: animatingComment === comment._id }"
      >
        <span>{{ isCommentLiked(comment) ? '❤️' : '🤍' }}</span>
        {{ comment.likes || 0 }}
      </button>
    </div>

    <!-- NEW COMMENT INPUT -->
    <div class="new-comment-section">
      <input 
        v-model="newComment" 
        type="text" 
        placeholder="Написати коментар..."
        @keyup.enter="sendComment"
      />
      <button @click="sendComment">Відправити</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      post: {},
      user: {},
      newComment: "",
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      animatingComment: null, // id коментаря для анімації лайка
    };
  },

  async mounted() {
    await this.fetchUser();
    await this.fetchPostComments();
  },

  methods: {
    async fetchUser() {
      try {
        const res = await axios.get("http://localhost:4444/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.user = res.data.userData;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchPostComments() {
      try {
        const postId = this.$route.params.id;
        const res = await axios.get(`http://localhost:4444/posts/${postId}`);
        this.post = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    isCommentLiked(comment) {
      return comment.likedBy?.some(id => id.toString() === this.user._id);
    },

    async toggleCommentLike(comment) {
      try {
        const res = await axios.post(
          `http://localhost:4444/comments/${comment._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        comment.likes = res.data.likes;
        comment.likedBy = res.data.likedBy;

        // запуск анімації
        this.animatingComment = comment._id;
        setTimeout(() => (this.animatingComment = null), 300);
      } catch (err) {
        console.error(err);
      }
    },

    async sendComment() {
      if (!this.newComment.trim()) return;

      try {
        const postId = this.$route.params.id;
        const res = await axios.post(
          `http://localhost:4444/posts/${postId}/comment`,
          { text: this.newComment },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        this.post.comments = res.data.comments;
        this.newComment = "";
      } catch (err) {
        console.error(err);
      }
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleString('uk-UA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
};
</script>

<style scoped>
.comments-page {
  padding: 15px;
  font-family: Arial, sans-serif;
  background: #111827;
  color: #fff;
  min-height: 100vh;
}

.top-bar {
  position: sticky;
  top: 0;
  background: #1e1e2f;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-bottom: 1px solid #374151;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: #f9fafb;
  font-size: 18px;
  cursor: pointer;
}

.post-title-section {
  background: #1e1e2f;
  padding: 15px;
  border-radius: 12px;
  margin: 12px 0;
}

.comment-item {
  background: #1e1e2f;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 12px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #4b5563;
}

.comment-text {
  margin-bottom: 4px;
}

.comment-date {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 6px;
}

.comment-like-btn {
  background: #2c2f45;
  border: none;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.comment-like-btn span {
  display: inline-block;
}

.comment-like-btn.liked span {
  color: #ff4d6d;
}

.comment-like-btn.animate {
  transform: scale(1.4);
}

.new-comment-section {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.new-comment-section input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
}

.new-comment-section button {
  background: #4b8cff;
  border: none;
  padding: 8px 12px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.no-comments {
  color: #9ca3af;
  margin-bottom: 10px;
}
</style>
