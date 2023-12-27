import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { partnerAPI, categoryAPI } from 'src/api/api-agent';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function ProductFilters({ openFilter, onOpenFilter, onCloseFilter, handleFilter }) {
  const [categories, setCategories] = useState([])

  const [partners, setPartners] = useState([])

  const [fromPrice, setFormPrice] = useState(null);

  const [toPrice, setToPrice] = useState(null);

  const [selectedRangePrice, setSelectedRangePrice] = useState('0');

  const [selectedPartners, setSelectedPartners] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {
    async function initialData() {
        try {
            const response = await Promise.all([
                categoryAPI.getAll(),
                partnerAPI.getAll(),
            ]);
        setCategories(response[0].data.data)
        setPartners(response[1].data.data)
        } catch (error) {
            console.log(error)
        }
    }
    initialData()
}, [])

const filterPartnerSelect = (checked, item) => {
  if (checked) {
      setSelectedPartners([...selectedPartners,item._id])
  } else {
    setSelectedPartners(selectedPartners.filter(selectedPartner => selectedPartner !== item._id))
  }
}

const filterCategoySelect = (checked, item) => {
  if (checked) {
    setSelectedCategories([...selectedCategories,item._id])
} else {
  setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== item._id))
}
}


  const renderPartner = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Thương hiệu</Typography>
      <FormGroup>
        {partners.map((item) => (
          <FormControlLabel 
            key={item._id} 
            control={<Checkbox />} 
            label={item.name} 
            onChange={(input) => filterPartnerSelect(input.target.checked, item)}
            checked={selectedPartners.includes(item._id)}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
    <Typography variant="subtitle2">Loại sản phẩm</Typography>
    <FormGroup>
      {categories.map((item) => (
        <FormControlLabel 
          key={item._id} 
          control={<Checkbox />} 
          label={item.name} 
          onChange={(input) => filterCategoySelect(input.target.checked, item)}
          checked={selectedCategories.includes(item._id)}
        />
      ))}
    </FormGroup>
  </Stack>
  );

  // const renderColors = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Colors</Typography>
  //     <ColorPicker
  //       name="colors"
  //       selected={[]}
  //       colors={COLOR_OPTIONS}
  //       onSelectColor={(color) => [].includes(color)}
  //       sx={{ maxWidth: 38 * 4 }}
  //     />
  //   </Stack>
  // );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Khoảng giá</Typography>
      <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selectedRangePrice}
          onChange={(e) => setSelectedRangePrice(e.target.value)}
      >
          <FormControlLabel value="1" control={<Radio />} label="0đ - 1.000.000đ" />
          <FormControlLabel value="2" control={<Radio />} label="1.000.000đ - 5.000.000đ" />
          <FormControlLabel value="3" control={<Radio />} label="5.000.000đ - 10.000.000đ" />
          <FormControlLabel value="4" control={<Radio />} label="Trên 10.000.000đ" />
      </RadioGroup>
    </Stack>
  );

  // const renderRating = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Rating</Typography>
  //     <RadioGroup>
  //       {RATING_OPTIONS.map((item, index) => (
  //         <FormControlLabel
  //           key={item}
  //           value={item}
  //           control={
  //             <Radio
  //               disableRipple
  //               color="default"
  //               icon={<Rating readOnly value={4 - index} />}
  //               checkedIcon={<Rating readOnly value={4 - index} />}
  //               sx={{
  //                 '&:hover': { bgcolor: 'transparent' },
  //               }}
  //             />
  //           }
  //           label="& Up"
  //           sx={{
  //             my: 0.5,
  //             borderRadius: 1,
  //             '&:hover': { opacity: 0.48 },
  //           }}
  //         />
  //       ))}
  //     </RadioGroup>
  //   </Stack>
  // );

  useEffect(() => {
    switch(selectedRangePrice){
        case '1': {
            setFormPrice(0);
            setToPrice(1000000);
            break;
        }
        case '2': {
            setFormPrice(1000000);
            setToPrice(5000000);
            break;
        }
        case '3': {
            setFormPrice(5000000);
            setToPrice(10000000);
            break;
        }
        case "4": {
            setFormPrice(10000000);
            setToPrice(null);
            break;
        }
        default: {
            break;
        }
    }
}, [selectedRangePrice])

const handleClearFilter = () => {
  setSelectedCategories([])
  setSelectedPartners([])
  setFormPrice(null)
  setToPrice(null);
  handleFilter({})
}

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Bộ lọc&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 380, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Bộ lọc sản phẩm
          </Typography> 
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderPartner}

            {renderCategory}

            {/* {renderColors} */}

            {renderPrice}

            {/* {renderRating} */}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
        <Button
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
            onClick={() => handleFilter({fromPrice, toPrice, selectedPartners, selectedCategories})}
          >
             Lọc
          </Button>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
            onClick={handleClearFilter}
          >
            Xóa tất cả
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProductFilters.propTypes = {
  handleFilter: PropTypes.func,
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};
