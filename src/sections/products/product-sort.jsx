/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import PropTypes from 'prop-types';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'lowToHight', label: 'Giá thấp nhất' },
  { value: 'highToLow', label: 'Giá cao nhất' },
];

export default function ShopProductSort({handleSort}) {
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sắp xếp:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sort === 'lowToHight' ? 'Thấp nhất': sort === 'highToLow' ? 'Cao nhất': ''}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} onClick={() => {handleClose(); setSort(option.value); handleSort(option.value);}}> 
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

ShopProductSort.propTypes = {
  handleSort: PropTypes.func,
};
