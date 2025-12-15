<template>
  <div class="profile-page">
    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="back-btn" @click="$router.back()">⬅ Назад</button>
    </div>

    <!-- User Info -->
    <div class="user-info">
      <img
        :src="user.avatarUrl ? `http://localhost:4444${user.avatarUrl}` : defaultAvatar"
        class="avatar"
      />
      <h3 class="username">{{ user.fullName || 'Username' }}</h3>
      <p class="email">{{ user.email }}</p>

      <!-- підписатися -->
      <!-- <button class="subscribe-true" @click="subscribe">➕ Subscribe</button> -->
      <button class="subscribe-false" @click="subscribe">Unsubscribe</button>

    </div>

    <!-- User Posts -->
    <div class="user-posts">
      <h3>Пости</h3>
      <div v-if="posts.length === 0" class="placeholder">
        Поки що немає постів…
      </div>
      <div v-else class="posts-list">
        <div
          v-for="post in posts"
          :key="post._id"
          class="post"
          @click="goToPost(post._id)"
        >
          <!-- Фото посту зверху -->
          <img
            v-if="post.imageUrl"
            :src="`http://localhost:4444${post.imageUrl}`"
            class="post-image"
          />

          <div class="post-title">{{ post.title }}</div>
          <div class="post-text">{{ post.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      posts: [],
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  },

  mounted() {
    this.fetchUser();
  },

  methods: {
    async fetchUser() {
      try {
        const userId = this.$route.params.id;
        const res = await axios.get(`http://localhost:4444/auth/${userId}`);
        this.user = res.data.userData;
        this.fetchPosts(); // Завантажуємо пости після отримання user
      } catch (err) {
        console.error("Error loading user:", err);
      }
    },

    async fetchPosts() {
      try {
        const res = await axios.get("http://localhost:4444/posts");
        // Фільтруємо лише пости цього користувача
        this.posts = res.data.filter(
          (post) => post.user && post.user._id === this.user._id
        );
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    },

    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },

    subscribe(){

    },

    async checkUser(){
      const userId = this.$route.params.id;
      const res = await axios.get("http://localhost:4444/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const us = res.data.userData;

      if ( us._id == userId){
        this.$router.push(`/profile`);
      }
    },
  },

  created(){
    this.checkUser()
  },
};
</script>

<style scoped>
.profile-page {
  padding: 15px;
  background: #111827;
  color: #fff;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  padding-top: 80px; /* місце для топбару */
}

/* TOP BAR */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #1e1e2f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #374151;
  z-index: 1000;
}

.back-btn {
  background: none;
  border: none;
  color: #f9fafb;
  font-size: 18px;
  cursor: pointer;
}

.logout-btn {
  background: #ef4444;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin-right: 4%;
}

.logout-btn:hover {
  background: #dc2626;
}

.user-info {
  text-align: center;
  margin: 20px 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4b5563;
  margin-bottom: 10px;
}

.username {
  font-size: 22px;
  font-weight: bold;
}

.email {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 10px;
}

.subscribe-true {
  padding: 8px 16px;
  background: #6b8cff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.subscribe-true:hover {
  background: #5a75e6;
}

.subscribe-false {
  padding: 8px 16px;
  background: #202c5f;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.subscribe-false:hover {
  background: #141b3a;
}

.user-posts {
  margin-top: 20px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post {
  background: #1e1e2f;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.post:hover {
  background: #2c2c3f;
}

.post-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #1e1e2f;
}

.post-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.post-text {
  color: #d1d5db;
}

.placeholder {
  color: #9ca3af;
}
</style>
