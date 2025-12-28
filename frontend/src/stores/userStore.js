/**
 * 用户状态管理 / User State Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      // 用户信息 / User info
      user: null,
      // 是否已登录 / Is logged in
      isLoggedIn: false,

      // 设置用户信息 / Set user info
      setUser: (user) => set({ user, isLoggedIn: !!user }),

      // 清除用户信息 / Clear user info
      clearUser: () => set({ user: null, isLoggedIn: false }),

      // 更新用户部分信息 / Update partial user info
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
