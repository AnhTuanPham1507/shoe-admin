/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";

import { Box, Paper, Stack, Table, Button, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, Pagination, TableContainer } from "@mui/material";

import { isString } from "src/utils/validator";

import { partnerAPI } from "src/api/api-agent";

import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreatePartner from "src/sections/partner/create-partner";
import UpdatePartner from "src/sections/partner/update-partner";
import DeletePartner from "src/sections/partner/delete-partner";

export default function PartnerPage() {
    const [partners, setPartners] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
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
        setActivePartner(null);
    }

    const handleShowDeleteModal = () => {
        setIsShowDeleteModal(true)
        setOpen(false)
    }

    const handleCloseDeleteModal = () => {
        setIsShowDeleteModal(false)
        setActivePartner(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getPartnersRes = await partnerAPI.getAll(queryParams);
                const tempPartners = getPartnersRes.data;
                setPartners(tempPartners.data);
                setTotalPage(tempPartners.totalPage)
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
                setErrorMessage('Tên thông tin đối tác không hợp lệ')
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

                const createPartnerRes = await partnerAPI.create(
                   formData
                );
                const tempPartners = [...partners, createPartnerRes.data];
                setPartners(tempPartners);
                setSuccessfulMessage(`Thêm thông tin đối tác thành công, xin cảm ơn `)
                handleCloseCreateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm thông tin đối tác thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const validateUpdateFormData = (data) => {
        switch(true){
            case (!isString(data.name, true)):{
                setErrorMessage('Tên thông tin đối tác không hợp lệ')
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

                const updatePartnerRes = await partnerAPI.update(
                   activePartner._id,
                   formData
                );
                const tempPartners = [...partners.filter(cate => cate._id !==activePartner._id), updatePartnerRes.data];
                setPartners(tempPartners);
                setSuccessfulMessage(`Cập nhật thông tin đối tác thành công, xin cảm ơn `)
                handleCloseUpdateModal();
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Cập nhật thông tin đối tác thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleDeleteFormSubmit = async () => {
        try {
             await partnerAPI.delete(
                activePartner._id,
            );
            const tempPartners = partners.filter(cate => cate._id !==activePartner._id);
            setPartners(tempPartners);
            setSuccessfulMessage(`Xóa thông tin đối tác thành công, xin cảm ơn `)
            handleCloseDeleteModal();
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Xóa thông tin đối tác thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const renderTableHeader = (
        <TableRow>
          <TableCell align="left">
              Tên đối tác
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
        partners.map(partner => (
            <TableRow>
                <TableCell align="left">
                    {partner.name}
                </TableCell>
            
                <TableCell align="left">
                    <img style={{width: '10em', height: '10em'}} src={partner.image.path} alt={partner.name} />
                </TableCell>

                <TableCell align="left" onClick={() => setActivePartner(partner)}>
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
            <Typography variant="h5">Thông tin đối tác</Typography>
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
        
        <CreatePartner
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
        />

        <UpdatePartner
            partner={activePartner}
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        />

        <DeletePartner  
            partner={activePartner}
            isShow={isShowDeleteModal}
            onFormSubmit={handleDeleteFormSubmit}
            onClose={handleCloseDeleteModal}
        />

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




