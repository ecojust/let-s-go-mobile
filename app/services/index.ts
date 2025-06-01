import Plugin from "./plugin";
import STATIONS from "../config/station_name";

export const generateSearchTrainsUrl = (params: {
  origin: string;
  destination: string;
  date: string;
  seatType: string;
  priceMin: number;
  priceMax: number;
}) => {
  console.log("params", params);

  Plugin.setConfig(params.priceMin, params.priceMax, params.seatType);
  const fromCode = STATIONS.find((i) => i.name == params.origin)?.code;
  const toCode = STATIONS.find((i) => i.name == params.destination)?.code;
  const from = params.origin;
  const to = params.destination;
  const date = params.date;
  if (!from || !to || !fromCode || !toCode || !date) {
    return "";
  }
  const url = `https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${from},${fromCode}&ts=${to},${toCode}&date=${date}&flag=N,N,Y`;
  return url;
};

export const parseList = async (html: string) => {
  const arr = await Plugin.parseDayLeftTicket(html);
  return arr;
};

export const generateStationUrl = (
  train_no: string,
  fromCode: string,
  toCode: string,
  date: string
) => {
  const url = `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${train_no}&from_station_telecode=${fromCode}&to_station_telecode=${toCode}&depart_date=${date}`;
  return url;
};

export const parseStations = async (html: string) => {
  const arr = await Plugin.getStations(html);
  return arr;
};

export const generateStationTicketUrls = (
  stations: Array<any>,
  origin: string,
  date: string
) => {
  const originData = [...stations];
  const fromCode = STATIONS.find((item) => item.name === origin)?.code;
  let startIndex = originData.findIndex((item: any) => {
    return item.station_name === origin;
  });
  if (startIndex === -1) {
    startIndex = 0;
  }
  let url = ``;

  for (let i = startIndex + 1; i < originData.length; i++) {
    const item = originData[i];
    const to = item.station_name;
    const toCode = STATIONS.find((item) => item.name === to)?.code;
    url = `https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${origin},${fromCode}&ts=${to},${toCode}&date=${date}&flag=N,N,Y`;
    item.url = url;
    item.searchFrom = origin;
    item.searchTo = to;
  }

  return originData;
};

export const waitTrue = (action: Function, delay: number = 200) => {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      const isTrue = action();
      console.log("waitTrue", isTrue);
      if (isTrue) {
        clearInterval(timer);
        resolve(true);
      }
    }, delay);
  });
};

export const parseStationPoint = async (
  html: string,
  trainNo: string,
  seatType: string
) => {
  const arr = Plugin.parsePointTickets(html, trainNo, seatType);
  return arr;
};
