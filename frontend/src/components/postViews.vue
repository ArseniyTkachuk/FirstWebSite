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

      <!-- LIKE & VIEWS -->
      <div class="like-section">
        <button class="like-btn" @click="toggleLike">
          <span 
            class="like-icon" 
            :class="{ liked: isLiked, animated: animateLike }"
          >{{ isLiked ? '❤️' : '🤍' }}</span>
          {{ post.likes || 0 }}
        </button>
        <span class="views-count">👁 {{ post.viewsCount || 0 }}</span>
      </div>

      <!-- BUTTON TO COMMENTS PAGE -->
      <div class="comments-button-section">
        <button class="view-comments-btn" @click="goToComments">
          💬 Переглянути коментарі ({{ post.comments?.length || 0 }})
        </button>
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
      isLiked: false,
      animateLike: false,
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  },

  async mounted() {
    await this.fetchUser();
    await this.fetchPost();
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

    async fetchPost() {
      try {
        const postId = this.$route.params.id;
        const res = await axios.get(`http://localhost:4444/posts/${postId}`);
        this.post = res.data;

        this.isLiked = this.post.likedBy?.some(id => id.toString() === this.user._id);
      } catch (err) {
        console.error(err);
      }
    },

    async toggleLike() {
      try {
        const res = await axios.post(
          `http://localhost:4444/posts/${this.post._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        this.post.likes = res.data.likes;
        this.isLiked = res.data.likedBy.some(id => id.toString() === this.user._id);

        // Анімація лайка
        this.animateLike = true;
        setTimeout(() => this.animateLike = false, 300);

      } catch (err) {
        console.error(err);
      }
    },

    goToComments() {
      this.$router.push(`/posts/${this.post._id}/comments`);
    },

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
  display: flex;
  align-items: center;
  gap: 15px;
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
  display: flex;
  align-items: center;
  gap: 5px;
}

.like-icon {
  font-size: 22px;
  transition: transform 0.3s ease;
}

.like-icon.animated {
  transform: scale(1.5);
}

.like-icon.liked {
  color: #ff4d6d;
}

.views-count {
  color: #9ca3af;
  font-size: 14px;
}

.comments-button-section {
  margin-top: 12px;
}

.view-comments-btn {
  background: #4b8cff;
  border: none;
  padding: 8px 12px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
