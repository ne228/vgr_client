import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

export default class WebSocket {
  static async getStompClient() {
    if (WebSocket.stompClient && WebSocket.stompClient.connected) {
      /* eslint-disable */
      console.log('Ws Connection is successfully.')
      return WebSocket.stompClient
    } else {
      await WebsocketHelper.promiseTimeout('5000')
      return await this.getStompClient()
    }
  }

  static connect(callback) {
    WebSocket.isConnection = false
    WebSocket.socket = new SockJS('process.env.VUE_APP_WS_REGISTER_ENDPOINT')
    WebSocket.stompClient = Stomp.over(WebSocket.socket)
    WebSocket.stompClient.debug = () => {}
    WebSocket.stompClient.connect(
      {},
      (frame) => {
        console.log('Ws Connection frame :: ') // eslint-disable-line no-console
        console.log(frame) // eslint-disable-line no-console
      },
      (error) => {
        console.log('Ws Connection error :: ') // eslint-disable-line no-console
        console.log(error) // eslint-disable-line no-console
        callback({ sessionId: null, status: 'CONNECTION_ERROR', message: 'WS connection error!!' })
      }
    )
  }

  static disconnect() {
    if (WebSocket.stompClient) {
      WebSocket.stompClient.disconnect(() => {
        /* eslint-disable */
        console.log('Ws Connection is closed successfully.')
      })
    }
  }

  static async subscribe(callback) {
    this.connect(callback)
    const websocketStompClient = await this.getStompClient()
    websocketStompClient.subscribe(webSocket.SUBSCRIBE, (tick) => {
      if (!tick && !tick.body) {
        this.disconnect()
      } else {
        const tickBody = JSON.parse(tick.body)
        if (tickBody.status === webSocket.SUCCESS || tickBody.status === webSocket.ERROR) {
          this.disconnect()
        }
        callback(tickBody)
      }
    })
  }

  static async sendMessage(msg) {
    WebSocket.stompClient.send('/app/subscribe', JSON.stringify(msg), {})
  }
}
