/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";

import Pagination from '@mui/material/Pagination';
import { Box, Paper, Stack, Table, Button, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, TableContainer } from "@mui/material";

import { isString } from "src/utils/validator";

import { categoryAPI } from "src/api/api-agent";

import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreateCategory from "src/sections/category/create-category";
import UpdateCategory from "src/sections/category/update-category";
import DeleteCategory from "src/sections/category/delete-category";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
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
        setActiveCategory(null);
    }

    const handleShowDeleteModal = () => {
        setIsShowDeleteModal(true)
        setOpen(false)
    }

    const handleCloseDeleteModal = () => {
        setIsShowDeleteModal(false)
        setActiveCategory(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getCategoriesRes = await categoryAPI.getAll(queryParams);
                const tempCategories = getCategoriesRes.data;
                setCategories(tempCategories.data);
                setTotalPage(tempCategories.totalPage);
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

            default: {return true;}
        }
    }

    const handleCreateFormSubmit = async (data) => {
        try {
            if(validateCreateFormData(data)) {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('image', data.image);

                const createCategoryRes = await categoryAPI.create(
                   formData
                );
                const tempCategories = [...categories, createCategoryRes.data];
                setCategories(tempCategories);
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
            case (!isString(data.name, true)):{
                setErrorMessage('Tên loại sản phẩm không hợp lệ')
                return false;
            }

            default: {return true;}
        }
    }

    const handleUpdateFormSubmit = async (data) => {
        try {
            if(validateUpdateFormData(data)) {
                const formData = new FormData();
                formData.append('name', data.name);
                if(data.image)
                    formData.append('image', data.image);

                const updateCategoryRes = await categoryAPI.update(
                   activeCategory._id,
                   formData
                );
                const tempCategories = [...categories.filter(cate => cate._id !==activeCategory._id), updateCategoryRes.data];
                setCategories(tempCategories);
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
             await categoryAPI.delete( activeCategory._id );
            const tempCategories = categories.filter(cate => cate._id !==activeCategory._id);
            setCategories(tempCategories);
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
              Hình ảnh
          </TableCell>

          <TableCell align="left">
              Tương tác
          </TableCell>
        </TableRow>
    )

    const renderTableBody = (
        categories.map(category => (
            <TableRow>
                <TableCell align="left">
                    {category.name}
                </TableCell>
            
                <TableCell align="left">
                    <img style={{width: '10em', height: '10em'}} src={category.image.path} alt={category.name} />
                </TableCell>

                <TableCell align="left" onClick={() => setActiveCategory(category)}>
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
            <Typography variant="h5">Loại sản phẩm</Typography>
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
        
        <CreateCategory
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
        />

        <UpdateCategory
            category={activeCategory}
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        />

        <DeleteCategory  
            category={activeCategory}
            isShow={isShowDeleteModal}
            onFormSubmit={handleDeleteFormSubmit}
            onClose={handleCloseDeleteModal}
        />

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




