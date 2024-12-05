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
      avatar: '',
      school: '',
      sex: '',
      intro: '',
      user_id: ''
    })

    // 保存信息，登录时使用
    const setProfile = (val: any) => {
      userProfile.value = val

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
