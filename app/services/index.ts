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
