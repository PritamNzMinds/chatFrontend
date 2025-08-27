import { Form, Input, Button, Card, Row, Col, Typography, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:8001/register", values);
      console.log(res);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "User registered successfully!",
        });
        console.log("Success:", res);
      } else {
        console.log("error", res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}

      <div
        style={{
          height: "",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: 900,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Row>
            <Col span={12}>
              <div
                style={{
                  height: "100%",
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1556742517-fde6c2abbe11?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </Col>

            <Col span={12} style={{ padding: "50px 40px" }}>
              <div style={{ marginBottom: 20 }}>
                <Title level={2} style={{ marginBottom: 10 }}>
                  Create Account
                </Title>
                <Text type="secondary">Register to get started</Text>
              </div>

              <Form
                name="register"
                layout="vertical"
                style={{ maxWidth: 400, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your Name!" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Phone number!",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit number!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                    {
                      min: 5,
                      message: "Password must be at least 5 characters!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      borderRadius: "8px",
                      height: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    Register
                  </Button>
                </Form.Item>

                <div>
                  <Text type="secondary">
                    Already have an account? <a href="/login">Login here</a>
                  </Text>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default Register;
