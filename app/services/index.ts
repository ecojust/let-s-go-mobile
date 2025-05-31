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

export const parseList = async (url: string) => {
  const arr = await Plugin.parseDayLeftTicket(url);
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
