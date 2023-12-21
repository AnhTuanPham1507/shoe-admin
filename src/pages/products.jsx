/* eslint-disable react/button-has-type */
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Pagination } from '@mui/material';

// import { products } from 'src/_mock/products';

import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Iconify from 'src/components/iconify';

import { productAPI } from '../api/api-agent';
import ProductSort from '../sections/products/product-sort';
import ProductCard from '../sections/products/product-card';
import ProductFilters from '../sections/products/product-filters';

// ----------------------------------------------------------------------

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(
    () => {
      const getProductList = async () => {
        try {
          const queryParams = `page=${page}&perPage=${5}`;

          const getProductListRes = await productAPI.getAll(queryParams);
          const tempProductList = getProductListRes.data;

          setProducts(tempProductList.data);
          setTotalPage(tempProductList.totalPage)
        } catch (error) {
          console.log(error)
        }
      }

      getProductList();
    }, [page]
  )

  

  return (
    <div>
      <Helmet>
          <title>Sản phẩm</title>
      </Helmet>
      
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography  variant="h4">Sản phẩm </Typography>

          <Button onClick={() => { navigate('create')}} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới
          </Button>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap-reverse"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilters
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />

              <ProductSort />
          </Stack>
        </Stack>

        <Grid container spacing={3}>

          {products.map((product) => (
            <Grid xs={12} sm={6} md={3}>
                <ProductCard product={product} />
            </Grid>
          ))} 
        </Grid>
        <Stack alignItems="center" justifyItems="center" >
            <Pagination count={totalPage} siblingCount={3} page={page} onChange={(e, value) => setPage(value)}/>
        </Stack>
      </Container>
    </div>
  );
}
