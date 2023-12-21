import { useState } from 'react';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { isEmail, isString, minLength } from 'src/utils/validator';

import { bgGradient } from 'src/theme/css';
import { userAPI } from 'src/api/api-agent';
import { setToken } from 'src/redux/slices/TokenSlice';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import AleartPopup from 'src/components/alert-popup/alert-popup';

// ----------------------------------------------------------------------

export default function LoginPage() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const theme = useTheme();


    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState(null);
    const [title, setTitle] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [color, setColor] = useState(null);

    const validateCustomerData = () => {
        switch(true){
            case(!isEmail(email)):{
                setErrorMessage('Email không hợp lệ');
                return false;
            }

            case(!isString(password) || !minLength(password, 8)):{
                setErrorMessage('Mật khẩu không hợp lệ. Ít nhất 8 ký tự bất kỳ')
                return false;
            }

            default: {
                return true;
            }
        }
    }

    const setErrorMessage = (_message) => {
        setTitle('Đăng nhập thất bại');
        setMessage(_message);
        setColor('red');
        setActiveMessage(true);
        setTimeout(() => {
            setActiveMessage(false)
        }, 3000)
    }

    const setSuccessfulMessage = (_message) => {
        setTitle('Đăng nhập thành công');
        setMessage(_message);
        setColor('blue');
        setActiveMessage(true);
        setTimeout(() => {
            setActiveMessage(false)
        }, 3000)
    }

    async function handleLoginSubmit() {
        if(validateCustomerData()){
            try {
                const res = await userAPI.login({email, password})
                const response = res.data
                setSuccessfulMessage(`Đăng nhập thành công, chào mừng bạn`);
                dispatch(setToken(response.accessToken))
                setTimeout(() => {
                 nav('/');
                }, 1000)
            }
            catch (error) {
                setErrorMessage(error instanceof AxiosError && (error.response.data.message) )
            }
        }
    }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password} onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={() => {handleLoginSubmit()}}
        style={{marginTop: '10px'}}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <>
      <Helmet>
        <title> Đăng nhập</title>
      </Helmet>
      
      <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

      <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '../../assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" style={{marginBottom: '10px', textAlign: 'center'}}>Đăng nhập admin site</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
    </>
  );
}
