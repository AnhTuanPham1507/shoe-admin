/* eslint-disable no-unused-vars */

import { AxiosError } from 'axios';
import _, { isNumber } from 'lodash';
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Stack, Table, Paper, Button, Popover, MenuItem, TableHead, Typography, IconButton } from '@mui/material';

import { isString } from 'src/utils/validator';
import { fCurrency } from 'src/utils/format-number';

import { productAPI } from 'src/api/api-agent';
import productStatus from 'src/enums/productStatus';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import AleartPopup from 'src/components/alert-popup/alert-popup';

import UpdateProduct from 'src/sections/product-detail/update-product';
import CreateProductDetailModal from 'src/sections/product-detail/create-product-detail';
import UpdateProductDetailModal from 'src/sections/product-detail/update-product-detail';
// ----------------------------------------------------------------------

export default function ProductDetailPage() {
    const { slug } = useParams();

    const [product, setProduct] = useState(null); 
    const [activeProductDetail, setActiveProductDetail] = useState(null);

    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);

    const [isShowUpdateDetailModal, setIsShowUpdateDetailModal] = useState(false);

    const [message, setMessage] = useState(null);
    const [title, setTitle] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [color, setColor] = useState(null);
  
    const handleCloseCreateModal = () => {
        setIsShowCreateModal(false);
    }

    const handleShowCreateModal = () => {
        setIsShowCreateModal(true);
    }

    const handleCloseUpdateModal = () => {
      setIsShowUpdateModal(false);
  }

  const handleShowUpdateModal = () => {
      setIsShowUpdateModal(true);
  }

    const handleCloseUpdateDetailModal = () => {
      setIsShowUpdateDetailModal(false);
    }

    const handleShowUpdateDetailModal = () => {
      setIsShowUpdateDetailModal(true);
      handleCloseMenu();
    }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
};

const handleCloseMenu = () => {
    setOpen(null);
};

