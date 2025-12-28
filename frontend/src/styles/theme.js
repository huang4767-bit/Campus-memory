/**
 * Ant Design 主题配置 / Ant Design Theme Configuration
 * 基于 X (Twitter) UI 风格 / Based on X (Twitter) UI Style
 */

export const themeConfig = {
  token: {
    // 主色 / Primary color
    colorPrimary: '#1D9BF0',
    colorPrimaryHover: '#1A8CD8',

    // 背景色 / Background colors
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgSecondary: '#F7F9F9',

    // 文字色 / Text colors
    colorText: '#0F1419',
    colorTextSecondary: '#536471',
    colorTextTertiary: '#8B98A5',

    // 边框色 / Border colors
    colorBorder: '#EFF3F4',
    colorBorderSecondary: '#EFF3F4',

    // 功能色 / Functional colors
    colorError: '#F4212E',
    colorSuccess: '#00BA7C',
    colorLike: '#F91880',

    // 圆角 / Border radius
    borderRadius: 4,
    borderRadiusLG: 16,
    borderRadiusSM: 4,

    // 字体 / Font
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 15,
    fontSizeLG: 17,
    fontSizeSM: 13,
    fontSizeXL: 20,

    // 行高 / Line height
    lineHeight: 1.5,

    // 间距 / Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,

    // 控件高度 / Control height
    controlHeight: 40,
    controlHeightLG: 52,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      borderRadius: 9999,
      primaryShadow: 'none',
      fontWeight: 700,
    },
    Input: {
      borderRadius: 4,
      activeBorderColor: '#1D9BF0',
      hoverBorderColor: '#1D9BF0',
    },
    Card: {
      borderRadius: 16,
      boxShadow: 'none',
    },
    Tabs: {
      inkBarColor: '#1D9BF0',
      itemActiveColor: '#0F1419',
      itemHoverColor: '#0F1419',
      itemSelectedColor: '#0F1419',
    },
  },
};

export default themeConfig;
