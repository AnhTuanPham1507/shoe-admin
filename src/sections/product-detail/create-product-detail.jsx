/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { MultiSelect } from 'react-multi-select-component';

import { Box, Stack, Button, Dialog, Select, MenuItem, FormLabel, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { fCurrency, deCodeCurrenry } from 'src/utils/format-number';



export default function CreateProductDetailModal({onFormSubmit, isShow, mainClassification, subClassification, onClose}){
    const [mainClassificationValue, setMainClassificationValue] = useState(null);
    const [subClassificationValues, setSubClassificationValues] = useState([]);
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const renderMainClassification = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>{mainClassification.title} <span style={{color:"red"}}>*</span></strong></FormLabel>
            <Select value={mainClassificationValue} onChange={(e) => setMainClassificationValue(e.target.value)} required>
                {
                    mainClassification.values.map((value, index) => (
                        <MenuItem id={`mainClassification-${index}`} value={value}>{value}</MenuItem>
                    ))
                }
            </Select>
        </Stack>
    )

    const renderSubClassification = (
        subClassification ?
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>{subClassification.title}<span style={{color: 'red'}}>*</span></strong></FormLabel>
            <MultiSelect
                options={
                    subClassification.values.map(value => ({
                        label: value,
                        value
                    }))
                }
                overrideStrings={{
                    selectAll:"Chọn tất cả", 
                    selectSomeItems: `${subClassification.title}...`,
                    search: 'Tìm kiếm',
                    allItemsAreSelected: `Tất cả ${subClassification.title}`,
                    noOptions: `Không tìm thấy ${subClassification.title} này`,
                }}
                value={subClassificationValues.map(subClassificationValue => ({
                    label: subClassificationValue.value,
                    value: subClassificationValue.value
                }))}
                onChange={(e) => {
                     const tempSubClassificationValues = e.map(
                        (item) => {
                           const foundSubClassification = subClassificationValues.find(v => v.value === item.value);
                            console.log(foundSubClassification || {
                                value: item.value,
                                price: 0,
                                quantity: 0
                            })
                           return foundSubClassification || {
                                value: item.value,
                                price: 0,
                                quantity: 0
                            }
                        }
                    )

                    setSubClassificationValues(tempSubClassificationValues);
                }}
            />
        </Stack>: <div />
    )

    const renderPriceAndQuantity = (
        subClassification ?
        subClassificationValues.map(subClassificationValue => (
            <Stack direction='Row' alignItems="flexStart" justifyContent="flexStart">
                <FormLabel style={{width: '5em'}}><strong>{mainClassificationValue.toUpperCase()} - {subClassificationValue.value.toUpperCase()}:</strong></FormLabel>
                <Stack paddingLeft={2} style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                    <FormLabel><strong>Giá<span style={{color:"red"}}>*</span></strong></FormLabel>
                    <TextField patter="^[0-9]*$" size='small' value={fCurrency(subClassificationValue.price)} onChange={(e) => {
                            const tempValues = subClassificationValues.map(v => {
                                if(v.value === subClassificationValue.value){
                                    v.price = deCodeCurrenry(e.target.value);
                                }
                                return v;
                            });
                            setSubClassificationValues(tempValues)
                        }} required/>
                </Stack>
                <Stack paddingLeft={2} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                    <FormLabel><strong>Số lượng tồn</strong></FormLabel>
                    <TextField type='number' size='small' value={subClassificationValue.quantity} onChange={(e) => {
                         const tempValues = subClassificationValues.map(v => {
                            if(v.value === subClassificationValue.value){
                                v.quantity = Number.parseInt(e.target.value, 10);
                            }
                            return v;
                        });
                        setSubClassificationValues(tempValues)
                        }} required/>
                </Stack>
            </Stack>
        )) :
        <>
            <Stack paddingLeft={2} style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                <FormLabel><strong>Giá<span style={{color:"red"}}>*</span></strong></FormLabel>
                <TextField patter="^[0-9]*$" size='small' value={fCurrency(price)} onChange={(e) => setPrice(deCodeCurrenry(e.target.value))} required/>
            </Stack>
            <Stack paddingLeft={2} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                <FormLabel><strong>Số lượng tồn</strong></FormLabel>
                <TextField type='number' size='small' value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
            </Stack>
        </>
    )

    const renderImages = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Hình ảnh</strong></FormLabel>
            <Button
                component="label"
                variant="outlined"
                sx={{ marginRight: "1rem" }}
            >
                Tải hình ảnh
                <input  multiple type="file" accept="image/*" hidden onChange={(e) => {
                    setImages(Object.values(e.target.files).slice(0, 4))
                }} />
            </Button>
            <Stack direction='Row'>
            {
                images.map((image) => (
                    <img style={{marginRight: '2px'}} width="100px" height="100px" src={URL.createObjectURL(image)} alt='hình' />
                ))
            }
            </Stack>
        </Stack>
    )

    useEffect(() => {
        if(mainClassification)
            setMainClassificationValue(mainClassification.values[0])
    }, [mainClassification])

    return (
        <Dialog  open={isShow}>
            <Box>
                <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                    Thêm chi tiết 
                </DialogTitle>
                <DialogContent>
                    {/* TODO kiểm tra trùng  */}
                    {renderMainClassification}
                    {renderSubClassification}
                    {renderPriceAndQuantity}
                    {renderImages}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {onFormSubmit({mainClassificationValue, subClassificationValues, price, quantity, images})}}>Tạo</Button>
                    <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

CreateProductDetailModal.propTypes = {
    onFormSubmit: PropTypes.func,
    mainClassification: PropTypes.object,
    subClassification: PropTypes.object,
    onClose: PropTypes.func,
    isShow: PropTypes.bool
}