const [open, setOpen] = useState(null);

    
    useEffect(() => {
      const getProduct = async () => {
        try {
            const getProductRes = await productAPI.getBySlug(slug);
            const tempProduct = getProductRes.data;
            setProduct(tempProduct);
        } catch (error) {
            console.log(error);
        }
      }
      getProduct();
    },[slug])

    const setErrorMessage = (_message) => {
      setTitle('Thao tác thất bại');
      setMessage(_message);
      setColor('red');
      setActiveMessage(true);
      setTimeout(() => {
          setActiveMessage(false)
      }, 3000)
    }

    const setSuccessfulMessage = (_message) => {
        setTitle('Thao tác thành công');
        setMessage(_message);
        setColor('green');
        setActiveMessage(true);
        setTimeout(() => {
            setActiveMessage(false)
        }, 3000)
    }

    const handleAddDetailFormSubmit = async (data) => {
      try {
          const formData = new FormData();
          let payload = {};

          if(product.subClassification){
              payload = data.subClassificationValues.map(subValue => ({
                  subClassificationValue: subValue.value,
                  price: subValue.price,
                  quantity: subValue.quantity,
                  mainClassificationValue: data.mainClassificationValue,
              }))
          } else {
              payload = [{
                mainClassificationValue: data.mainClassificationValue,
                quantity: data.quantity,
                price: data.price
              }]
          }
          formData.append('payload', JSON.stringify(payload));
          data.images.forEach(image => {
              formData.append('images[]', image)
          })

          await productAPI.addDetails(
              product._id, formData
          );
            
          setSuccessfulMessage('Thêm chi tiết sản phẩm thành công')
          handleCloseCreateModal();
      } catch (error) {
          console.log(error);
          setErrorMessage(
            error instanceof AxiosError ? error.response.data.message : `Thêm chi tiết sản phẩm thất bại vui lòng thử lại.`
        )
      }
    }

    const validateFormData = (data) => {
        switch(true){
            case (!data.name && !data.description): {
                setErrorMessage('Bạn cần thay đổi ít nhất một trong hai trường dữ liệu để có thể chỉnh sửa');
                return false;
            }
            case (!isString(data.name, true)):{
                setErrorMessage('Tên sản phẩm không hợp lệ')
                return false;
            }

            case (!isString(data.description, true)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }

            default: {return true;}
        }
    }

    const handleUpdateFormSubmit = async (data) => {
        try {
            if(validateFormData(data)) {
                await productAPI.update(
                    product._id,
                    _.omitBy({
                        ...data
                    }, _.isNil
                    )
                );
                if(data.name) {
                  const tempProduct = {...product, name: data.name};
                  setProduct(tempProduct);
                }
                setSuccessfulMessage(`Chỉnh sửa thành công, xin cảm ơn `)
                handleCloseUpdateModal()
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Chỉnh sửa thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleUpdateDetailFormSubmit = async ({price}) => {
      try {
          if(isNumber(price)) {
              await productAPI.updateDetail(
                  activeProductDetail._id,
                  {price}
              );
              console.log(activeProductDetail._id)
              const tempDetails = product.details.map(detail => {
                console.log(detail._id)
                if(detail._id === activeProductDetail._id){
                  detail.price = price;
                }
                return detail;
              })
              
              const tempProduct = {...product, details: tempDetails};
              setProduct(tempProduct);
              setSuccessfulMessage(`Chỉnh sửa thành công, xin cảm ơn `)
              handleCloseUpdateDetailModal();
          } else {
            setErrorMessage('Giá sản phẩm không hợp lệ')
          }
      } catch (error) {
          setErrorMessage(
              error instanceof AxiosError ? error.response.data.message : `Chỉnh sửa thất bại vui lòng thử lại.`
          )
          console.log(error);
      }
  }

    const renderTableBody = (
      product?.details.map((row, index) => (
        <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row._id}
        sx={{ cursor: 'pointer' }}
        >

        <TableCell align="left">{row.mainClassificationValue}</TableCell>
        {row.subClassificationValue && <TableCell align="left">{row.subClassificationValue}</TableCell>}
        <TableCell align="right">{fCurrency(row.price)}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align='left'>
          <Carousel>
                {
                  product.images?.find(i => i.mainClassificationValue === row.mainClassificationValue)?.values.map(image => (
                    <Paper style={{width: '20em', height: '10em'}}>
                      <img  width="100%" height="100%" src={image.path} alt={image.name} />
                    </Paper>
                  ))
                }
          </Carousel>
        </TableCell>
        <TableCell align="right" onClick={(e) => {
          setActiveProductDetail(row);
        }}>
          <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
            sx: { width: 140 },
            }}
          >
            <MenuItem onClick={() => {handleShowUpdateDetailModal()}}>
                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                Chỉnh sửa
            </MenuItem>
          </Popover>
        </TableRow>
    )))

    const renderTableHeader = (
      <TableRow>
          <TableCell
            align="left"
          >
            <TableSortLabel>
              {product?.mainClassification?.title}
            </TableSortLabel>
          </TableCell>
          {
              product?.subClassification &&
              <TableCell
                  align="left"
              >
                  <TableSortLabel>
                      {product?.subClassification?.title}
                  </TableSortLabel>
              </TableCell>
          }
          <TableCell
            align="right"
          >
            <TableSortLabel>
              Giá
            </TableSortLabel>
          </TableCell>
          <TableCell
            align="right"
          >
            <TableSortLabel>
              Số lượng tồn
            </TableSortLabel>
          </TableCell>
          <TableCell
            align="left"
          >
            <TableSortLabel>
              Hình ảnh
            </TableSortLabel>
          </TableCell>

          <TableCell align='right'>
            Tương tác
          </TableCell>
      </TableRow>
    )

    return (
    product &&
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {product?.name} 
            <Label style={{marginLeft: '10px'}} color={(product.status === 'inactive' && 'error') || 'success'}>
              {productStatus[product.status]}
            </Label>
          </Typography>
          
          <Stack direction="row">
            <Button onClick={() => { handleShowUpdateModal()}} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
                Chỉnh sửa
            </Button>
            <Button style={{marginLeft: '10px'}} onClick={() => { handleShowCreateModal()}} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm chi tiết
            </Button>
          </Stack>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
            <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
            >
            <TableHead>
                {renderTableHeader}
            </TableHead>
            <TableBody>
                {renderTableBody}
            </TableBody>
            </Table>
        </TableContainer>
        </Paper>
      </Box>

      <CreateProductDetailModal
          onFormSubmit={handleAddDetailFormSubmit}
          mainClassification={product?.mainClassification}
          subClassification={product?.subClassification}
          isShow={isShowCreateModal}
          onClose={handleCloseCreateModal}
      />

      <UpdateProduct
        isShow={isShowUpdateModal}
        product={product}
        onFormSubmit={handleUpdateFormSubmit}
        onClose={handleCloseUpdateModal}
      />

    <UpdateProductDetailModal
        isShow={isShowUpdateDetailModal}
        productDetail={activeProductDetail}
        onFormSubmit={handleUpdateDetailFormSubmit}
        onClose={handleCloseUpdateDetailModal}
      />

      <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

    </>
  );
}




