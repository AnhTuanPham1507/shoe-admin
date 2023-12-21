import PropTypes from 'prop-types';
import { useState, useEffect } from "react";

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function CreateBanner({isShow, onFormSubmit, onClose, banner}) {
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const [priority, setPriority] = useState(999);
    const [linkTo, setLinkTo] = useState(null);

    useEffect(() => {
        if(banner){
            setTitle(banner.title);
            setImage(banner.image);
            setPriority(banner.priority);
            setLinkTo(banner.linkTo);
        }
    }, [banner])

    const renderTitleInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tiêu đề<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên thiệt hay...' size='small' value={title} onChange={(e) => setTitle(e.target.value)} required/>
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
                <img style={{marginRight: '2px'}} width="100px" height="100px" src={image && (image.path || URL.createObjectURL(image))} alt='hình' />
            </Stack>
        </Stack>
    )

    const renderPriorityInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Thứ tự</strong></FormLabel>
            <TextField patter="^[0-9]*$" size='small' value={priority} onChange={(e) => {setPriority(e.target.value)}} />
        </Stack>
    )

    const renderLinkToInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Đường dẫn</strong></FormLabel>
            <TextField placeholder='http://domain.com' size='small' value={linkTo} onChange={(e) => setLinkTo(e.target.value)} required/>
        </Stack>
    )

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Thêm hình quảng cáo
                </DialogTitle>
                <DialogContent>
                    {renderTitleInput}
                    {renderImageInput}
                    {renderPriorityInput}
                    {renderLinkToInput}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({title,image, priority, linkTo})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

CreateBanner.propTypes = {
    banner: PropTypes.object,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}