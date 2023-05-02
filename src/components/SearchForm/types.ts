import { FormRule } from "antd";
import dayjs from "dayjs";

export interface Name {
  [key: string]: string;
  common: string;
  official: string;
}

export interface Country {
  [key: string]: any;
  name: Name;
  cca3: string;
  flag: string;
  demonyms?: {
    eng: {
      f: string;
      m: string;
    };
    fra?: {
      f: string;
      m: string;
    };
  };
}

export interface SearchFormValues {
  destination: string;
  checkIn: dayjs.Dayjs;
  checkOut: dayjs.Dayjs;
  nights: number;
  nationality: string;
  currency: string;
  country: string;
  city: string;
}

export type RulesType = {
  [K in keyof SearchFormValues]: FormRule[];
};
