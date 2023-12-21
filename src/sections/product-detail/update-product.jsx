/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Box, Stack, Select, Button, Dialog, MenuItem, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { imageAPI } from 'src/api/api-agent';




export default function UpdateProduct({isShow, onFormSubmit, onClose, product}) {
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [status, setStatus] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if(product){
            setName(product.name);
            setDescription(product.description);
            setStatus(product.status);
            setImages(product.images);
        }
    }, [product])

    const renderNameInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tên sản phẩm<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên sản phẩm thiệt hay...' size='small' value={name} onChange={(e) => setName(e.target.value)} required/>
        </Stack>
    )

    const renderDescriptionInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Mô tả:</strong></FormLabel>
            <CKEditor
                editor={ ClassicEditor }
                data={description}
                onChange={ ( _event, editor ) => {
                    const data = editor.getData();
                    setDescription(data);
                } }
            /> 
        </Stack>
    )

    const renderStatusInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Trạng thái:</strong></FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value='new'>Mới</MenuItem>
                <MenuItem value='active'>Đang bán</MenuItem>
                <MenuItem value='inactive'>Ngừng bán</MenuItem>
            </Select>
        </Stack>
    )

    const uploadImages = async (_images, _id) => {
        try {
            const formData = new FormData();
            _images.forEach(image => {
                formData.append('images[]', image);
            })

            const uploadImagesRes = await imageAPI.create(formData);
            const tempImages = images.map(ima => {
                if(ima._id === _id){
                    ima.values.push(...uploadImagesRes.data)
                }

                return ima;
            });
            setImages(tempImages)
        } catch (error) {
            console.log(error);
        }
    }

    const detroyImage = async (imageName) => {
        try {
            await imageAPI.delete(imageName);
            const tempImages = images.map(ima => {
                ima.values = ima.values.filter(i => i.name !== imageName);
                return ima;
            });
            setImages(tempImages)
        } catch (error) {
            console.log(error)
        }
    }

    const renderImageInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Hình ảnh:</strong></FormLabel>
            {
                product.images.map(image => (
                    <Stack paddingLeft={2} style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                            <FormLabel style={{textAlign: 'center'}}><strong>Màu {image.mainClassificationValue}</strong></FormLabel>
                        <Button
                            component="label"
                            variant="outlined"
                            sx={{ marginRight: "1rem" }}
                        >
                            Tải hình ảnh
                            <input  multiple type="file" accept="image/*" hidden onChange={(e) => {
                                uploadImages(Object.values(e.target.files).slice(0, 4), image._id)
                            }} />
                        </Button>
                        <Stack direction='Row'>
                        {
                            image.values.map((value) => (
                                <div style={{ position: 'relative' }}>
                                    <span 
                                        key={value._id}
                                        style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            zIndex: 100,
                                            color: 'red',
                                            cursor: 'pointer'
                                        }}
                                        aria-hidden="true"
                                        onClick={(_e) => {detroyImage(value.name)}}
                                    >&times;</span>
                                    <img style={{marginRight: '2px'}} width="100px" height="100px" src={value.path} alt='hình' />
                                </div>
                            ))
                        }
                        </Stack>
                    </Stack>
                ))
            }
        </Stack>
    )

    const renderCategorySelections = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Loại sản phẩm</strong></FormLabel>
            <Select value={product?.category.name} disabled>
                <MenuItem value={product?.category.name}>{product?.category.name}</MenuItem>
            </Select>
        </Stack>
    )

    const renderPartnerSelections = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Thương hiệu</strong></FormLabel>
            <Select value={product?.partner.name} disabled>
                <MenuItem value={product?.partner.name}>{product?.partner.name}</MenuItem>
            </Select>
        </Stack>
    )

    
    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Chỉnh sửa  
                </DialogTitle>
                <DialogContent>
                    {renderNameInput}
                    {renderDescriptionInput}
                    {renderStatusInput}
                    {renderImageInput}
                    {renderCategorySelections}
                    {renderPartnerSelections}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({name, description, images, status})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

UpdateProduct.propTypes = {
    product: PropTypes.object,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}