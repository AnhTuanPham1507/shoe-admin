/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

import Pagination from '@mui/material/Pagination';
import { Box, Paper, Stack, Table, Button, Select, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, TableContainer } from "@mui/material";

import { isArray, isString } from "src/utils/validator";

import { seasonalCategoryAPI } from "src/api/api-agent";

import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreateSeasonalCategory from "src/sections/seasonal-category/create-seasonal-category";
import UpdateSeasonalCategory from "src/sections/seasonal-category/update-seasonal-category";
import DeleteSeasonalCategory from "src/sections/seasonal-category/delete-seasonal-category";

export default function SeasonalCategoryPage() {
    const [seasonalCategories, setSeasonalCategories] = useState([]);
    const [activeSeasonalCategory, setActiveSeasonalCategory] = useState(null);
    const [open, setOpen] = useState(null);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [title, setTitle] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [color, setColor] = useState(null);

    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleShowCreateModal = () => {
        setIsShowCreateModal(true)
    }

    const handleCloseCreateModal = () => {
        setIsShowCreateModal(false)
    }

    const handleShowUpdateModal = () => {
        setIsShowUpdateModal(true)
        setOpen(false)
    }

    const handleCloseUpdateModal = () => {
        setIsShowUpdateModal(false)
        setActiveSeasonalCategory(null);
    }

    const handleShowDeleteModal = () => {
        setIsShowDeleteModal(true)
        setOpen(false)
    }

    const handleCloseDeleteModal = () => {
        setIsShowDeleteModal(false)
        setActiveSeasonalCategory(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getSeasonalCategoryRes = await seasonalCategoryAPI.getAll(queryParams);
                const tempSeasonalCategories = getSeasonalCategoryRes.data;
                setSeasonalCategories(tempSeasonalCategories.data);
                setTotalPage(tempSeasonalCategories.totalPage);
            } catch (error) {
                console.log(error);
            }
        }
        getInitialData();
    }, [page])

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

    const validateCreateFormData = (data) => {
        switch(true){
            case (!isString(data.name)):{
                setErrorMessage('Tên loại sản phẩm không hợp lệ')
                return false;
            }

            case (!isArray(data.images)):{
                setErrorMessage('Chuỗi hình ảnh không hợp lệ')
                return false;
            }

            case (!isArray(data.selectedProducts)):{
                setErrorMessage('Chuỗi sản phẩm không hợp lệ')
                return false;
            }

            case (!isString(data.colorCode, true)):{
                setErrorMessage('Màu chủ đạo không hợp lệ')
                return false;
            }

            default: {return true;}
        }
    }

    const handleCreateFormSubmit = async (data) => {
        try {
            if(validateCreateFormData(data)) {
                const formData = new FormData();
                formData.append('name', data.name);
                data.selectedProducts.forEach(selectedProduct => {
                    formData.append('productIds[]',selectedProduct);
                })
                formData.append('colorCode', data.colorCode);
                data.images.forEach(image => {
                    formData.append('images[]', image);
                })

                const createSeasonalCategoryRes = await seasonalCategoryAPI.create(
                   formData
                );
                const tempSeasonalCategories = [...seasonalCategories, createSeasonalCategoryRes.data];
                setSeasonalCategories(tempSeasonalCategories);
                setSuccessfulMessage(`Thêm loại sản phẩm thành công, xin cảm ơn `)
                handleCloseCreateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm loại sản phẩm thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const validateUpdateFormData = (data) => {
        switch(true){
            case (!isString(data.name)):{
                setErrorMessage('Tên loại sản phẩm không hợp lệ')
                return false;
            }

            case (!isArray(data.images)):{
                setErrorMessage('Chuỗi hình ảnh không hợp lệ')
                return false;
            }

            case (!isArray(data.uploadImages)):{
                setErrorMessage('Chuỗi hình ảnh không hợp lệ')
                return false;
            }

            case (!isArray(data.selectedProducts)):{
                setErrorMessage('Chuỗi sản phẩm không hợp lệ')
                return false;
            }

            case (!isString(data.colorCode)):{
                setErrorMessage('Màu chủ đạo không hợp lệ')
                return false;
            }

            default: {return true;}
        }
    }

    const handleUpdateFormSubmit = async (data) => {
        try {
            if(validateUpdateFormData(data)) {
                const formData = new FormData();
                formData.append('payload', JSON.stringify(data));

                data.uploadImages.forEach(image => {
                    formData.append('images[]', image);
                })


                const updateSeasonalCategoryRes = await seasonalCategoryAPI.update(
                   activeSeasonalCategory._id,
                   formData
                );
                const tempCategories = [...seasonalCategories.filter(cate => cate._id !==activeSeasonalCategory._id), updateSeasonalCategoryRes.data];
                setSeasonalCategories(tempCategories);
                setSuccessfulMessage(`Cập nhật loại sản phẩm thành công, xin cảm ơn `)
                handleCloseUpdateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Cập nhật loại sản phẩm thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleDeleteFormSubmit = async () => {
        try {
             await seasonalCategoryAPI.delete( activeSeasonalCategory._id );
            const tempCategories = seasonalCategories.filter(cate => cate._id !==activeSeasonalCategory._id);
            setSeasonalCategories(tempCategories);
            setSuccessfulMessage(`Xóa loại sản phẩm thành công, xin cảm ơn `);
            handleCloseDeleteModal();

        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Xóa loại sản phẩm thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const renderTableHeader = (
        <TableRow>
          <TableCell align="left">
              Tên loại
          </TableCell>

          <TableCell align="left">
              Sản phẩm
          </TableCell>

          <TableCell align="left">
              Màu chủ đạo
          </TableCell>
    
          <TableCell align="left">
              Hình ảnh
          </TableCell>

          <TableCell align="left">
              Tương tác
          </TableCell>
        </TableRow>
    )

    const renderTableBody = (
        seasonalCategories.map(seasonalCategory => (
            <TableRow>
                <TableCell align="left">
                    {seasonalCategory.name}
                </TableCell>

                <TableCell>
                    <Select value={seasonalCategory.productIds[0]._id}>
                        {
                            seasonalCategory.productIds.map(product => (
                                <MenuItem value={product._id}>
                                   {product.name}
                                </MenuItem> 
                            ))
                        }
                    </Select>
                </TableCell>

                <TableCell align="left">
                    {seasonalCategory.colorCode}
                </TableCell>

            
                <TableCell align="left">
                    <Carousel sx="lg">
                            {
                            seasonalCategory.images?.map(image => (
                                <Paper style={{width: '20em', height: '10em'}}>
                                        <img  width="100%" height="100%" src={image.path} alt={image.name} />
                                </Paper>
                            ))
                            }
                    </Carousel>
                </TableCell>

                <TableCell align="left" onClick={() => setActiveSeasonalCategory(seasonalCategory)}>
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
                    <MenuItem onClick={() => {handleShowUpdateModal()}}>
                        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                        Chỉnh sửa
                    </MenuItem>

                    <MenuItem onClick={() => {handleShowDeleteModal()}} sx={{ color: 'error.main' }}>
                        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                        Xóa
                    </MenuItem>
                </Popover>
            </TableRow>
        ))
    )

    return (
        <>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Loại sản phẩm theo mùa</Typography>
            <Stack direction="row">
                <Button onClick={() => {handleShowCreateModal()}} style={{marginLeft: '10px'}} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
                    Tạo mới
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

        <Stack alignItems="center" justifyItems="center" >
            <Pagination count={totalPage} siblingCount={3} page={page} onChange={(e, value) => setPage(value)}/>
        </Stack>
        
        <CreateSeasonalCategory
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
        />

        <UpdateSeasonalCategory
            seasonalCategory={activeSeasonalCategory}
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        />

        <DeleteSeasonalCategory  
            seasonalCategory={activeSeasonalCategory}
            isShow={isShowDeleteModal}
            onFormSubmit={handleDeleteFormSubmit}
            onClose={handleCloseDeleteModal}
        />

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




