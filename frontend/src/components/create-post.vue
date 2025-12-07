<template>
  <div class="create-post-page">
    <!-- TOP BAR -->
    <div class="top-bar">
      <button class="back-btn" @click="$router.back()">⬅ Назад</button>
      <h2>Додати новий пост</h2>
    </div>

    <input
      type="text"
      v-model="title"
      placeholder="Заголовок"
    />
    <p v-if="errors.title" class="error">{{ errors.title }}</p>

    <textarea
      v-model="text"
      placeholder="Текст поста"
      rows="6"
    ></textarea>
    <p v-if="errors.text" class="error">{{ errors.text }}</p>

    <!-- Кастомний вибір картинки -->
    <div class="file-upload">
      <label class="file-label">
        Вибрати зображення
        <input type="file" accept="image/*" @change="handleFileChange">
      </label>
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" />
      </div>
    </div>

    <button @click="createPost">Опублікувати</button>

    <p v-if="result" class="error">{{ result }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      text: "",
      imageFile: null,
      imagePreview: null,
      result: null,
      errors: {}
    };
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0] || null;

      // Перевірка, що файл – зображення
      if (file && !file.type.startsWith("image/")) {
        alert("Будь ласка, виберіть тільки зображення!");
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }

      this.imageFile = file;

      if (this.imageFile) {
        this.imagePreview = URL.createObjectURL(this.imageFile)
      } else {
        this.imagePreview = null
      }
    },

    async createPost() {
      try {
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("text", this.text);
        if (this.imageFile) {
          formData.append("image", this.imageFile);
        }

        const res = await axios.post("http://localhost:4444/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Post created:", res.data);
        this.result = null;
        this.$router.back(); // Повернення на попередню сторінку
      } catch (err) {
        console.error(err)

        // Якщо backend повернув масив помилок валідації
        if (Array.isArray(err.response?.data)) {
          err.response.data.forEach(e => {
            this.errors[e.path] = e.msg
          })
        }

        // Якщо backend повернув об'єкт виду { message: "..." }
        if (err.response?.data?.message) {
          this.result = err.response.data.message
        }
      }
    },
  },
};
</script>

<style scoped>
.create-post-page {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #1e1e2f;
  border-radius: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: Arial, sans-serif;
}

/* TOP BAR */
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.back-btn:hover {
  color: #6b8cff;
}

.create-post-page input,
.create-post-page textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2c2c3f;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.create-post-page input::placeholder,
.create-post-page textarea::placeholder {
  color: #aaa;
}

.create-post-page input:focus,
.create-post-page textarea:focus {
  border-color: #6b8cff;
  box-shadow: 0 0 6px rgba(107, 140, 255, 0.6);
}

/* Кастомний вибір картинки */
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-label {
  display: inline-block;
  padding: 10px 15px;
  background-color: #2c2c3f;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
}

.file-label:hover {
  background-color: #3b3b55;
}

.file-label input {
  display: none;
}

.image-preview img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #444;
}

/* Кнопка опублікувати */
.create-post-page button {
  padding: 12px;
  background-color: #6b8cff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.create-post-page button:hover {
  background-color: #5a75e6;
}

/* Помилка */
.error {
  color: #ff6b6b;
  font-size: 14px;
  margin: -8px 0 4px 0;
  text-align: left;
}
</style>
