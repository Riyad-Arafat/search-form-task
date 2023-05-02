import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import type { Country, RulesType, SearchFormValues } from "./types";
import { destinationsOptions } from "./mock";
import OptionsModal from "./OptionsModal";

const rules: RulesType = {
  destination: [
    {
      required: true,
      message: "Please enter a destination",
    },
  ],
  checkIn: [
    {
      required: true,
      message: "Please enter a check in",
    },
  ],
  checkOut: [
    {
      required: true,
      message: "Please enter an check out",
    },
  ],
  nights: [
    {
      required: true,

      message: "Please enter the number of nights",
    },
  ],
  nationality: [
    {
      required: true,
      message: "Please enter your nationality",
    },
  ],
  currency: [],
  country: [],
  city: [],
};

export const SearchForm = () => {
  const [form] = Form.useForm();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNationalities();
  }, []);

  const nationalitiesOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.name.official,
        label: (
          <span>
            {country.flag} {country.demonyms?.eng.m}
          </span>
        ),
      })),
    [countries]
  );

  const handleSearch = async (value: SearchFormValues) => {
    const data = {
      ...form.getFieldsValue(),
      ...value,
      checkIn: value.checkIn.format("YYYY-MM-DD"),
      checkOut: value.checkOut.format("YYYY-MM-DD"),
    };
    console.table(data);

    message.success("Search submitted, check the console for the values");
  };
  const handlecheckInChange = useCallback(
    (date: dayjs.Dayjs | null) => {
      if (!date) {
        return;
      }

      const { checkOut, nights } = form.getFieldsValue(["checkOut", "nights"]);

      const newCheckOut =
        !checkOut || checkOut.isBefore(date)
          ? nights
            ? date.add(nights, "day")
            : date.add(1, "day")
          : checkOut;

      // calculate nights
      const newNights = newCheckOut.diff(date, "day");

      console.log("handlecheckInChange", {
        newCheckOut: newCheckOut.format("YYYY-MM-DD"),
      });

      form.setFieldsValue({
        checkOut: newCheckOut,
        nights: newNights,
      });
    },
    [form]
  );

  const handlecheckOutChange = useCallback(
    (date: dayjs.Dayjs | null) => {
      if (!date) {
        return;
      }
      const checkIn = form.getFieldValue("checkIn") as dayjs.Dayjs | null;
      if (checkIn && date.isAfter(checkIn)) {
        const newNights = Math.max(date.diff(checkIn, "day"), 1);

        form.setFieldsValue({
          nights: newNights,
          checkOut: checkIn?.add(newNights, "day"),
        });
      }
    },
    [form]
  );

  const handleCalculateNights = useCallback(
    (nights: number | null) => {
      const start = form.getFieldValue("checkIn") as dayjs.Dayjs | null;

      if (!start || !nights) {
        return 0;
      }

      const end = start.add(nights, "day");
      form.setFieldsValue({ checkOut: end });

      return Math.max(nights, 1);
    },
    [form]
  );

  const filterOption = useCallback(
    (inputValue: string, option?: { value: string }) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1,

    []
  );

  return (
    <Form<SearchFormValues>
      form={form}
      layout="vertical"
      onFinish={handleSearch}
      initialValues={{
        currency: "EGP",
        city: "Cairo, Egypt",
        country: "Egypt",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Destination"
            name="destination"
            rules={rules.destination}
          >
            <AutoComplete
              options={destinationsOptions}
              filterOption={filterOption}
              placeholder="Destination"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Check In" name="checkIn" rules={rules.checkIn}>
            <DatePicker
              placeholder="Check In Date"
              onChange={handlecheckInChange}
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf("day"))
              }
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Check Out" name="checkOut" rules={rules.checkOut}>
            <DatePicker
              placeholder="Check Out Date"
              style={{
                width: "100%",
              }}
              onChange={handlecheckOutChange}
              disabledDate={(current) =>
                (current && current.isSame(form.getFieldValue("checkIn"))) ||
                current.isBefore(form.getFieldValue("checkIn"))
              }
              showToday={false}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Nights" name="nights" rules={rules.nights}>
            <InputNumber
              placeholder="Nights count"
              style={{
                width: "100%",
              }}
              onChange={(value) => handleCalculateNights(value)}
              min={1}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="Nationality"
            name="nationality"
            rules={rules.nationality}
          >
            <Select
              placeholder="Your Nationality"
              showSearch
              style={{
                width: "100%",
              }}
              options={nationalitiesOptions}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <OptionsModal countries={countries} />
        </Col>

        <Col span={24}>
          <Button type="primary" htmlType="submit" block>
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
