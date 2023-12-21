/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { productAPI } from "src/api/api-agent";

export default function UpdateSeasonalCategory({isShow, onFormSubmit, onClose, seasonalCategory}) {
    const [name, setName] = useState(null);
    const [colorCode, setColorCode] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([])

    const [uploadImages, setUploadImages] = useState([]);

    useEffect(
        () => {
          const getProductList = async () => {
            try {
    
              const getProductListRes = await productAPI.getAll();
              const tempProductList = getProductListRes.data;
    
              setProducts(tempProductList.data);
            } catch (error) {
              console.log(error)
            }
          }
    
          getProductList();
        }, []
    )

    useEffect(() => {
        if(seasonalCategory){
            setName(seasonalCategory.name);
            setColorCode(seasonalCategory.colorCode);
            setImages(seasonalCategory.images);
            setSelectedProducts(seasonalCategory.productIds.map(p => p._id))
        }
    }, [seasonalCategory])

    const handleRemoveImage = async (image) => {
        let tempImages = []
        if(image.path){
            tempImages = images.filter(i => i.path !== image.path);
            setImages(tempImages);
        } else {
            tempImages = uploadImages.filter(i => i.name !== image.name);
            setUploadImages(tempImages);
        }
    }


    const renderNameInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tên sản phẩm<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên thiệt hay...' size='small' value={name} onChange={(e) => setName(e.target.value)} required/>
        </Stack>
    )

    const renderColorCodeInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Chọn màu chủ đạo</strong></FormLabel>
            <SketchPicker color={colorCode} onChange={(e) => setColorCode(e?.hex)}/>        
        </Stack>
    )

    const renderImageInputs = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Hình ảnh<span style={{color:"red"}}>*</span></strong></FormLabel>
            <Button
                component="label"
                variant="outlined"
                sx={{ marginRight: "1rem" }}
            >
                Tải hình ảnh
                <input multiple type="file" accept="image/*" hidden onChange={(e) => {
                    setUploadImages(Object.values(e.target.files).slice(0, 8));
                }} />
            </Button>
            <Stack direction='Row'>
                {
                    images.map(image => (
                        <div style={{
                            width: '100px',
                            height: '100px',
                            position: 'relative',
                        }}>
                            <img 
                                style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                right: '2px',
                                top: '2px',
                                }} 
                                src="http://cdn1.iconfinder.com/data/icons/diagona/icon/16/101.png" 
                                alt="a" 
                                onClick={() => {handleRemoveImage(image)}}
                            />
                            <img style={{marginRight: '2px'}} width="100px" height="100px" src={image.path} alt='hình' />
                        </div>
                    ))
                }
                {
                    uploadImages.map(image => (
                        <div style={{
                            width: '100px',
                            height: '100px',
                            position: 'relative',
                        }}>
                            <img 
                                style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                right: '2px',
                                top: '2px',
                                }} 
                                src="http://cdn1.iconfinder.com/data/icons/diagona/icon/16/101.png" 
                                alt="a" 
                                onClick={() => {handleRemoveImage(image)}}
                            />
                            <img style={{marginRight: '2px'}} width="100px" height="100px" src={URL.createObjectURL(image)} alt='hình' />
                        </div>
                    ))
                }
            </Stack>
        </Stack>
    )


    const renderProductInputs = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Chọn sản phẩm hiển thị<span style={{color:"red"}}>*</span></strong></FormLabel>
            <MultiSelect
                options={
                    products.map(product => ({
                        label: product.name,
                        value: product._id
                    }))
                }
                overrideStrings={{
                    selectAll:"Chọn tất cả", 
                    selectSomeItems: `sản phẩm...`,
                    search: 'Tìm kiếm',
                    allItemsAreSelected: `Tất cả sản phẩm`,
                    noOptions: `Không tìm thấy sản phẩm này`,
                }}
                value={selectedProducts.map(p => {
                    const foundProduct = products.find(item => item._id === p);
                    if(foundProduct)
                    return {
                        label: foundProduct.name,
                        value: foundProduct._id
                    }
                    return null;
                })}
                onChange={(e) => {
                    const tempSelectedProducts = e.map(item => item.value);
                    setSelectedProducts(tempSelectedProducts);
                }}
            />
        </Stack>
    )
    

    return (     
            <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Thêm phân loại tùy chọn
                </DialogTitle>
                <DialogContent>
                    {renderNameInput}
                    {renderColorCodeInput}
                    {renderProductInputs}
                    {renderImageInputs}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({name,colorCode, images, uploadImages, selectedProducts})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

UpdateSeasonalCategory.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func,
    seasonalCategory: PropTypes.object
}