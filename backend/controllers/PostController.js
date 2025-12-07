import PostModel from '../models/Post.js'
import { validationResult } from 'express-validator'


export const getAll = async(req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не вдалося получити пости'
        })
    }
} 

export const getOne = async(req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Стаття не знайдена'
            });
        }

        res.json(doc);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося вернути статтю'
        });
    }

}

export const remove = async(req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findByIdAndDelete(postId);

        if (!doc) {
            return res.status(404).json({
                message: 'Стаття не знайдена'
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося видалити статтю'
        });
    }


}

export const update = async(req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося обновити статтю'
        });
    }


}

export const create = async (req, res) => {
  try {
    // Перевіряємо, чи користувач авторизований
    if (!req.userId) {
      return res.status(401).json({ message: 'Користувач не авторизований' });
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      tags: req.body.tags,
      user: req.userId
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не вдалося створити пост' });
  }
};



export const likePost = async (req, res) => {
  try {
    const postId = req.params.id; // <-- ось тут беремо id поста
    const userId = req.userId;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    // Логіка лайку/анлайку
    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
      post.likes -= 1;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.json({ likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося поставити лайк" });
  }
};
