// import cheerio from "cheerio";
import STATIONS from "../config/station_name";
import { TYPE_CODE_MAPPING } from "../config/const";
// var cheerio = require("cheerio");
//@ts-ignore
import cheerio from "react-native-cheerio";

export interface IResult {
  success: boolean;
  message: string;
  data?: string | null | any;
}

export default class Plugin {
  static priceMax: number;
  static priceMin: number;
  static seatType: string;

  static setConfig(priceMin: number, priceMax: number, seatType: string) {
    this.priceMin = priceMin;
    this.priceMax = priceMax;
    this.seatType = seatType;
  }

  static decodePrice(type1Code: string, type2Code: string) {
    const results = [];

    // 情况1：动车解析规则 - 两种code都有，并且都是字母开头
    if (
      type1Code &&
      type2Code &&
      /^[A-Za-z]/.test(type1Code) &&
      /^[A-Za-z]/.test(type2Code)
    ) {
      // 处理type1code (铺位编码)
      const bedSegments = type1Code.match(/.{7}/g) || [];
      for (const bedInfo of bedSegments) {
        //J301300--J3|01300
        const price = (parseInt(bedInfo.substr(2, 5)) / 10).toFixed(1);
        this.priceMax = Math.max(
          this.priceMax || parseFloat(price),
          parseFloat(price)
        );
        this.priceMin = Math.min(
          this.priceMin || parseFloat(price),
          parseFloat(price)
        );

        results.push({
          price: price,
          typeCode: bedInfo.substr(0, 2),
          status: "",
        });
      }

      const priceSegments = type2Code.match(/[A-Z]\d+/g) || [];
      for (const segment of priceSegments) {
        //J013000021O006500000--J|0130|00021O|00650|0000
        //I015000000--I|01500|0000
        const typeCode = segment.charAt(0);
        // 从末尾开始：最后4位是状态码，往前5位是价格
        const status = segment.slice(-4);
        const price = (parseInt(segment.slice(-9, -4)) / 10).toFixed(1);
        this.priceMax = Math.max(
          this.priceMax || parseFloat(price),
          parseFloat(price)
        );
        this.priceMin = Math.min(
          this.priceMin || parseFloat(price),
          parseFloat(price)
        );

        results.push({
          price: price,
          typeCode: typeCode,
          status: status,
        });
      }
    }
    // 情况2：传统快车 - 纯数字编码
    else if (
      type2Code &&
      /^\d+$/.test(type2Code) &&
      type1Code &&
      /^\d+$/.test(type1Code)
    ) {
      // 处理type1code (铺位编码)
      const bedSegments = type1Code.match(/.{7}/g) || [];
      for (const bedInfo of bedSegments) {
        // 3300925--33|00925
        const price = (parseInt(bedInfo.substr(2, 5)) / 10).toFixed(1);
        this.priceMax = Math.max(
          this.priceMax || parseFloat(price),
          parseFloat(price)
        );
        this.priceMin = Math.min(
          this.priceMin || parseFloat(price),
          parseFloat(price)
        );
        results.push({
          price: price,
          typeCode: bedInfo.substr(0, 2),
          status: "",
        });
      }

      // 处理type2code (价格编码)
      const priceSegments = type2Code.match(/.{10}/g) || [];
      for (const segment of priceSegments) {
        // 1004650000--1|00465|0000
        const price = (parseInt(segment.substr(1, 5)) / 10).toFixed(1);
        this.priceMax = Math.max(
          this.priceMax || parseFloat(price),
          parseFloat(price)
        );
        this.priceMin = Math.min(
          this.priceMin || parseFloat(price),
          parseFloat(price)
        );
        results.push({
          price: price,
          typeCode: segment.substr(0, 1),
          status: segment.substr(6, 4),
        });
      }
    }
    // 情况3：高铁 - 第一种code为空
    else if (!type1Code && type2Code) {
      const priceSegments = type2Code.match(/.{10}/g) || [];
      for (const segment of priceSegments) {
        //9045200005--9|04520|0005
        const price = (parseInt(segment.substr(1, 5)) / 10).toFixed(1);
        this.priceMax = Math.max(
          this.priceMax || parseFloat(price),
          parseFloat(price)
        );
        this.priceMin = Math.min(
          this.priceMin || parseFloat(price),
          parseFloat(price)
        );
        results.push({
          price: price,
          typeCode: segment.substr(0, 1),
          status: segment.substr(6, 4),
        });
      }
    }

    results.forEach((item) => {
      item.typeCode = `${
        TYPE_CODE_MAPPING[item.typeCode as keyof typeof TYPE_CODE_MAPPING]
      }`;
    });

    const afterFilter = results.filter((res) =>
      res.typeCode.includes(this.seatType)
    );

    return afterFilter;
  }

  static generateSearchTrainsUrl() {}

