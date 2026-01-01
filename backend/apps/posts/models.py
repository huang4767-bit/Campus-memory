"""
帖子模型 / Post Models
"""

from django.db import models
from django.conf import settings


class Post(models.Model):
    """
    帖子模型 / Post Model
    """

    STATUS_CHOICES = [
        ('normal', '正常'),
        ('deleted', '已删除'),
        ('violation', '违规删除'),
    ]

    # 所属圈子 / Related circle
    circle = models.ForeignKey(
        'circles.Circle',
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name='所属圈子'
    )

    # 作者 / Author
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name='作者'
    )

    # 内容 / Content (最多5000字)
    content = models.TextField(
        max_length=5000,
        verbose_name='内容'
    )

    # 图片URL列表 / Image URLs (JSON数组，最多9张)
    images = models.JSONField(
        default=list,
        blank=True,
        verbose_name='图片'
    )

    # 标签 / Tags (JSON数组，最多5个)
    tags = models.JSONField(
        default=list,
        blank=True,
        verbose_name='标签'
    )

    # 状态 / Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='normal',
        verbose_name='状态'
    )

    # 是否置顶 / Is pinned
    is_pinned = models.BooleanField(
        default=False,
        verbose_name='置顶'
    )

    # 是否精华 / Is featured
    is_featured = models.BooleanField(
        default=False,
        verbose_name='精华'
    )

    # 浏览量 / View count
    view_count = models.PositiveIntegerField(
        default=0,
        verbose_name='浏览量'
    )

    # 点赞数 / Like count (冗余字段，便于排序)
    like_count = models.PositiveIntegerField(
        default=0,
        verbose_name='点赞数'
    )

    # 评论数 / Comment count (冗余字段，便于排序)
    comment_count = models.PositiveIntegerField(
        default=0,
        verbose_name='评论数'
    )

    # 热度分数 / Hot score (浏览 + 点赞×2 + 评论×3)
    hot_score = models.PositiveIntegerField(
        default=0,
        verbose_name='热度分数'
    )

    # 最后回复时间 / Last reply time
    last_reply_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='最后回复时间'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    # 更新时间 / Updated at
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='更新时间'
    )

    class Meta:
        db_table = 'posts'
        verbose_name = '帖子'
        verbose_name_plural = '帖子'
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"{self.author.username}: {self.content[:30]}"

    def update_hot_score(self):
        """更新热度分数 / Update hot score"""
        self.hot_score = self.view_count + self.like_count * 2 + self.comment_count * 3
        self.save(update_fields=['hot_score'])

    def update_counts(self):
        """更新计数字段 / Update count fields"""
        self.like_count = self.likes.count()
        self.comment_count = self.comments.filter(status='normal').count()
        self.save(update_fields=['like_count', 'comment_count'])
        self.update_hot_score()


class Comment(models.Model):
    """
    评论模型 / Comment Model
    支持楼中楼回复 / Supports nested replies
    """

    STATUS_CHOICES = [
        ('normal', '正常'),
        ('deleted', '已删除'),
        ('violation', '违规删除'),
    ]

    # 所属帖子 / Related post
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='所属帖子'
    )

    # 评论者 / Author
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='评论者'
    )

    # 内容 / Content (最多500字)
    content = models.TextField(
        max_length=500,
        verbose_name='内容'
    )

    # 父评论 / Parent comment (NULL=一级评论)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name='父评论'
    )

    # 回复的用户 / Reply to user (楼中楼@谁)
    reply_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reply_comments',
        verbose_name='回复用户'
    )

    # 点赞数 / Like count
    like_count = models.PositiveIntegerField(
        default=0,
        verbose_name='点赞数'
    )

    # 状态 / Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='normal',
        verbose_name='状态'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'comments'
        verbose_name = '评论'
        verbose_name_plural = '评论'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.author.username}: {self.content[:30]}..."

    def update_like_count(self):
        """更新点赞数 / Update like count"""
        self.like_count = self.likes.count()
        self.save(update_fields=['like_count'])


class Like(models.Model):
    """
    点赞模型 / Like Model
    支持帖子和评论点赞 / Supports post and comment likes
    """

    # 点赞用户 / User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes',
        verbose_name='用户'
    )

    # 帖子点赞 / Post like (NULL=评论点赞)
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='likes',
        verbose_name='帖子'
    )

    # 评论点赞 / Comment like (NULL=帖子点赞)
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='likes',
        verbose_name='评论'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'likes'
        verbose_name = '点赞'
        verbose_name_plural = '点赞'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'],
                condition=models.Q(post__isnull=False),
                name='unique_user_post_like'
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'],
                condition=models.Q(comment__isnull=False),
                name='unique_user_comment_like'
            ),
        ]


class Favorite(models.Model):
    """
    收藏模型 / Favorite Model
    """

    # 收藏用户 / User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='用户'
    )

    # 收藏的帖子 / Favorited post
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='帖子'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'favorites'
        verbose_name = '收藏'
        verbose_name_plural = '收藏'
        unique_together = ['user', 'post']
        ordering = ['-created_at']
