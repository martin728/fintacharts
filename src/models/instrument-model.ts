export interface Instrument {
  id: string,
  symbol: string,
  currency: string,
  baseCurrency: string
}

export interface InstrumentsResponse {
  data: Instrument[];
  paging: {
    page: number,
    pages: number,
    items: number
  }
}

export interface DateRangeResponse {
  data: PriceDataByDate[];
}

export interface PriceDataByDate {
    "t": string,
    "o": number,
    "h": number,
    "l": number,
    "c": number,
    "v": number
}
