import { store } from 'react-easy-state'

const history = store({
  list: [],

  get getHistory () {
    return history.list
  },
  get getLastPage () {
    return history.list[history.list.length-1]
  },
  addHistory (page) {
    history.list.push(page)
  },
})

export default history