import { useState } from "react";
import PropTypes from 'prop-types';

import { Box, Stack, Button, Dialog, Select, MenuItem, FormLabel, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function UpdateImportWarehouseOrder({isShow, onFormSubmit, onClose}) {
    const [status, setStatus] = useState(null);

    const renderStatusInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Trạng thái<span style={{color:"red"}}>*</span></strong></FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value='success'>Thành công</MenuItem>
                <MenuItem value='failed'>Hủy bỏ</MenuItem>
            </Select>
        </Stack>
    )

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Cập nhật trạng thái đơn nhập
                </DialogTitle>
                <DialogContent>
                    {renderStatusInput}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({status})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

UpdateImportWarehouseOrder.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}