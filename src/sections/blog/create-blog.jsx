import { useState } from "react";
import PropTypes from 'prop-types';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function CreateBlog({isShow, onFormSubmit, onClose}) {
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const [authorName, setAuthorName] = useState(null);
    const [content, setContent] = useState(null);
    const [shortDescription, setShortDescription] = useState(null);

    const renderTitleInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tiêu đề<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên thiệt hay...' size='small' value={title} onChange={(e) => setTitle(e.target.value)} required/>
        </Stack>
    )

    const renderImageInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Hình ảnh<span style={{color:"red"}}>*</span></strong></FormLabel>
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
                <img style={{marginRight: '2px'}} width="100px" height="100px" src={image && URL.createObjectURL(image)} alt='hình' />
            </Stack>
        </Stack>
    )

    const renderAuthorNameInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tên tác giả<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên thiệt hay...' size='small' value={authorName} onChange={(e) => setAuthorName(e.target.value)} required/>
        </Stack>
    )

    const renderShortDescriptionInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Mô tả ngắn<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='mô tả...' size='small' value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required/>
        </Stack>
    )

    const renderContentInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Nội dung<span style={{color:"red"}}>*</span></strong></FormLabel>
            <CKEditor
                editor={ ClassicEditor }
                data={content}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setContent(data);
                } }
            /> 
        </Stack>
    )

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Thêm bài viết
                </DialogTitle>
                <DialogContent>
                    {renderTitleInput}
                    {renderShortDescriptionInput}
                    {renderContentInput}
                    {renderImageInput}
                    {renderAuthorNameInput}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({title,image, authorName, content, shortDescription})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

CreateBlog.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}