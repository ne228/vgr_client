const websocketService = {
  socket: null,

  connect(url, vueInstance) {
    // Передаем объект Vue в websocketService
    this.vueInstance = vueInstance

    this.socket = new WebSocket(url)

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connected')
    })

    this.socket.addEventListener('message', (event) => {
      this.handleMessage(event)
    })

    this.socket.addEventListener('close', () => {
      console.log('WebSocket disconnected')
      // Попробуйте переподключиться
      setTimeout(() => this.connect(url, vueInstance), 1000)
    })

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
      // Попробуйте переподключиться
      setTimeout(() => this.connect(url, vueInstance), 1000)
    })
  },

  handleMessage(event) {
    const data = JSON.parse(event.data)
    // Здесь можно выполнить логику обработки изменений в зависимости от полученных данных
    // Например, можно вызвать методы Vue компонентов или обновить Vuex хранилище
    this.vueInstance.$emit('websocketMessage', data)
  }
}

export default websocketService
