import React from "react";
import { Card, Col, Layout, Row } from "antd";

const SearchForm = React.lazy(() => import("./components/SearchForm/Form"));

function App() {
  return (
    <Layout>
      <Layout.Content>
        <Row
          gutter={[16, 16]}
          style={{ height: "100vh" }}
          justify="center"
          align="middle"
        >
          <Col xs={24} md={16} xl={12}>
            <Card
              bordered
              title={<h1 style={{ textAlign: "center" }}>Search Form</h1>}
            >
              <SearchForm />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

export default App;
