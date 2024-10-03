export interface WebsocketResponse {
  type: string,
  instrumentId: string,
  provider: string,
  last: LastData
}

export interface LastData {
  timestamp: string,
  price: number,
  volume: number,
  change: number,
  changePct: number
}
