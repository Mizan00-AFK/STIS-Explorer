import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    activeMenu: null as 'profile' | 'skill' | 'project' | null
  }),
  actions: {
    openMenu(menu: 'profile' | 'skill' | 'project') {
      this.activeMenu = menu
    },
    closeMenu() {
      this.activeMenu = null
    }
  }
})
