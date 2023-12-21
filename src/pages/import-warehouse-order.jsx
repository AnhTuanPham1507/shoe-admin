/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";

import { Box, Paper, Stack, Table, Button, Select, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, Pagination, TableContainer } from "@mui/material";

import { fDate } from "src/utils/date-util";
import { fCurrency } from "src/utils/format-number";

import OrderStatusEnum from "src/enums/orderStatus";
import { importWarehouseOrderAPI } from "src/api/api-agent";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreateImportWarehouseOrder from "src/sections/import-warehouse-order/create-import-warehouse-order";
import UpdateImportWarehouseOrder from "src/sections/import-warehouse-order/update-import-warehouse-order";

export default function ImportWarehouseOrderPage() {
    const [importWarehouseOrders, setImportWarehouseOrders] = useState([]);
    const [activeImportWarehouseOrder, setActiveImportWarehouseOrder] = useState(null);
    const [open, setOpen] = useState(null);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
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
        setActiveImportWarehouseOrder(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getImportWarehouseOrdersRes = await importWarehouseOrderAPI.getAll(queryParams);
                const tempImportWarehouseOrders = getImportWarehouseOrdersRes.data;
                setImportWarehouseOrders(tempImportWarehouseOrders.data);
                setTotalPage(tempImportWarehouseOrders.totalPage)
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
    const handleCreateFormSubmit = async (data) => {
        try {
            const createImportWarehouseOrderRes = await importWarehouseOrderAPI.create(
                data
            );
            const tempImportWarehouseOrders = [...importWarehouseOrders, createImportWarehouseOrderRes.data];
            setImportWarehouseOrders(tempImportWarehouseOrders);
            setSuccessfulMessage(`Thêm đơn nhập hàng thành công, xin cảm ơn `)
            handleCloseCreateModal();    
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm đơn nhập hàng thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleUpdateFormSubmit = async (data) => {
        try {
            await importWarehouseOrderAPI.update(
                activeImportWarehouseOrder._id,
                data
            );
            const tempImportWarehouseOrders = importWarehouseOrders.map(o => {
                if(o._id === activeImportWarehouseOrder._id){
                    o.status = data.status;
                }

                return o;
            });
            setImportWarehouseOrders(tempImportWarehouseOrders);
            setSuccessfulMessage(`Cập nhật đơn nhập hàng thành công, xin cảm ơn `)
            handleCloseUpdateModal();    
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Cập nhật đơn nhập hàng thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const renderTableHeader = (
        <TableRow>

          <TableCell align="left">
              Người đặt hàng
          </TableCell>
          <TableCell align="left">
              Ngày nhập hàng
          </TableCell>

          <TableCell align="left">
              Chi tiết
          </TableCell>

          <TableCell align="left">
              Tổng giá tiền
          </TableCell>

          <TableCell align="left">
              Trạng thái
          </TableCell>

          <TableCell align="left">
              Tương tác
          </TableCell>
        </TableRow>
    )

    const renderTableBody = (
        importWarehouseOrders.map(importWarehouseOrder => (
                <TableRow>
                <TableCell align="left">
                    {importWarehouseOrder.creator.fullName}
                </TableCell>

                <TableCell align="left">
                    {fDate(importWarehouseOrder.importedAt)}
                </TableCell>
            
                <TableCell align="left">
                    <Select value={importWarehouseOrder.details[0]?._id}>
                        {
                            importWarehouseOrder.details.map(detail => (
                                <MenuItem value={detail._id}>
                                    Sản phẩm: <strong>{detail.productName}</strong>  <br/>
                                    Số lượng: <strong>{detail.quantity}</strong> <br/>
                                    Giá: <strong>{fCurrency(detail.price)}đ</strong>
                                </MenuItem> 
                            ))
                        }
                    </Select>
                </TableCell>

                <TableCell>
                    {fCurrency(importWarehouseOrder.totalPrice)}đ
                </TableCell>

                <TableCell >
                    <Label color={(importWarehouseOrder.status === 'failed' && 'error') || 'success'}>
                        {OrderStatusEnum[importWarehouseOrder.status]}
                    </Label>
                </TableCell>

                <TableCell align="left" onClick={() => setActiveImportWarehouseOrder(importWarehouseOrder)}>
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
                    <MenuItem onClick={() => handleShowUpdateModal()}>
                        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                        Chỉnh sửa
                    </MenuItem>
                </Popover>
            </TableRow>
            )
        )
    )

    return (
        <>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Đơn nhâp hàng</Typography>
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
        
         <CreateImportWarehouseOrder
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
            showErrorMessage={setErrorMessage}
        />

        <UpdateImportWarehouseOrder
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        /> 

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




