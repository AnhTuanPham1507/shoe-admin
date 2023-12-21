import PropTypes from 'prop-types';

import { Box, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";

export default function DeleteCategory({isShow, onFormSubmit, onClose, category}) {

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Bạn có chắc xóa loại sản phẩm {category?.name} 
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => {onFormSubmit()}}>Xác nhận</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

DeleteCategory.propTypes = {
    category: PropTypes.object,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}