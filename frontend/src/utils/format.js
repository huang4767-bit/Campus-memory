/**
 * 格式化工具函数 / Format Utility Functions
 */

/**
 * 格式化相对时间 / Format relative time
 * 用于帖子列表、评论列表等场景
 * @param {string} time - ISO 时间字符串
 * @returns {string} 格式化后的时间
 */
export const formatRelativeTime = (time) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  return date.toLocaleDateString();
};

/**
 * 格式化完整时间 / Format full time
 * 用于帖子详情等需要显示完整时间的场景
 * @param {string} time - ISO 时间字符串
 * @returns {string} 格式化后的时间
 */
export const formatFullTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
