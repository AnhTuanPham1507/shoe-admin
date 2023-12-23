import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { userAPI } from 'src/api/api-agent';
import { clearToken } from 'src/redux/slices/TokenSlice';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const dispatch = useDispatch();

  const nav = useNavigate();

  const token = useSelector(state => state.token.value);

  const [open, setOpen] = useState(null);
  const [account, setAccount] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const getAccountInfoRes = await userAPI.getInfo(token);
        setAccount(getAccountInfoRes.data);
      } catch (error) {
        console.log(error);
      }
    }

    if(token) getUserInfo();
  }, [token])

  const onLogout = () => {
    dispatch(clearToken());
    alert('Đăng xuất thành công')
    nav('login');
  }

  return (
    account &&
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src='/assets/images/avatars/avatar_25.jpg'
          alt={account.fullName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {/* {account.displayName.charAt(0).toUpperCase()} */}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => {setOpen()}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={onLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Đăng xuất
        </MenuItem>
      </Popover>
    </>
  );
}
