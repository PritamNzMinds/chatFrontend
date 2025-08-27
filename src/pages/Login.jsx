import { Form, Input, Button, Card, Row, Col, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:8001/login", values);
      console.log(res);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "User Login successfully!",
        });
        console.log("Token:", res.data.data);
        localStorage.setItem("users", JSON.stringify(res.data.data));
        navigate('/');
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
          height: "100vh",
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
                    "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </Col>
            <Col span={12} style={{ padding: "50px 40px" }}>
              <div style={{ marginBottom: 20 }}>
                <Title level={2} style={{ marginBottom: 10 }}>
                  Welcome Back
                </Title>
                <Text type="secondary">Login to your account</Text>
              </div>

              <Form
                name="login"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ maxWidth: 400, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >
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
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
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
                    Login
                  </Button>
                </Form.Item>

                <div>
                  <Text type="secondary">
                    Don’t have an account?
                    <a href="/register">Register here</a>
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

export default Login;
