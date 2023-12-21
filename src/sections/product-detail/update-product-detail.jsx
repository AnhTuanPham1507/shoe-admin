/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { fCurrency, deCodeCurrenry } from 'src/utils/format-number';



export default function UpdateProductDetailModal({onFormSubmit, isShow, productDetail, onClose}){
    const [price, setPrice] = useState(0);

    const renderPrice = (
        <Stack paddingLeft={2} style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Giá<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField patter="^[0-9]*$" size='small' value={fCurrency(price)} onChange={(e) => setPrice(deCodeCurrenry(e.target.value))} required/>
        </Stack>
    )


    useEffect(() => {
        if(productDetail)
            setPrice(productDetail.price)
    }, [productDetail])

    return (
        <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Chỉnh sửa chi tiết 
                </DialogTitle>
                <DialogContent>
                    {/* TODO kiểm tra trùng  */}
                    {renderPrice}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({ price})}}>Cập nhật</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

UpdateProductDetailModal.propTypes = {
    onFormSubmit: PropTypes.func,
    productDetail: PropTypes.object,
    onClose: PropTypes.func,
    isShow: PropTypes.bool
}