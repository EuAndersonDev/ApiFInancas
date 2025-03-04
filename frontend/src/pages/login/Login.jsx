import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  LoginContainer,
  LoginForm,
  LoginFormTitle,
  FormGroup,
  FormLabel,
  FormInput,
  LoginButton
} from './LoginStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    Swal.fire({
      title: 'Login realizado com sucesso!',
      text: 'Bem-vindo!',
      icon: 'success',
      confirmButtonColor: '#4E722C',
    });
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <LoginFormTitle>Login</LoginFormTitle>
        <FormGroup>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <FormInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="password">Senha:</FormLabel>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <LoginButton type="submit">Entrar</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;