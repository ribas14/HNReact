import { store } from 'react-easy-state'

const settings = store({
  color: {
    background: '#222222',
  },
  get getThemeColor () {
    return settings.color.background
  },
  changeThemeColor (color) {
    settings.color.background = color
  },
})

export default settings