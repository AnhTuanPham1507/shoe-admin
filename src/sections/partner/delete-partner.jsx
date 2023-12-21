import PropTypes from 'prop-types';

import { Box, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";

export default function DeletePartner({isShow, onFormSubmit, onClose, partner}) {

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Bạn có chắc xóa đối tác {partner?.name} 
                </DialogTitle>  
                <DialogActions>
                    <Button onClick={() => {onFormSubmit()}}>Xác nhận</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

DeletePartner.propTypes = {
    partner: PropTypes.object,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}