  static async parseDayLeftTicket(html: string) {
    const $ = cheerio.load(html);
    const arr: Array<any> = [];

    let priceMin = 0;
    let priceMax = 0;

    //@ts-ignore
    $("tr").each((i, el) => {
      const no = $(el).find(".number").text(); //车次

      if (no !== "") {
        const yp_info_new = $(el).attr("yp_info_new");
        const bed_level_info = $(el).attr("bed_level_info");

        const from_to = $(el).find(".cdz").find("strong"); //出发到达
        const start_end = $(el).find(".cds").find("strong"); //开始结束时间
        const ls = $(el).find(".ls").find("strong"); //历时

        const num_ticket = $(el).find(".t-num"); //  一等座 二等座 软卧 硬卧 硬座 无座
        const yes_ticket = $(el).find(".yes"); //  一等座 二等座 软卧 硬卧 硬座 无座

        const raw_data: any = $(el).find(".number").eq(0).attr("onclick") || "";
        //myStopStation.open('1','55000G312403','SHH','AQH','20250520','3');

        const format_raw_data =
          raw_data
            .match(/'([^']+)'/g)
            ?.map((param: string) => param.replace(/'/g, "")) || [];

        let tickets: Array<any> = [];
        tickets = tickets.concat(
          num_ticket
            //@ts-ignore
            .map((i, el) => {
              return {
                text: $(el).text(),
                label: $(el).attr("aria-label")?.toString(),
              };
            })
            .get()
        );

        tickets = tickets.concat(
          yes_ticket
            //@ts-ignore
            .map((i, el) => {
              return {
                text: $(el).text(),
                label: $(el)
                  .attr("aria-label")
                  ?.toString()
                  .replace(/.*，(\w+)票价\d+元，余票(\d+).*/, "$1-余票$2"),
              };
            })
            .get()
        );

        const seats = this.decodePrice(
          bed_level_info as string,
          yp_info_new as string
        );

        const seatsStr = seats.map((seat) => `¥${seat.price}`);

        const prices = seats.filter((p) => p).map((s) => parseFloat(s.price));
        if (prices.length > 0) {
          priceMin == 0
            ? (priceMin = Math.min(...prices))
            : (priceMin = Math.min(...prices, priceMin));
          priceMax == 0
            ? (priceMax = Math.max(...prices))
            : (priceMax = Math.max(...prices, priceMax));
        }

        const afterTicketFilter = tickets.filter((res) =>
          res.label.includes(this.seatType)
        );

        const ticketsStr = afterTicketFilter.map((ticket) => `${ticket.text}`);

        const ticketsDetailStr = afterTicketFilter.map(
          (ticket) => `${ticket.label}`
        );

        arr.push({
          trainNo: no,
          from: from_to.eq(0).text(),
          to: from_to.eq(1).text(),
          departureTime: start_end.eq(0).text(),
          arrivalTime: start_end.eq(1).text(),
          duration: ls.eq(0).text(),
          tickets: tickets,
          ticketsStr: ticketsStr,
          ticketsDetailStr: ticketsDetailStr,
          raw_data: {
            train_no: format_raw_data[1],
            from_station_telecode: format_raw_data[2],
            to_station_telecode: format_raw_data[3],
          },
          priceCode: yp_info_new,
          bedCode: bed_level_info,
          price: prices[0] || 0,
          seats: seats,
          seatsStr: seatsStr, // Updated to use readable format
          operation: "查沿途",
        });
      }
    });

    const afterSort = arr.map((d) => {
      return Object.assign(d, {
        priceRate:
          d.price == 0
            ? 0
            : parseFloat(
                (
                  (d.price - priceMin) / (priceMax - priceMin) || 0.01
                ).toPrecision(3)
              ),
      });
    });

    // console.log("afterSort", afterSort);

    return afterSort;
  }

  static async getStations(html: string) {
    const $ = cheerio.load(html);
    const response = $("pre").eq(0).text();
    const json = JSON.parse(response);
    return json?.data?.data || [];
  }

  static async searchTickets(
    trainNo: string,
    stations: Array<any>,
    fromCode: string,
    date: string,
    callback: Function
  ) {
    const from = STATIONS.find((item) => item.code === fromCode)?.name;
    let startIndex = stations.findIndex((item: any) => {
      return item.station_name === from;
    });

    if (startIndex === -1) {
      startIndex = 0;
    }

    for (let i = startIndex + 1; i < stations.length; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, Math.random() * 5000 + 3000);
      });
      const item = stations[i];
      const to = item.station_name;
      const toCode = STATIONS.find((item) => item.name === to)?.code;
      // ElMessage.info(`开始查询 ${from} 到 ${to} 的车次`);

      const url = `https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${from},${fromCode}&ts=${to},${toCode}&date=${date}&flag=N,N,Y`;

      // const response = await fetch(url);
      // const html = await response.text();

      const html = "";

      // 解析json
      const $ = cheerio.load(html);
      let tickets: Array<any> = [];

      $("tr")
        .get()
        .forEach((el: any) => {
          const no = $(el).find(".number").text(); //车次
          if (no === trainNo) {
            const num_ticket = $(el).find(".t-num"); //  一等座 二等座 软卧 硬卧 硬座 无座
            const yes_ticket = $(el).find(".yes"); //  一等座 二等座 软卧 硬卧 硬座 无座
            tickets = tickets.concat(
              num_ticket
                //@ts-ignore
                .map((i, el) => {
                  return {
                    text: $(el).text(),
                    label: $(el).attr("aria-label")?.toString(),
                  };
                })
                .get()
            );
            tickets = tickets.concat(
              yes_ticket
                //@ts-ignore
                .map((i, el) => {
                  return {
                    text: $(el).text(),
                    label: $(el).attr("aria-label")?.toString(),
                  };
                })
                .get()
            );
          }
        });

      callback &&
        callback({
          trainNo: trainNo,
          from: from,
          to: to,
          tickets: tickets,
        });
    }
  }
}
