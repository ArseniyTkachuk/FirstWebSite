<template>
  <div class="post-view-page">
    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="back-btn" @click="$router.back()">⬅ Назад</button>
      <h2>Пост</h2>
      <button 
        v-if="post.user?._id === user._id" 
        class="delete-btn" 
        @click="deletePost"
      >
        🗑 Видалити
      </button>
    </div>

    <!-- POST CONTENT -->
    <div class="post-card">
      <div class="post-header">
        <img 
          :src="post.user?.avatarUrl ? `http://localhost:4444${post.user.avatarUrl}` : defaultAvatar" 
          class="post-avatar"
        />
        <span class="post-username">{{ post.user?.fullName || 'Видалений користувач' }}</span>
      </div>

      <img v-if="post.imageUrl" :src="`http://localhost:4444${post.imageUrl}`" class="post-image" />

      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-text">{{ post.text }}</p>

      <!-- LIKE BUTTON -->
      <div class="like-section">
        <button class="like-btn" @click="toggleLike">
          <span :class="{ liked: isLiked }">❤️</span>
          {{ post.likes || 0 }}
        </button>
      </div>
    </div>

    <!-- COMMENTS -->
    <div class="comments-box">
      <h3>Коментарі</h3>

      <div v-if="post.comments?.length === 0" class="no-comments">
        Коментарів поки немає.
      </div>

      <div v-for="comment in post.comments" :key="comment._id" class="comment-item">
        <strong>{{ comment.user.fullName }}:</strong>
        <p>{{ comment.text }}</p>
      </div>

      <!-- Comment input -->
      <div class="comment-input">
        <input 
          v-model="newComment" 
          type="text" 
          placeholder="Написати коментар..."
        />
        <button @click="sendComment">📩</button>
      </div>
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
      isLiked: false,
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  },

  async mounted() {
    await this.fetchUser();
    await this.fetchPost();
  },

  methods: {
    // Отримання даних користувача
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

    // Отримання посту
    async fetchPost() {
      try {
        const postId = this.$route.params.id;
        const res = await axios.get(`http://localhost:4444/posts/${postId}`);
        this.post = res.data;

        // Перевірка, чи користувач лайкнув пост
        this.isLiked = this.post.likedBy?.some(id => id.toString() === this.user._id);
      } catch (err) {
        console.error(err);
      }
    },

    // ❤️ Лайк/дизлайк посту
    async toggleLike() {
      try {
        const res = await axios.post(
          `http://localhost:4444/posts/${this.post._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        this.post.likes = res.data.likes;
        this.isLiked = res.data.likedBy.some(id => id.toString() === this.user._id);
      } catch (err) {
        console.error(err);
      }
    },

    // 💬 Відправка коментаря
    async sendComment() {
      if (!this.newComment.trim()) return;

      try {
        const res = await axios.post(
          `http://localhost:4444/posts/${this.post._id}/comment`,
          { text: this.newComment },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        this.post.comments = res.data.comments;
        this.newComment = "";
      } catch (err) {
        console.error(err);
      }
    },

    // Видалення посту
    async deletePost() {
      if (!confirm("Ви точно хочете видалити цей пост?")) return;

      try {
        await axios.delete(`http://localhost:4444/posts/${this.post._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Пост видалено!");
        this.$router.push("/home");
      } catch (err) {
        console.error(err);
        alert("Не вдалося видалити пост.");
      }
    },
  },
};
</script>

<style scoped>
.post-view-page {
  padding: 15px;
  font-family: Arial, sans-serif;
  color: #fff;
  background: #111827;
  min-height: 100vh;
}

.top-bar {
  position: sticky;
  top: 0;
  background: #1e1e2f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
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

.delete-btn {
  background: #ff6b6b;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.delete-btn:hover {
  background: #e05555;
}

.post-card {
  background: #1e1e2f;
  padding: 16px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4b5563;
}

.post-username {
  font-weight: bold;
  font-size: 16px;
}

.post-image {
  width: 100%;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 12px;
}

.like-section {
  margin-top: 10px;
}

.like-btn {
  background: #2c2f45;
  border: none;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.liked {
  color: #ff4d6d;
}

.comments-box {
  background: #1e1e2f;
  margin-top: 20px;
  padding: 15px;
  border-radius: 12px;
}

.comment-item {
  padding: 8px 0;
  border-bottom: 1px solid #2c2f3f;
}

.comment-item p {
  margin: 2px 0 0 0;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.comment-input input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
}

.comment-input button {
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
