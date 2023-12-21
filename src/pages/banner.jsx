/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";

import Pagination from '@mui/material/Pagination';
import { Box, Paper, Stack, Table, Button, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, TableContainer } from "@mui/material";

import { isUrl, isNumber, isString } from "src/utils/validator";

import { bannerAPI } from "src/api/api-agent";

import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreateBanner from "src/sections/banner/create-banner";
import UpdateBanner from "src/sections/banner/update-banner";
import DeleteBanner from "src/sections/banner/delete-banner";

export default function BannerPage() {
    const [banners, setBanners] = useState([]);
    const [activeBanner, setActiveBanner] = useState(null);
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
        setActiveBanner(null);
    }

    const handleShowDeleteModal = () => {
        setIsShowDeleteModal(true)
        setOpen(false)
    }

    const handleCloseDeleteModal = () => {
        setIsShowDeleteModal(false)
        setActiveBanner(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getBannersRes = await bannerAPI.getAll(queryParams);
                const tempBanners = getBannersRes.data;
                setBanners(tempBanners.data);
                setTotalPage(tempBanners.totalPage);
                
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
            case (!isString(data.title)):{
                setErrorMessage('Tên hình quảng cáo không hợp lệ')
                return false;
            }

            case (!isNumber(data.priority, true)):{
                setErrorMessage('Thứ tự hình quảng cáo không hợp lệ')
                return false;
            }

            case (!isUrl(data.linkTo, true)):{
                setErrorMessage('Đường dẫn không hợp lệ')
                return false;
            }


            default: {return true;}
        }
    }

    const handleCreateFormSubmit = async (data) => {
        try {
            if(validateCreateFormData(data)) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('priority', data.priority);
                formData.append('linkTo', data.linkTo);
                formData.append('image', data.image);

                const createBannerRes = await bannerAPI.create(
                   formData
                );
                const tempBanners = [...banners, createBannerRes.data];
                setBanners(tempBanners);
                setSuccessfulMessage(`Thêm hình quảng cáo thành công, xin cảm ơn `)
                handleCloseCreateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm hình quảng cáo thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const validateUpdateFormData = (data) => {
        switch(true){
            case (!isString(data.name, true)):{
                setErrorMessage('Tên hình quảng cáo không hợp lệ')
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

                const updateBannerRes = await bannerAPI.update(
                   activeBanner._id,
                   formData
                );
                const tempBanners = [...banners.filter(cate => cate._id !==activeBanner._id), updateBannerRes.data];
                setBanners(tempBanners);
                setSuccessfulMessage(`Cập nhật hình quảng cáo thành công, xin cảm ơn `)
                handleCloseUpdateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Cập nhật hình quảng cáo thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleDeleteFormSubmit = async () => {
        try {
             await bannerAPI.delete( activeBanner._id );
            const tempBanners = banners.filter(cate => cate._id !==activeBanner._id);
            setBanners(tempBanners);
            setSuccessfulMessage(`Xóa hình quảng cáo thành công, xin cảm ơn `);
            handleCloseDeleteModal();

        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Xóa hình quảng cáo thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const renderTableHeader = (
        <TableRow>
          <TableCell align="left">
              Tiêu đề
          </TableCell>
    
          <TableCell align="left">
              Hình ảnh
          </TableCell>

          <TableCell align="left">
              Thứ tự
          </TableCell>

          <TableCell align="left">
              Đường dẫn
          </TableCell>

          <TableCell align="left">
              Tương tác
          </TableCell>
        </TableRow>
    )

    const renderTableBody = (
        banners.map(banner => (
            <TableRow>
                <TableCell align="left">
                    {banner.title}
                </TableCell>
            
                <TableCell align="left">
                    <img style={{width: '10em', height: '10em'}} src={banner.image.path} alt={banner.title} />
                </TableCell>

                <TableCell align="left">
                    {banner.priority}
                </TableCell>

                <TableCell align="left">
                    {banner.linkTo}
                </TableCell>

                <TableCell align="left" onClick={() => setActiveBanner(banner)}>
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
            <Typography variant="h5">Hình quảng cáo</Typography>
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
        
        <CreateBanner
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
        />

        <UpdateBanner
            banner={activeBanner}
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        />

        <DeleteBanner  
            banner={activeBanner}
            isShow={isShowDeleteModal}
            onFormSubmit={handleDeleteFormSubmit}
            onClose={handleCloseDeleteModal}
        />

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




