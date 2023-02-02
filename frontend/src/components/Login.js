import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
} from "reactstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:9103/intelliq_api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Incorrect username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <Row>{error && <p className="text-danger">{error}</p>}</Row>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormGroup>
        <FormGroup className="d-flex justify-content-end">
          <Button type="submit" color="primary">
            Login
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default Login;
