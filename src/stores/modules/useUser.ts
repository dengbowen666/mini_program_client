import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useUser = defineStore(
  'user',
  () => {
    // 会员信息
    const token = ref('')
    const userProfile = ref({
      nickname: '',
      user_id: 0,
      avatar_url: '',
      school: '',
      sex: '',
      intro: '',
    })

    // 保存会员信息，登录时使用
    const setProfile = (val: any, user_id: any) => {
      userProfile.value = val
      userProfile.value.user_id = user_id
    }

    const setToken = (val: any) => {
      token.value = val
    }
    const setUserId = (val: any) => {
      userProfile.value.user_id = val
    }
    // 记得 return
    return {
      token,
      userProfile,
      setProfile,
      setToken,
      setUserId,
    }
  },
  // TODO: 持久化
  {
    persist: true,
  },
)
