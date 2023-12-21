import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";

import { Box, Stack, Button, Dialog, FormLabel, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { productAPI } from "src/api/api-agent";

export default function CreateSeasonalCategory({isShow, onFormSubmit, onClose}) {
    const [name, setName] = useState(null);
    const [colorCode, setColorCode] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([])

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
                    setImages(Object.values(e.target.files).slice(0, 4))
                }} />
            </Button>
            <Stack direction='Row'>
                {
                    images.map(image => (
                        <img style={{marginRight: '2px'}} width="100px" height="100px" src={URL.createObjectURL(image)} alt='hình' />
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
                    return {
                        label: foundProduct.name,
                        value: foundProduct._id
                    }
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
                    <Button onClick={() => {onFormSubmit({name,colorCode, images, selectedProducts})}}>Lưu</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

CreateSeasonalCategory.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func
}