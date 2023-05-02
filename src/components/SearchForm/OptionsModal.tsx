import React, { useCallback, useMemo, useState } from "react";
import { Select, Button, Form, Modal, Row, Col, AutoComplete } from "antd";
import { Country } from "./types";
import { currencyOptions, destinationsOptions } from "./mock";

export interface OptionsModalProps {
  countries: Country[];
}

const OptionsModal = ({ countries }: OptionsModalProps) => {
  const [visible, setVisible] = useState(false);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        label: (
          <>
            {country.flag} {country.name.common}
          </>
        ),
        value: country.name.official,
      })),
    [countries]
  );

  const handleOk = () => {
    setVisible(false);
  };

  const filterOption = useCallback(
    (inputValue: string, option?: { value: string }) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1,

    []
  );

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        More Options
      </Button>

      <Modal
        title="More Search Options"
        open={visible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="save" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
        centered
        width={"80%"}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Country" name="country">
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                options={countryOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="City" name="city">
              <AutoComplete
                options={destinationsOptions}
                filterOption={filterOption}
                placeholder="City"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Currency" name="currency">
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                options={currencyOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default OptionsModal;
