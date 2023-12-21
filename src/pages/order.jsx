/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

// ----------------------------------------------------------------------

import { AxiosError } from "axios";
import { useState, useEffect } from "react";

import { Box, Paper, Stack, Table, Button, Select, Popover, TableRow, MenuItem, TableBody, TableCell, TableHead, Typography, IconButton, Pagination, TableContainer } from "@mui/material";

import { fDate } from "src/utils/date-util";
import { fCurrency } from "src/utils/format-number";
import { isArray, isEmail, isPhone, isString } from "src/utils/validator";

import { orderAPI } from "src/api/api-agent";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import AleartPopup from "src/components/alert-popup/alert-popup";

import CreateOrder from "src/sections/order/create-order";
import UpdateOrder from "src/sections/order/update-order";

import OrderStatusEnum from '../enums/orderStatus';
import PaymentStatusEnum from '../enums/payment-status';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
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
        setActiveOrder(null);
    }

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const queryParams = `page=${page}&perPage=${5}`;

                const getOrdersRes = await orderAPI.getAll(queryParams);
                const tempOrders = getOrdersRes.data;
                setOrders(tempOrders.data);
                setTotalPage(tempOrders.totalPage)
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

    const validateFormData = (data) => {
        switch(true){
            case (!isString(data.receiverFullName)):{
                setErrorMessage('Tên người nhận không hợp lệ')
                return false;
            }

            case (!isEmail(data.receiverEmail)):{
                setErrorMessage('Địa chỉ email không hợp lệ')
                return false;
            }

            case (!isPhone(data.receiverPhone)):{
                setErrorMessage('Số điện thoại không hợp lệ')
                return false;
            }

            case (!isString(data.receiverAddress)):{
                setErrorMessage('Địa chỉ không hợp lệ')
                return false;
            }

            case(!isArray(data.details)):{
                setErrorMessage('Sản phẩm đặt hàng không hợp lệ')
                return false;
            }

            default: {return true;}
        }
    }
    const handleCreateFormSubmit = async (data) => {
        try {
            if(validateFormData(data)){
                await orderAPI.create(
                    data
                );
                const tempOrders = [...orders, {
                    ...data,
                    status: 'pending',
                    paymentStatus: 'pending',
                    totalPrice: orders.details.reduce((total, d) => total + (d.quantity * d.price), 0)
                }];
                setOrders(tempOrders);
                setSuccessfulMessage(`Thêm đơn hàng thành công, xin cảm ơn `)
                handleCloseCreateModal();   
            } 
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm đơn hàng thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const handleUpdateFormSubmit = async (data) => {
        try {
            await orderAPI.update(
                activeOrder._id,
                data
            );
            const tempOrders = orders.map(o => {
                if(o._id === activeOrder._id){
                    o.status = data.status;
                    if(data.status === 'success') o.paymentStatus = 'success';
                    if(data.status === 'failed') o.paymentStatus = 'failed';
                }

                return o;
            });
            setOrders(tempOrders);
            setSuccessfulMessage(`Cập nhật đơn hàng thành công, xin cảm ơn `)
            handleCloseUpdateModal();    
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Cập nhật đơn hàng thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
    }

    const renderTableHeader = (
        <TableRow>
            <TableCell align="left">
                Tên khách hàng
            </TableCell>

            <TableCell align="left">
                Số diện thoại
            </TableCell>

            <TableCell align="left">
                Địa chỉ email
            </TableCell>

            <TableCell align="left">
                Địa chỉ nhận hàng
            </TableCell>

            <TableCell align="left">
                Ngày đặt hàng
            </TableCell>

            <TableCell align="left">
                Chi tiết
            </TableCell>

            <TableCell align="left">
                Tổng giá tiền
            </TableCell>

            <TableCell align="left">
                Trạng thái đơn 
            </TableCell>

            <TableCell align="left">
                Thanh toán
            </TableCell>

            <TableCell align="left">
                Tương tác
            </TableCell>
        </TableRow>
    )

    const renderTableBody = (
        orders.map(order => (
                <TableRow>
                <TableCell align="left">
                    {order.receiverFullName}
                </TableCell>

                <TableCell align="left">
                    {order.receiverPhone}
                </TableCell>

                <TableCell align="left">
                    {order.receiverEmail}
                </TableCell>

                <TableCell align="left">
                    {order.receiverAddress}
                </TableCell>

                <TableCell align="left">
                    {fDate(order.orderAt)}
                </TableCell>
            
                <TableCell align="left">
                    <Select value={order.details[0]?.productName}>
                        {
                            order.details.map(detail => (
                                <MenuItem value={detail.productName}>
                                    Sản phẩm: <strong>{detail.productName}</strong>  <br/>
                                    Số lượng: <strong>{detail.quantity}</strong> <br/>
                                    Giá: <strong>{fCurrency(detail.price)}đ</strong>
                                </MenuItem> 
                            ))
                        }
                    </Select>
                </TableCell>

                <TableCell>
                    {fCurrency(order.totalPrice)}đ
                </TableCell>

                <TableCell >
                    <Label color={(order.status === 'failed' && 'error') || 'success'}>
                        {OrderStatusEnum[order.status]}
                    </Label>
                </TableCell>

                <TableCell >
                    <Label color={(order.paymentStatus === 'failed' && 'error') || 'success'}>
                        {PaymentStatusEnum[order.paymentStatus]}
                    </Label>
                </TableCell>

                <TableCell align="left" onClick={() => setActiveOrder(order)}>
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
            <Typography variant="h5">Đơn hàng</Typography>
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
        
        <CreateOrder
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
            showErrorMessage={setErrorMessage}
        />

        <UpdateOrder
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
        /> 

        <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}




