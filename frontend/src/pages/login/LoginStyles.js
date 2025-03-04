import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e0b00;
`;

export const LoginForm = styled.form`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const LoginFormTitle = styled.h2`
  color: #4e722c;
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const FormLabel = styled.label`
  display: block;
  color: #4e722c;
  margin-bottom: 5px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #bfecab;
  border-radius: 5px;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #7ed957;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #4e722c;
  }
`;
