import { isString } from 'lodash';
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function UpdatePartner({isShow, onFormSubmit, onClose, partner}) {
    const [name, setName] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if(partner) {
            setName(partner.name);
            setImage(partner.image.path);
        }
    },[partner])

    const renderNameInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tên đối tác<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên thiệt hay...' size='small' value={name} onChange={(e) => setName(e.target.value)} required/>
        </Stack>
    )

    const renderImageInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Hình ảnh</strong></FormLabel>
            <Button
                component="label"
                variant="outlined"
                sx={{ marginRight: "1rem" }}
            >
                Tải hình ảnh
                <input type="file" accept="image/*" hidden onChange={(e) => {
                    setImage(e.target.files[0])
                }} />
            </Button>
            <Stack direction='Row'>
                <img style={{marginRight: '2px'}} width="100px" height="100px" src={isString(image) ? image : (image && URL.createObjectURL(image))} alt='hình' />
            </Stack>
        </Stack>
    )

    

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Cập nhật thông tin đối tác 
                </DialogTitle>
                <DialogContent>
                    {renderNameInput}
                    {renderImageInput}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({name,image})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

UpdatePartner.propTypes = {
    partner: PropTypes.object,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}