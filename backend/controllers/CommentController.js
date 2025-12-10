import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;
    const postId = req.params.id;

    if (!text) return res.status(400).json({ message: "Текст коментаря обов'язковий" });

    const comment = new CommentModel({
      text,
      user: userId,
      post: postId,
    });

    await comment.save();

    // Додаємо коментар до посту
    await PostModel.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    // Повертаємо оновлені коментарі
    const post = await PostModel.findById(postId).populate({
      path: "comments",
      populate: { path: "user", select: "fullName avatarUrl" },
    });

    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не вдалося додати коментар" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;

    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Коментар не знайдено" });

    if (comment.likedBy.includes(userId)) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes -= 1;
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    res.json({ likes: comment.likes, likedBy: comment.likedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не вдалося лайкнути коментар" });
  }
};



export const remove = async(req, res) => {
    try {
        const commentId = req.params.id;

        const doc = await CommentModel.findByIdAndDelete(commentId);

        if (!doc) {
            return res.status(404).json({
                message: 'Коментарій не знайдений'
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося видалити коментарій'
        });
    }
}
