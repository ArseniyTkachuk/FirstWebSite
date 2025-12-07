<template>
  <div class="recommendations-page">
    <!-- TOP BAR -->
    <div class="top-bar">
      <!-- LEFT: Avatar + Username -->
      <div class="left" @click="goToProfile">
        <img
          :src="user.avatarUrl ? `http://localhost:4444${user.avatarUrl}` : defaultAvatar"
          class="avatar"
        />
        <span class="username">{{ user.fullName || 'Username' }}</span>
      </div>

      <!-- RIGHT: Search + Add Post buttons -->
      <div class="right">
        <button class="search-btn">🔍</button>
        <button class="add-post-btn" @click="goToAddPost">➕ Додати пост</button>
      </div>
    </div>

    <!-- Body content -->
    <div class="content">
      <h2 class="title">Рекомендовані пости</h2>

      <div v-if="posts.length === 0" class="placeholder">
        Поки що тут порожньо…
      </div>

      <div v-else class="posts-list">
        <div
          v-for="post in posts"
          :key="post._id"
          class="post"
          @click="goToPost(post._id)"
        >
          <div class="post-header">
            <img
              :src="post.user && post.user.avatarUrl ? `http://localhost:4444${post.user.avatarUrl}` : defaultAvatar"
              class="post-avatar"
            />
            <span class="post-username">
              {{ post.user && post.user.fullName ? post.user.fullName : 'Видалений користувач' }}
            </span>
          </div>

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
    this.fetchPosts();
  },

  methods: {
    async fetchUser() {
      try {
        const res = await axios.get("http://localhost:4444/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.user = res.data.userData;
      } catch (err) {
        console.error("Error loading user:", err);
      }
    },

    async fetchPosts() {
      try {
        const res = await axios.get("http://localhost:4444/posts");
        this.posts = res.data.map((post) => ({
          ...post,
          user: post.user || null,
        }));
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    },

    goToProfile() {
      this.$router.push("/profile");
    },

    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },

    goToAddPost() {
      this.$router.push("/create-post");
    },
  },
};
</script>

<style scoped>
.recommendations-page {
  padding: 15px;
  font-family: "Arial", sans-serif;
  color: #ffffff;
  background: #111827;
  min-height: 100vh;
}

/* TOP BAR */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border-bottom: 1px solid #374151;
  background-color: #111827; /* фон для закріпленого бару */
  position: sticky;          /* закріплюємо */
  top: 0;                    /* зверху сторінки */
  z-index: 100;              /* щоб був поверх контенту */
  box-shadow: 0 2px 4px rgba(0,0,0,0.3); /* легка тінь */
}


/* LEFT BLOCK */
.left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.left:hover {
  color: #6b8cff;
}
.left:hover .avatar {
  border-color: #6b8cff;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4b5563;
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: #f9fafb;
}

/* RIGHT BLOCK */
.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #f9fafb;
  cursor: pointer;
  transition: 0.2s;
}
.search-btn:hover {
  transform: scale(1.1);
  color: #6b8cff;
}

.add-post-btn {
  padding: 6px 12px;
  background: #6b8cff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}
.add-post-btn:hover {
  background: #5a75e6;
}

/* CONTENT */
.content {
  padding-top: 20px;
}

.title {
  font-size: 22px;
  margin-bottom: 10px;
}

.placeholder {
  color: #9ca3af;
}

/* POSTS LIST */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

/* POST IMAGE */
.post-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #1e1e2f;
}

/* POST HEADER */
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.post-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4b5563;
}

.post-username {
  font-weight: bold;
}

/* POST CONTENT */
.post-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.post-text {
  font-size: 14px;
  color: #d1d5db;
  white-space: pre-wrap;
}
</style>
