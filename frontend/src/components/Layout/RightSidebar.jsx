/**
 * 右侧边栏 / Right Sidebar
 */

import { Input, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const RightSidebar = () => {
  const { token } = theme.useToken();

  const styles = {
    container: {
      position: 'sticky',
      top: 0,
      paddingTop: token.paddingSM,
    },
    searchBox: {
      marginBottom: token.padding,
    },
    card: {
      backgroundColor: token.colorBgSecondary,
      borderRadius: token.borderRadiusLG,
      padding: token.padding,
      marginBottom: token.padding,
    },
    cardTitle: {
      fontSize: token.fontSizeXL,
      fontWeight: 800,
      marginBottom: token.padding,
    },
    trendingItem: {
      padding: `${token.paddingSM}px 0`,
      borderBottom: `1px solid ${token.colorBorder}`,
      cursor: 'pointer',
    },
    trendingLabel: {
      display: 'block',
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
    },
    trendingName: {
      display: 'block',
      fontSize: token.fontSize,
      fontWeight: 700,
      margin: `${token.paddingXXS}px 0`,
    },
    trendingCount: {
      display: 'block',
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
    },
    emptyText: {
      color: token.colorTextSecondary,
      fontSize: token.fontSize,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <Input
          placeholder="搜索校友、话题圈..."
          prefix={<SearchOutlined />}
          style={{ borderRadius: 9999 }}
        />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>热门话题</h3>
        <div style={styles.trendingItem}>
          <span style={styles.trendingLabel}>话题圈</span>
          <span style={styles.trendingName}>#2020届毕业回忆</span>
          <span style={styles.trendingCount}>128 条帖子</span>
        </div>
        <div style={{ ...styles.trendingItem, borderBottom: 'none' }}>
          <span style={styles.trendingLabel}>话题圈</span>
          <span style={styles.trendingName}>#校园老照片</span>
          <span style={styles.trendingCount}>96 条帖子</span>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>推荐关注</h3>
        <p style={styles.emptyText}>完善校友信息后查看推荐</p>
      </div>
    </div>
  );
};

export default RightSidebar;
